import { MongoClient, Db } from "mongodb";

const uri = process.env.MONGODB_URI ?? "mongodb://localhost:27017";
const dbName = process.env.MONGODB_DB ?? "dn8";

declare global {
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

// Reuse the client across HMR reloads in dev and across route handlers.
function getClientPromise(): Promise<MongoClient> {
  if (!global._mongoClientPromise) {
    global._mongoClientPromise = new MongoClient(uri).connect();
  }
  return global._mongoClientPromise;
}

export async function getDb(): Promise<Db> {
  const client = await getClientPromise();
  return client.db(dbName);
}
