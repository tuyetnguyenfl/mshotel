
//get, patch, delete fixing
import express from 'express';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { ObjectId } from 'mongodb';
import bcrypt from 'bcrypt';
import { connectMongo } from './mongo.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5500;

app.use(express.json({ limit: '100kb' }));
app.use(express.static(join(__dirname, '../public')));

let db;
let collection;

// Serve the customer-facing shop
app.get('/', (req, res) => {
  res.sendFile(join(__dirname, '../public', 'hotel.html'));
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'HOTEL API is running'
  });
});

// Preserve your original test endpoint
app.get('/api/hello', (req, res) => {
  res.json({
    message: 'Hello from HOTEL',
    success: true
  });
});

// GET all items, with optional category and search filters
app.get('/api/items', async (req, res, next) => {
  try {
    const filter = {};
    const { category, search } = req.query;

    if (category && category !== 'all') {
      filter.category = String(category);
    }

    if (search) {
      // Escape special regex characters in the search input
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

// GET one item by MongoDB ID
app.get('/api/items/:id', async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid item ID' });
    }

    const item = await collection.findOne({
      _id: new ObjectId(id)
    });

    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }

    res.json(item);
  } catch (error) {
    next(error);
  }
});

// POST: create an item
app.post('/api/items', async (req, res, next) => {
  try {
    const { name, category, description, price, imageUrl } = req.body;

    if (typeof name !== 'string' || !name.trim()) {
      return res.status(400).json({
        error: 'A product name is required'
      });
    }

    if (price !== undefined &&
        (!Number.isFinite(price) || price < 0)) {
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

// PATCH: update an existing item
app.patch('/api/items/:id', async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid item ID' });
    }

    const allowedFields = [
      'name',
      'category',
      'description',
      'price',
      'imageUrl'
    ];

    const changes = {};

    for (const field of allowedFields) {
      if (Object.hasOwn(req.body, field)) {
        changes[field] = req.body[field];
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
    }

    const result = await collection.updateOne(
      { _id: new ObjectId(id) },
      { $set: changes }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ error: 'Item not found' });
    }

    const updatedItem = await collection.findOne({
      _id: new ObjectId(id)
    });

    res.json(updatedItem);
  } catch (error) {
    next(error);
  }
});

// DELETE: remove an item
app.delete('/api/items/:id', async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid item ID' });
    }

    const result = await collection.deleteOne({
      _id: new ObjectId(id)
    });

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'Item not found' });
    }

    res.json({
      success: true,
      message: 'Product deleted successfully'
    });
  } catch (error) {
    next(error);
  }
});

// Preserve account creation from your existing project.
// This is not a complete authentication system.
app.post('/api/create-account', async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

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

// Development-only routes: never enable these in production.
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

// JSON error handling
app.use((error, req, res, next) => {
  console.error(error);

  if (res.headersSent) {
    return next(error);
  }

  res.status(500).json({
    error: 'Internal server error'
  });
});

// Connect to MongoDB before accepting requests
async function startServer() {
  try {
    const connection = await connectMongo();

    db = connection.db;
    collection = connection.collection;

    app.listen(PORT, () => {
      console.log(`HOTEL is running at http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start HOTEL:', error);
    process.exit(1);
  }
}

startServer();
