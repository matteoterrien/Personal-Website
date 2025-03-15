import { Collection, MongoClient } from "mongodb";
import bcrypt from "bcrypt";

interface ICredentialsDocument {
  username: string;
  password: string;
}

export class CredentialsProvider {
  private readonly collection: Collection<ICredentialsDocument>;

  constructor(mongoClient: MongoClient) {
    const COLLECTION_NAME = process.env.CREDS_COLLECTION_NAME;
    if (!COLLECTION_NAME) {
      throw new Error("Missing CREDS_COLLECTION_NAME from env file");
    }
    this.collection = mongoClient
      .db()
      .collection<ICredentialsDocument>(COLLECTION_NAME);
  }

  async registerUser(
    username: string,
    plaintextPassword: string
  ): Promise<boolean> {
    const existingUser = await this.collection.findOne({ username });
    if (existingUser) {
      return false;
    }

    const salt = bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(plaintextPassword, await salt);

    await this.collection.insertOne({
      username,
      password: hashedPassword,
    });

    return true;
  }

  async verifyPassword(username: string, plaintextPassword: string) {
    const user = await this.collection.findOne({ username });
    if (!user) {
      return false;
    }

    return await bcrypt.compare(plaintextPassword, user.password);
  }
}
