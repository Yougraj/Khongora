import { ObjectId } from 'mongodb';
import { getDb } from './mongodb';

export async function findById(collectionName: string, id: string) {
  const db = await getDb();
  const collection = db.collection(collectionName);

  if (ObjectId.isValid(id)) {
    return collection.findOne({ _id: new ObjectId(id) });
  }

  return collection.findOne({ _id: id } as never);
}
