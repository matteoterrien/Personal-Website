import express, { Request, Response } from "express";
import dotenv from "dotenv";
import path from "path";
import { MongoClient } from "mongodb";
import { ImageProvider } from "./ImageProvider";

dotenv.config(); // Read the .env file in the current working directory, and load values into process.env.
const PORT = process.env.PORT || 3000;

const staticDir = process.env.STATIC_DIR || "public";

const { MONGO_USER, MONGO_PWD, MONGO_CLUSTER, DB_NAME } = process.env;

const connectionStringRedacted = `mongodb+srv://${MONGO_USER}:${MONGO_PWD}@${MONGO_CLUSTER}/${DB_NAME}`;
const connectionString = `mongodb+srv://${MONGO_USER}:${MONGO_PWD}@${MONGO_CLUSTER}/${DB_NAME}`;
console.log("Attempting Mongo connection at " + connectionStringRedacted);

const app = express();

app.use(express.static(staticDir));

let mongoClient: MongoClient;

async function setUpServer() {
  mongoClient = await MongoClient.connect(connectionString);
  console.log("MongoDB Connected");

  const collectionInfos = await mongoClient.db().listCollections().toArray();
  console.log(collectionInfos.map((collectionInfo) => collectionInfo.name)); // Debug output
}

setUpServer();

app.get("/hello", (req: Request, res: Response) => {
  res.send("Hello, World");
});

app.get("/api/images", async (req: Request, res: Response) => {
  try {
    const imageProvider = new ImageProvider(mongoClient);
    const images = await imageProvider.getAllImages();

    res.json(images);
  } catch (error) {
    console.error("Error fetching images:", error);
  }
});

app.get("*", (req: Request, res: Response) => {
  const indexPath = path.join(__dirname, "../../routing-lab/dist/index.html");

  res.sendFile(indexPath);

  console.log("none of the routes above me were matched");
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
