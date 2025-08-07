// check-test-db.ts - Version corrigée
import { Client } from "pg";
import mongoose from "mongoose";

const waitForPostgres = async (maxAttempts = 30) => {
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    // ✅ Créez un nouveau client à chaque tentative
    const client = new Client({
      host: "localhost",
      port: 5433,
      user: "prisma",
      password: "prisma",
      database: "tests",
      connectionTimeoutMillis: 5000,
    });

    try {
      console.log(
        `🔍 Tentative ${attempt}/${maxAttempts} de connexion à PostgreSQL...`
      );
      await client.connect();
      await client.query("SELECT 1");
      await client.end();
      console.log("✅ PostgreSQL est disponible");
      return;
    } catch (error: any) {
      console.log(`❌ Erreur PostgreSQL:`, error.message);

      // ✅ Assurez-vous que le client est fermé même en cas d'erreur
      try {
        await client.end();
      } catch (endError) {
        // Ignore les erreurs de fermeture
      }

      if (attempt === maxAttempts) {
        throw new Error(
          `PostgreSQL non disponible après ${maxAttempts} tentatives`
        );
      }

      await new Promise((resolve) => setTimeout(resolve, 2000));
    }
  }
};

const waitForMongo = async (maxAttempts = 30) => {
  const mongoUrl = "mongodb://localhost:26000/test";

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      console.log(
        `🔍 Tentative ${attempt}/${maxAttempts} de connexion à MongoDB...`
      );
      await mongoose.connect(mongoUrl, {
        serverSelectionTimeoutMS: 5000,
        connectTimeoutMS: 5000,
      });
      await mongoose.disconnect();
      console.log("✅ MongoDB est disponible");
      return;
    } catch (error: any) {
      console.log(`❌ Erreur MongoDB:`, error.message);
      if (attempt === maxAttempts) {
        throw new Error("MongoDB non disponible après 30 tentatives");
      }
      await new Promise((resolve) => setTimeout(resolve, 2000));
    }
  }
};

async function main() {
  try {
    console.log("🔍 Vérification des bases de données...");
    await Promise.all([waitForPostgres(), waitForMongo()]);
    console.log("✅ Toutes les bases de données sont disponibles");
  } catch (error) {
    console.error("❌ Erreur:", error);
    process.exit(1);
  }
}

main();
