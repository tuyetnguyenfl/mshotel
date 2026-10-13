// final with fixing string uri
import dotenv from 'dotenv';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { MongoClient, ServerApiVersion } from 'mongodb';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load .env from the HOTEL project root
dotenv.config({
  path: join(__dirname, '../.env')
});

const uri = process.env.MONGO_URI;

if (!uri) {
  throw new Error('MONGO_URI is missing from the root .env file.');
}

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true
  }
});

export async function connectMongo() {
  await client.connect();
  await client.db('admin').command({ ping: 1 });

  console.log('Connected successfully to MongoDB Atlas.');

  const db = client.db('mshotel');

  return {
    db,
    collection: db.collection('items')
  };
}

export { client };
