import { MongoClient, Document } from "mongodb";

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

  async getAllImages(): Promise<ImageSchema[]> {
    // TODO #2
    const collectionName = process.env.IMAGES_COLLECTION_NAME;
    const authorsCollectionName = process.env.USERS_COLLECTION_NAME;

    if (!collectionName || !authorsCollectionName) {
      throw new Error("Missing collection names from environment variables");
    }

    const collection = this.mongoClient
      .db()
      .collection<Document>(collectionName);

    const images = await collection
      .aggregate<Document>([
        {
          $lookup: {
            from: authorsCollectionName, // Join with authors collection
            localField: "author", // Field in images collection
            foreignField: "_id", // Field in authors collection
            as: "authorInfo",
          },
        },
        {
          $unwind: {
            path: "$authorInfo",
            preserveNullAndEmptyArrays: true, // Keep images without an author
          },
        },
        {
          $project: {
            _id: 1,
            src: 1,
            name: 1,
            likes: 1,
            author: {
              _id: "$authorInfo._id",
              username: "$authorInfo.username",
              email: "$authorInfo.email",
            },
          },
        },
      ])
      .toArray();

    return images.map((img) => ({
      _id: img._id.toString(),
      src: img.src,
      name: img.name,
      likes: img.likes,
      author: img.author
        ? {
            _id: img.author._id.toString(),
            username: img.author.username,
            email: img.author.email,
          }
        : null, // Handle cases where author is missing
    }));
  }
}
