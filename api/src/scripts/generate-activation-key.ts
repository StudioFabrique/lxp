import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.join(__dirname, "..", "..", ".env") });

const secret = process.env.REGISTER_SECRET;

if (!secret) {
  console.error(
    "Erreur: La variable d'environnement REGISTER_SECRET n'est pas définie.",
  );
  process.exit(1);
}

const token = jwt.sign({ purpose: "first-admin" }, secret, {
  expiresIn: "30m",
});

console.log("\n╔══════════════════════════════════════════════════╗");
console.log("║     Clé d'activation première administration     ║");
console.log("╠══════════════════════════════════════════════════╝");
console.log("║                                                  ");
console.log(`║  ${token}`);
console.log("║                                                  ");
console.log("║  Ce token est valide pendant 30 minutes.         ");
console.log("╚══════════════════════════════════════════════════\n");
