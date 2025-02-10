#!/usr/bin/env ts-node

import readline from "readline";
import chalk from "chalk";
import { regexPassword } from "./utils/constantes";

// Configuration de l'interface de lecture pour l'entrée/sortie standard
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Fonction utilitaire pour poser une question à l'utilisateur et attendre sa réponse
async function askQuestion(query: string): Promise<string> {
  return new Promise((resolve) => rl.question(query, resolve));
}

// Vérifie si l'email est valide selon un format standard
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Vérifie si le mot de passe respecte les critères de sécurité définis
function isValidPassword(password: string): boolean {
  return regexPassword.test(password);
}

// Vérifie si les deux mots de passe saisis correspondent
function isConfirmedPassword(password1: string, password2: string): boolean {
  return password1 === password2;
}

// Fonction principale pour recueillir les informations de l'administrateur
export async function adminPrompt(): Promise<string[]> {
  // Message d'accueil
  console.log(
    chalk.blue(
      "Bienvenue ! Veuillez entrer les informations de l'administrateur."
    )
  );

  // Collecte de l'email de l'administrateur
  const email = await askQuestion(chalk.yellow("📧 Email : "));
  /* Note: Code commenté pour la gestion du mot de passe
  const password = await askQuestion(chalk.yellow("🔑 Mot de passe : "));
  const password2 = await askQuestion(
    chalk.yellow("🔑 Confirmez le mot de passe : ")
  );*/

  console.log("\nValidation en cours...\n");

  // Variable pour suivre le statut de la validation
  let success = true;

  // Validation de l'email
  if (isValidEmail(email)) {
    console.log(chalk.green(`✅ Email valide : ${email}`));
  } else {
    console.log(chalk.red("❌ Email invalide !"));
    success = false;
  }

  /* Note: Code commenté pour la validation du mot de passe
  if (isValidPassword(password)) {
    console.log(chalk.green("✅ Mot de passe valide !"));
  } else {
    console.log(
      chalk.red(
        "❌ Mot de passe doit contenir au moins 12 caractères, une majuscule, une minuscule, un chiffre et un caractère spécial."
      )
    );
    success = false;
  }

  if (isConfirmedPassword(password, password2)) {
    console.log(chalk.green("✅ Mot de passe valide !"));
  } else {
    console.log(chalk.red("❌ Les deux mots de passe ne correspondent pas."));
    success = false;
  }
  */

  // Affichage du résultat final
  if (success) {
    console.log(chalk.bgGreen.black("\n🎉 Inscription réussie !\n"));
  } else {
    console.log(chalk.bgRed.white("\n❌ Échec de l'inscription.\n"));
  }

  // Fermeture de l'interface de lecture
  rl.close();
  return [email];
}
