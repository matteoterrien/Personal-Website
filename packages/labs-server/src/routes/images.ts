import express, { Request, Response } from "express";
import { MongoClient } from "mongodb";
import { ImageProvider } from "../ImageProvider";
import {
  imageMiddlewareFactory,
  handleImageFileErrors,
} from "../imageUploadMiddleware";
import { verifyAuthToken } from "./auth";

export function registerImageRoutes(
  app: express.Application,
  mongoClient: MongoClient
) {
  app.get("/api/images", async (req: Request, res: Response) => {
    let userId: string | undefined = undefined;
    if (typeof req.query.createdBy === "string") {
      userId = req.query.createdBy;
    }

    try {
      const imageProvider = new ImageProvider(mongoClient);
      const images = await imageProvider.getAllImages(userId);

      res.json(images);
    } catch (error) {
      console.error("Error fetching images:", error);
    }
  });

  app.patch("/api/images/:id", async (req: Request, res: Response) => {
    const id = req.params.id;
    const name = req.body.name;

    if (!name) {
      res.status(400).send({
        error: "Bad request",
        message: "Missing name property",
      });

      return;
    }

    const imageProvider = new ImageProvider(mongoClient);
    const images = await imageProvider.updateImageName(id, name);

    if (images === 0) {
      res.status(404).send({
        error: "Not found",
        message: "Image does not exist",
      });

      return;
    }

    res.sendStatus(204);
  });

  app.post(
    "/api/images",
    verifyAuthToken,
    imageMiddlewareFactory.single("image"),
    handleImageFileErrors,
    async (req: Request, res: Response): Promise<void> => {
      try {
        if (!req.file || !req.body.name) {
          res.status(400).json({
            error: "Bad Request",
            message: "Missing file or title",
          });
          return;
        }

        const username = res.locals.token?.username;
        if (!username) {
          res.status(403).json({
            error: "Forbidden",
            message: "Missing user authentication",
          });
          return;
        }

        const imageProvider = new ImageProvider(mongoClient);

        const newImage = {
          _id: req.file.filename,
          src: `/uploads/${req.file.filename}`,
          name: req.body.name,
          author: username,
          likes: 0,
        };

        await imageProvider.createImage(newImage);
        res.status(201).json(newImage);
        return;
      } catch (error) {
        console.error("Error handling image upload:", error);
        res.status(500).json({ error: "Internal Server Error" });
        return;
      }
    }
  );
}
