import { prisma } from "./utils/db";
import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";

const MONGO_URL = process.env.MONGO_LOCAL_URL;

mongoose.connection.once("open", () => {
  console.log("MongoDB connection ready!");
});

mongoose.connection.on("error", (err) => {
  console.error(err);
});

async function mongoConnect() {
  await mongoose.connect(MONGO_URL!);
}

// Méthode pour fermer la connexion
const disconnect = async () => {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.connection.close();
  }
};

const parcoursTitle = "Dev web web mobile";
const description = "Blah blah blah";

async function createParcours() {
  await prisma.parcours.create({
    data: {
      title: parcoursTitle,
      description,
      admin: {
        connect: { id: 1 },
      },
      formation: {
        connect: { id: 1 },
      },
    },
  });
}
