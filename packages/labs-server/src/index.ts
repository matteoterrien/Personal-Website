import express, { Request, Response } from "express";
import dotenv from "dotenv";
import path from "path";

dotenv.config(); // Read the .env file in the current working directory, and load values into process.env.
const PORT = process.env.PORT || 3000;

const staticDir = process.env.STATIC_DIR || "public";

const app = express();

app.use(express.static(staticDir));

app.get("/hello", (req: Request, res: Response) => {
  res.send("Hello, World");
});

app.get("*", (req: Request, res: Response) => {
  const indexPath = path.join(__dirname, "../../routing-lab/dist/index.html");
  //   const path =
  //     "/Users/matteo.terrien/Documents/437/Lab7+/packages/routing-lab/dist/inde.html";
  //   const options = {
  //     root: staticDir,
  //   };
  //   res.sendFile(indexPath);

  console.log("none of the routes above me were matched");
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
