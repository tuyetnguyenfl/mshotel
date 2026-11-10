
// BeyondMe + original HOTEL shop
// Express API, MongoDB, administrator sessions, blog management,
// and secure image uploads.

import express from 'express';
import { AccessToken } from 'livekit-server-sdk';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { ObjectId } from 'mongodb';
import bcrypt from 'bcrypt';
import { connectMongo, client } from './mongo.js';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import dotenv from 'dotenv';
import multer from 'multer';
import { mkdirSync } from 'fs';
import { randomUUID } from 'crypto';

// -----------------------------------------------------------------------------
// PATHS AND ENVIRONMENT
// -----------------------------------------------------------------------------

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({
  path: join(__dirname, '../.env')
});

const app = express();
const PORT = process.env.PORT || 3000;

// -----------------------------------------------------------------------------
// IMAGE UPLOAD CONFIGURATION
// -----------------------------------------------------------------------------

const uploadDirectory = join(__dirname, '../public/uploads');

mkdirSync(uploadDirectory, { recursive: true });

const allowedImageTypes = {
  'image/jpeg': '.jpg',
  'image/png': '.png',
  'image/webp': '.webp'
};

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, uploadDirectory);
  },

  filename: (req, file, callback) => {
    const extension = allowedImageTypes[file.mimetype];

    callback(null, `${randomUUID()}${extension}`);
  }
});

const imageUpload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024,
    files: 1
  },
  fileFilter: (req, file, callback) => {
    if (!Object.hasOwn(allowedImageTypes, file.mimetype)) {
      return callback(
        new Error('Only JPG, PNG, and WebP images are allowed.')
      );
    }

    callback(null, true);
  }
});

// -----------------------------------------------------------------------------
// ADMINISTRATOR SESSION
// -----------------------------------------------------------------------------

if (!process.env.SESSION_SECRET) {
  throw new Error('SESSION_SECRET is missing from the root .env file.');
}

app.use(session({
  name: 'beyondme.sid',
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,

  store: MongoStore.create({
    client,
    dbName: 'mshotel',
    collectionName: 'sessions',
    ttl: 8 * 60 * 60
  }),

  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 8 * 60 * 60 * 1000
  }
}));

app.use(express.json({ limit: '100kb' }));

// Serve static website files and uploaded images.
app.use(express.static(join(__dirname, '../public')));

// -----------------------------------------------------------------------------
// DATABASE
// -----------------------------------------------------------------------------

let db;
let collection;

// -----------------------------------------------------------------------------
// ADMIN AUTHORIZATION
// -----------------------------------------------------------------------------

function requireAdmin(req, res, next) {
  if (req.session?.isAdmin) {
    return next();
  }

  return res.status(401).json({
    success: false,
    error: 'Administrator login required'
  });
}

app.post('/api/admin/livekit/test-token', requireAdmin, async (req, res, next) => {
  try {
    const { role } = req.body ?? {};

    // Only allow these two testing roles.
    if (!['publisher', 'viewer'].includes(role)) {
      return res.status(400).json({
        success: false,
        error: 'Role must be publisher or viewer'
      });
    }

    // Check that LiveKit credentials are configured.
    const {
      LIVEKIT_URL,
      LIVEKIT_API_KEY,
      LIVEKIT_API_SECRET
    } = process.env;

    if (!LIVEKIT_URL || !LIVEKIT_API_KEY || !LIVEKIT_API_SECRET) {
      return res.status(503).json({
        success: false,
        error: 'LiveKit environment variables are not configured'
      });
    }

    // Use one fixed room for Issue 1 testing.
    const roomName = 'beyondme-issue1-test';

    // Give every test participant a unique identity.
    const identity = `${role}-${randomUUID()}`;

    // Create a short-lived access token.
    const accessToken = new AccessToken(
      LIVEKIT_API_KEY,
      LIVEKIT_API_SECRET,
      {
        identity,
        ttl: '10m'
      }
    );

    // Give the participant permissions based on their role.
    accessToken.addGrant({
      roomJoin: true,
      room: roomName,
      canPublish: role === 'publisher',
      canSubscribe: true,
      canPublishData: false
    });

    const token = await accessToken.toJwt();

    res.json({
      success: true,
      serverUrl: LIVEKIT_URL,
      roomName,
      identity,
      role,
      token
    });

  } catch (error) {
    next(error);
  }
});
// -----------------------------------------------------------------------------
// WEBSITE PAGES
// -----------------------------------------------------------------------------

app.get('/', (req, res) => {
  res.sendFile(join(__dirname, '../public/index.html'));
});

app.get('/shop', (req, res) => {
  res.sendFile(join(__dirname, '../public/hotel.html'));
});

// -----------------------------------------------------------------------------
// ADMIN LOGIN
// -----------------------------------------------------------------------------

app.post('/api/admin/login', async (req, res, next) => {
  try {
    const { username, password } = req.body ?? {};

    if (
      typeof username !== 'string' ||
      typeof password !== 'string' ||
      !username.trim() ||
      !password
    ) {
      return res.status(400).json({
        success: false,
        error: 'Username and password are required'
      });
    }

    const validUsername = username === process.env.ADMIN_USERNAME;

    const validPassword = process.env.ADMIN_PASSWORD_HASH
      ? await bcrypt.compare(password, process.env.ADMIN_PASSWORD_HASH)
      : false;

    if (!validUsername || !validPassword) {
      return res.status(401).json({
        success: false,
        error: 'Incorrect username or password'
      });
    }

    await new Promise((resolve, reject) => {
      req.session.regenerate(error => {
        if (error) reject(error);
        else resolve();
      });
    });

    req.session.isAdmin = true;
    req.session.adminUsername = username;

    await new Promise((resolve, reject) => {
      req.session.save(error => {
        if (error) reject(error);
        else resolve();
      });
    });

    res.json({
      success: true,
      message: 'Administrator login successful'
    });
  } catch (error) {
    next(error);
  }
});

app.get('/api/admin/me', requireAdmin, (req, res) => {
  res.json({
    success: true,
    username: req.session.adminUsername
  });
});

app.post('/api/admin/logout', requireAdmin, (req, res, next) => {
  req.session.destroy(error => {
    if (error) return next(error);

    res.clearCookie('beyondme.sid', {
      httpOnly: true,
      sameSite: 'strict',
      secure: process.env.NODE_ENV === 'production'
    });

    res.json({
      success: true,
      message: 'Logged out successfully'
    });
  });
});

// -----------------------------------------------------------------------------
// BLOG IMAGE UPLOAD
// -----------------------------------------------------------------------------

app.post('/api/admin/uploads', requireAdmin, (req, res, next) => {
  imageUpload.single('image')(req, res, error => {
    if (error) {
      return res.status(400).json({
        success: false,
        error: error.message || 'Image upload failed.'
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: 'Please select an image.'
      });
    }

    res.status(201).json({
      success: true,
      imageUrl: `/uploads/${req.file.filename}`,
      message: 'Image uploaded successfully.'
    });
  });
});

// -----------------------------------------------------------------------------
// PUBLIC BLOG API
// -----------------------------------------------------------------------------

// Return published stories only.
app.get('/api/posts', async (req, res, next) => {
  try {
    const { category } = req.query;
    const filter = { status: 'published' };

    if (category && category !== 'all') {
      filter.category = String(category);
    }

    const posts = await db.collection('posts')
      .find(filter)
      .sort({ publishedAt: -1, createdAt: -1 })
      .toArray();

    res.json({
      success: true,
      posts
    });
  } catch (error) {
    next(error);
  }
});

// Return one published story.
app.get('/api/posts/:id', async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid post ID'
      });
    }

    const post = await db.collection('posts').findOne({
      _id: new ObjectId(id),
      status: 'published'
    });

    if (!post) {
      return res.status(404).json({
        success: false,
        error: 'Published post not found'
      });
    }

    res.json({
      success: true,
      post
    });
  } catch (error) {
    next(error);
  }
});

// -----------------------------------------------------------------------------
// ADMIN BLOG API
// -----------------------------------------------------------------------------

// Return all stories, including drafts.
app.get('/api/admin/posts', requireAdmin, async (req, res, next) => {
  try {
    const posts = await db.collection('posts')
      .find({})
      .sort({ updatedAt: -1, createdAt: -1 })
      .toArray();

    res.json({
      success: true,
      posts
    });
  } catch (error) {
    next(error);
  }
});

// Create a story.
app.post('/api/admin/posts', requireAdmin, async (req, res, next) => {
  try {
    const {
      title,
      excerpt,
      content,
      category,
      imageUrl,
      status
    } = req.body ?? {};

    const allowedCategories = ['Travel', 'Cooking', 'Reflections'];
    const allowedStatuses = ['draft', 'published'];

    if (
      typeof title !== 'string' ||
      !title.trim() ||
      typeof content !== 'string' ||
      !content.trim()
    ) {
      return res.status(400).json({
        success: false,
        error: 'A title and content are required'
      });
    }

    if (excerpt !== undefined && typeof excerpt !== 'string') {
      return res.status(400).json({
        success: false,
        error: 'Excerpt must be text'
      });
    }

    if (!allowedCategories.includes(category)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid blog category'
      });
    }

    const postStatus = status || 'draft';

    if (!allowedStatuses.includes(postStatus)) {
      return res.status(400).json({
        success: false,
        error: 'Status must be draft or published'
      });
    }

    if (imageUrl !== undefined && typeof imageUrl !== 'string') {
      return res.status(400).json({
        success: false,
        error: 'Image URL must be text'
      });
    }

    const now = new Date();

    const newPost = {
      title: title.trim().slice(0, 150),
      excerpt: (excerpt || '').trim().slice(0, 300),
      content: content.trim(),
      category,
      imageUrl: (imageUrl || '').trim(),
      status: postStatus,
      createdAt: now,
      updatedAt: now,
      publishedAt: postStatus === 'published' ? now : null
    };

    const result = await db.collection('posts').insertOne(newPost);

    const createdPost = await db.collection('posts').findOne({
      _id: result.insertedId
    });

    res.status(201).json({
      success: true,
      post: createdPost
    });
  } catch (error) {
    next(error);
  }
});

// Update a story.
app.patch('/api/admin/posts/:id', requireAdmin, async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid post ID'
      });
    }

    const allowedFields = [
      'title',
      'excerpt',
      'content',
      'category',
      'imageUrl',
      'status'
    ];

    const body = req.body ?? {};
    const changes = {};

    for (const field of allowedFields) {
      if (Object.hasOwn(body, field)) {
        changes[field] = body[field];
      }
    }

    if (Object.keys(changes).length === 0) {
      return res.status(400).json({
        success: false,
        error: 'No valid fields provided'
      });
    }

    if (
      Object.hasOwn(changes, 'title') &&
      (typeof changes.title !== 'string' || !changes.title.trim())
    ) {
      return res.status(400).json({
        success: false,
        error: 'Title cannot be empty'
      });
    }

    if (
      Object.hasOwn(changes, 'content') &&
      (typeof changes.content !== 'string' || !changes.content.trim())
    ) {
      return res.status(400).json({
        success: false,
        error: 'Content cannot be empty'
      });
    }

    if (
      Object.hasOwn(changes, 'excerpt') &&
      typeof changes.excerpt !== 'string'
    ) {
      return res.status(400).json({
        success: false,
        error: 'Excerpt must be text'
      });
    }

    if (
      Object.hasOwn(changes, 'category') &&
      !['Travel', 'Cooking', 'Reflections'].includes(changes.category)
    ) {
      return res.status(400).json({
        success: false,
        error: 'Invalid blog category'
      });
    }

    if (
      Object.hasOwn(changes, 'status') &&
      !['draft', 'published'].includes(changes.status)
    ) {
      return res.status(400).json({
        success: false,
        error: 'Invalid post status'
      });
    }

    if (
      Object.hasOwn(changes, 'imageUrl') &&
      typeof changes.imageUrl !== 'string'
    ) {
      return res.status(400).json({
        success: false,
        error: 'Image URL must be text'
      });
    }

    if (Object.hasOwn(changes, 'title')) {
      changes.title = changes.title.trim().slice(0, 150);
    }

    if (Object.hasOwn(changes, 'excerpt')) {
      changes.excerpt = changes.excerpt.trim().slice(0, 300);
    }

    if (Object.hasOwn(changes, 'content')) {
      changes.content = changes.content.trim();
    }

    if (Object.hasOwn(changes, 'imageUrl')) {
      changes.imageUrl = changes.imageUrl.trim();
    }

    const posts = db.collection('posts');

    const existingPost = await posts.findOne({
      _id: new ObjectId(id)
    });

    if (!existingPost) {
      return res.status(404).json({
        success: false,
        error: 'Post not found'
      });
    }

    changes.updatedAt = new Date();

    if (
      changes.status === 'published' &&
      existingPost.status !== 'published'
    ) {
      changes.publishedAt = new Date();
    }

    await posts.updateOne(
      { _id: new ObjectId(id) },
      { $set: changes }
    );

    const updatedPost = await posts.findOne({
      _id: new ObjectId(id)
    });

    res.json({
      success: true,
      post: updatedPost
    });
  } catch (error) {
    next(error);
  }
});

// Delete a story.
app.delete('/api/admin/posts/:id', requireAdmin, async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid post ID'
      });
    }

    const result = await db.collection('posts').deleteOne({
      _id: new ObjectId(id)
    });

    if (result.deletedCount === 0) {
      return res.status(404).json({
        success: false,
        error: 'Post not found'
      });
    }

    res.json({
      success: true,
      message: 'Post deleted successfully'
    });
  } catch (error) {
    next(error);
  }
});

// -----------------------------------------------------------------------------
// HEALTH CHECK
// -----------------------------------------------------------------------------

app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'BeyondMe API is running'
  });
});

app.get('/api/hello', (req, res) => {
  res.json({
    message: 'Hello from the HOTEL API',
    success: true
  });
});

// -----------------------------------------------------------------------------
// ORIGINAL HOTEL SHOP API
// -----------------------------------------------------------------------------

// Get all shop items, with optional filters.
app.get('/api/items', async (req, res, next) => {
  try {
    const filter = {};
    const { category, search } = req.query;

    if (category && category !== 'all') {
      filter.category = String(category);
    }

    if (search) {
      const safeSearch = String(search).replace(
        /[.*+?^${}()|[\]\\]/g,
        '\\$&'
      );

      filter.name = {
        $regex: safeSearch,
        $options: 'i'
      };
    }

    const items = await collection.find(filter)
      .sort({ name: 1 })
      .toArray();

    res.json(items);
  } catch (error) {
    next(error);
  }
});

// Get one shop item.
app.get('/api/items/:id', async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({
        error: 'Invalid item ID'
      });
    }

    const item = await collection.findOne({
      _id: new ObjectId(id)
    });

    if (!item) {
      return res.status(404).json({
        error: 'Item not found'
      });
    }

    res.json(item);
  } catch (error) {
    next(error);
  }
});

// Create a shop item.
app.post('/api/items', async (req, res, next) => {
  try {
    const {
      name,
      category,
      description,
      price,
      imageUrl
    } = req.body ?? {};

    if (typeof name !== 'string' || !name.trim()) {
      return res.status(400).json({
        error: 'A product name is required'
      });
    }

    if (
      price !== undefined &&
      (!Number.isFinite(price) || price < 0)
    ) {
      return res.status(400).json({
        error: 'Price must be a non-negative number'
      });
    }

    const newItem = {
      name: name.trim(),
      category: typeof category === 'string' ? category.trim() : 'Other',
      description: typeof description === 'string' ? description.trim() : '',
      price: price === undefined ? 0 : price,
      imageUrl: typeof imageUrl === 'string' ? imageUrl.trim() : '',
      createdAt: new Date()
    };

    const result = await collection.insertOne(newItem);

    const createdItem = await collection.findOne({
      _id: result.insertedId
    });

    res.status(201).json(createdItem);
  } catch (error) {
    next(error);
  }
});

// Update a shop item.
app.patch('/api/items/:id', async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({
        error: 'Invalid item ID'
      });
    }

    const allowedFields = [
      'name',
      'category',
      'description',
      'price',
      'imageUrl'
    ];

    const body = req.body ?? {};
    const changes = {};

    for (const field of allowedFields) {
      if (Object.hasOwn(body, field)) {
        changes[field] = body[field];
      }
    }

    if (Object.keys(changes).length === 0) {
      return res.status(400).json({
        error: 'Provide at least one valid field to update'
      });
    }

    if (
      Object.hasOwn(changes, 'name') &&
      (typeof changes.name !== 'string' || !changes.name.trim())
    ) {
      return res.status(400).json({
        error: 'Product name cannot be empty'
      });
    }

    if (Object.hasOwn(changes, 'name')) {
      changes.name = changes.name.trim();
    }

    if (
      Object.hasOwn(changes, 'price') &&
      (!Number.isFinite(changes.price) || changes.price < 0)
    ) {
      return res.status(400).json({
        error: 'Price must be a non-negative number'
      });
    }

    for (const field of ['category', 'description', 'imageUrl']) {
      if (
        Object.hasOwn(changes, field) &&
        typeof changes[field] !== 'string'
      ) {
        return res.status(400).json({
          error: `${field} must be a string`
        });
      }

      if (Object.hasOwn(changes, field)) {
        changes[field] = changes[field].trim();
      }
    }

    const result = await collection.updateOne(
      { _id: new ObjectId(id) },
      { $set: changes }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({
        error: 'Item not found'
      });
    }

    const updatedItem = await collection.findOne({
      _id: new ObjectId(id)
    });

    res.json(updatedItem);
  } catch (error) {
    next(error);
  }
});

// Delete a shop item.
app.delete('/api/items/:id', async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({
        error: 'Invalid item ID'
      });
    }

    const result = await collection.deleteOne({
      _id: new ObjectId(id)
    });

    if (result.deletedCount === 0) {
      return res.status(404).json({
        error: 'Item not found'
      });
    }

    res.json({
      success: true,
      message: 'Product deleted successfully'
    });
  } catch (error) {
    next(error);
  }
});

// -----------------------------------------------------------------------------
// USER ACCOUNT CREATION
// -----------------------------------------------------------------------------

app.post('/api/create-account', async (req, res, next) => {
  try {
    const { username, email, password } = req.body ?? {};

    if (
      typeof username !== 'string' || !username.trim() ||
      typeof email !== 'string' || !email.trim() ||
      typeof password !== 'string' || password.length < 8
    ) {
      return res.status(400).json({
        error: 'Username and email are required; password must be at least 8 characters'
      });
    }

    const users = db.collection('users');
    const normalizedUsername = username.trim();
    const normalizedEmail = email.trim().toLowerCase();

    const existing = await users.findOne({
      $or: [
        { username: normalizedUsername },
        { email: normalizedEmail }
      ]
    });

    if (existing) {
      return res.status(409).json({
        error: 'Username or email already exists'
      });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const result = await users.insertOne({
      username: normalizedUsername,
      email: normalizedEmail,
      passwordHash,
      role: 'user',
      createdAt: new Date()
    });

    res.status(201).json({
      success: true,
      userId: result.insertedId
    });
  } catch (error) {
    next(error);
  }
});

// -----------------------------------------------------------------------------
// DEVELOPMENT-ONLY SHOP ROUTES
// -----------------------------------------------------------------------------

if (process.env.NODE_ENV !== 'production') {
  app.post('/api/dev/seed', async (req, res, next) => {
    try {
      const count = await collection.countDocuments();

      if (count > 0) {
        return res.status(409).json({
          error: 'Collection is not empty; seed was not run'
        });
      }

      const seedData = [
        {
          name: 'Everyday Backpack',
          category: 'Accessories',
          description: 'A versatile backpack for everyday adventures.',
          price: 49.99,
          imageUrl: 'https://placehold.co/600x400?text=Backpack'
        },
        {
          name: 'Classic Watch',
          category: 'Accessories',
          description: 'A clean, timeless watch for any occasion.',
          price: 79.99,
          imageUrl: 'https://placehold.co/600x400?text=Watch'
        },
        {
          name: 'Wireless Headphones',
          category: 'Electronics',
          description: 'Comfortable headphones for music and work.',
          price: 59.99,
          imageUrl: 'https://placehold.co/600x400?text=Headphones'
        },
        {
          name: 'Ceramic Coffee Mug',
          category: 'Home',
          description: 'A simple ceramic mug for your daily coffee.',
          price: 14.99,
          imageUrl: 'https://placehold.co/600x400?text=Coffee+Mug'
        }
      ];

      const result = await collection.insertMany(seedData);

      res.status(201).json({
        success: true,
        insertedCount: result.insertedCount
      });
    } catch (error) {
      next(error);
    }
  });

  app.delete('/api/dev/clear', async (req, res, next) => {
    try {
      const result = await collection.deleteMany({});

      res.json({
        success: true,
        deletedCount: result.deletedCount
      });
    } catch (error) {
      next(error);
    }
  });
}

// -----------------------------------------------------------------------------
// ERROR HANDLING
// -----------------------------------------------------------------------------

app.use((error, req, res, next) => {
  console.error(error);

  if (res.headersSent) {
    return next(error);
  }

  if (error instanceof SyntaxError && error.status === 400 && 'body' in error) {
    return res.status(400).json({
      success: false,
      error: 'Invalid JSON request body'
    });
  }

  res.status(500).json({
    success: false,
    error: 'Internal server error'
  });
});

// -----------------------------------------------------------------------------
// START SERVER AFTER MONGODB CONNECTION
// -----------------------------------------------------------------------------

async function startServer() {
  try {
    const connection = await connectMongo();

    db = connection.db;
    collection = connection.collection;

    app.listen(PORT, () => {
      console.log(
        `BeyondMe and HOTEL API are running at http://localhost:${PORT}`
      );
    });
  } catch (error) {
    console.error('Failed to start the application:', error);
    process.exit(1);
  }
}

startServer();
