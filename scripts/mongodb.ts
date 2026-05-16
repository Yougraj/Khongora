import { MongoClient, Db } from 'mongodb';

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB || 'khongora'; // Default to 'khongora' if not specified

if (!uri) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
}

let cachedClient: MongoClient | null = null;
let cachedDb: Db | null = null;

export async function connectToDatabase() {
  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb };
  }

  const client = new MongoClient(uri!); // `uri` is guaranteed to be defined by the check above

  try {
    await client.connect();
    const db = client.db(dbName);

    // Cache the client and db in development mode to prevent multiple connections on hot reloads
    if (process.env.NODE_ENV === 'development') {
      cachedClient = client;
      cachedDb = db;
    }

    return { client, db };
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error);
    throw error;
  }
}