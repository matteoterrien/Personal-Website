import { Request, Response, NextFunction } from "express";
import multer from "multer";
import fs from "fs";

class ImageFormatError extends Error {}

const storageEngine = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = process.env.IMAGE_UPLOAD_DIR || "uploads";

    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    cb(null, uploadDir);
  },

  filename: function (req, file, cb) {
    let fileExtension;
    if (file.mimetype === "image/png") {
      fileExtension = "png";
    } else if (file.mimetype === "image/jpeg") {
      fileExtension = "jpg";
    } else {
      return cb(new ImageFormatError("Unsupported image type"), "");
    }

    const fileName = `${Date.now()}-${Math.round(
      Math.random() * 1e9
    )}.${fileExtension}`;

    cb(null, fileName);
  },
});

export const imageMiddlewareFactory = multer({
  storage: storageEngine,
  limits: {
    files: 1,
    fileSize: 5 * 1024 * 1024, // 5MB max file size
  },
});

export function handleImageFileErrors(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (err instanceof multer.MulterError || err instanceof ImageFormatError) {
    res.status(400).json({
      error: "Bad Request",
      message: err.message,
    });
    return;
  }
  next(err);
}
