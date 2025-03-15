import { MongoClient, Document, ObjectId } from "mongodb";

interface ImageSchema {
  _id: string;
  src: string;
  name: string;
  author: string | AuthorSchema | null;
  likes: number;
}

interface AuthorSchema {
  _id: string;
  username: string;
  email: string;
}

export class ImageProvider {
  constructor(private readonly mongoClient: MongoClient) {}

  async getAllImages(authorId?: string): Promise<ImageSchema[]> {
    const collectionName = process.env.IMAGES_COLLECTION_NAME;

    if (!collectionName) {
      throw new Error(
        "Missing IMAGES_COLLECTION_NAME from environment variables"
      );
    }

    const collection = this.mongoClient
      .db()
      .collection<ImageSchema>(collectionName);

    const filter = authorId ? { author: authorId } : {};
    const images = await collection.find(filter).toArray();

    return images.map((img) => ({
      _id: img._id.toString(),
      src: img.src,
      name: img.name,
      likes: img.likes,
      author: img.author,
    }));
  }

  async updateImageName(imageId: string, newName: string): Promise<number> {
    const collectionName = process.env.IMAGES_COLLECTION_NAME;

    if (!collectionName) {
      throw new Error("Missing collection names from environment variables");
    }

    const collection = this.mongoClient
      .db()
      .collection<ImageSchema>(collectionName);

    const result = await collection.updateOne(
      { _id: imageId },
      { $set: { name: newName } }
    );

    return result.matchedCount;
  }

  async createImage(image: ImageSchema): Promise<number> {
    const collectionName = process.env.IMAGES_COLLECTION_NAME;
    if (!collectionName) {
      throw new Error("Missing IMAGES_COLLECTION_NAME from env file");
    }

    const collection = this.mongoClient
      .db()
      .collection<ImageSchema>(collectionName);

    await collection.insertOne(image);

    return 1;
  }
}
