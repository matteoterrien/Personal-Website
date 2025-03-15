import express, { Request, Response } from "express";
import dotenv from "dotenv";
import { MongoClient } from "mongodb";
import { registerImageRoutes } from "./routes/images";
import path from "path";
import { registerAuthRoutes, verifyAuthToken } from "./routes/auth";

dotenv.config(); // Read the .env file in the current working directory, and load values into process.env.

const { MONGO_USER, MONGO_PWD, MONGO_CLUSTER, DB_NAME, IMAGE_UPLOAD_DIR } =
  process.env;
const connectionStringRedacted = `mongodb+srv://${MONGO_USER}:${MONGO_PWD}@${MONGO_CLUSTER}/${DB_NAME}`;
const connectionString = `mongodb+srv://${MONGO_USER}:${MONGO_PWD}@${MONGO_CLUSTER}/${DB_NAME}`;

async function setUpServer() {
  const PORT = process.env.PORT || 3000;

  const staticDir = path.resolve(__dirname, process.env.STATIC_DIR || "");

  const app = express();

  app.use(express.json());
  app.use(express.static(staticDir));
  app.use("/uploads", express.static(IMAGE_UPLOAD_DIR || ""));

  // MongoDB
  let mongoClient: MongoClient;
  mongoClient = await MongoClient.connect(connectionString);
  app.locals.mongoClient = mongoClient;
  console.log("MongoDB Connected");

  const collectionInfos = await mongoClient.db().listCollections().toArray();
  console.log(collectionInfos.map((collectionInfo) => collectionInfo.name)); // Debug output

  // Routes
  app.get("/hello", (req: Request, res: Response) => {
    res.send("Hello, World");
  });

  registerAuthRoutes(app, mongoClient);
  app.use("/api/*", verifyAuthToken);
  registerImageRoutes(app, mongoClient);

  app.get("*", (req: Request, res: Response) => {
    res.sendFile(path.join(staticDir, "index.html"));

    console.log("none of the routes above me were matched");
  });

  app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
}

setUpServer();
