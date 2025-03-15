import { CredentialsProvider } from "../CredentialsProvider";
import express, { Request, Response, NextFunction } from "express";
import { MongoClient } from "mongodb";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const signatureKey = process.env.JWT_SECRET;
if (!signatureKey) {
  throw new Error("Missing JWT_SECRET from env file");
}

export function verifyAuthToken(
  req: Request,
  res: Response,
  next: NextFunction // Call next() to run the next middleware or request handler
) {
  const authHeader = req.get("Authorization");
  // The header should say "Bearer <token string>".  Discard the Bearer part.
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    res.status(401).end();
  } else {
    // signatureKey already declared as a module-level variable
    jwt.verify(token, signatureKey as string, (error, decoded) => {
      if (decoded) {
        res.locals.token = decoded;
        next();
      } else {
        res.status(403).end();
      }
    });
  }
}

function generateAuthToken(username: string): Promise<string> {
  return new Promise<string>((resolve, reject) => {
    jwt.sign(
      { username: username },
      signatureKey as string,
      { expiresIn: "1d" },
      (error, token) => {
        if (error) reject(error);
        else resolve(token as string);
      }
    );
  });
}

export function registerAuthRoutes(
  app: express.Application,
  mongoClient: MongoClient
) {
  app.post("/auth/register", async (req: Request, res: Response) => {
    const { username, password } = req.body;

    if (!username || !password) {
      res.status(400).json({ error: "Missing username or password" });
      return;
    }

    try {
      const credentialsProvider = new CredentialsProvider(mongoClient);

      const register = await credentialsProvider.registerUser(
        username,
        password
      );

      if (!register) {
        res.status(400).send({
          error: "Bad request",
          message: "Username already taken",
        });
        return;
      }

      const token = await generateAuthToken(username);

      res.status(201).json({ message: "User created successfully", token });
    } catch (error) {
      res.status(500).json({ error: "Network error." });
    }
  });

  app.post("/auth/login", async (req: Request, res: Response) => {
    const { username, password } = req.body;

    if (!username || !password) {
      res.status(400).send({
        error: "Bad request",
        message: "Missing username or password",
      });
      return;
    }

    try {
      const credentialsProvider = new CredentialsProvider(mongoClient);
      const isValidPassword = await credentialsProvider.verifyPassword(
        username,
        password
      );

      if (!isValidPassword) {
        res.status(401).json({
          error: "Unauthorized",
          message: "Incorrect username or password",
        });
        return;
      }

      const createdToken = await generateAuthToken(username);

      res.status(200).send({ token: createdToken });
    } catch (error) {
      res.status(500).json({
        error: "Internal Server Error",
        message: error instanceof Error ? error.message : "Unknown error",
      });
    }
  });
}
