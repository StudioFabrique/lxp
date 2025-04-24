const fs = require("fs");
const path = require("path");

// Chemin vers le répertoire API
const apiDir = path.join(__dirname, "api");

// Chercher le fichier modèle (.env.example ou .env.template)
const findTemplateFile = () => {
  const possibleTemplates = [".env.example", ".env.template", ".env.sample"];

  for (const template of possibleTemplates) {
    const templatePath = path.join(apiDir, template);
    if (fs.existsSync(templatePath)) {
      return templatePath;
    }
  }

  return null;
};

const templatePath = findTemplateFile();
const targetPath = path.join(apiDir, ".env");

// Vérifie si un fichier modèle a été trouvé
if (!templatePath) {
  console.error(
    "❌ Aucun fichier modèle (.env.example, .env.template ou .env.sample) trouvé dans le répertoire ./api"
  );
  process.exit(1);
}

// Vérifie si le .env existe déjà
if (fs.existsSync(targetPath)) {
  console.log("⚠️ Le fichier .env existe déjà dans le répertoire ./api");
  console.log("📝 Pour le remplacer, supprimez-le d'abord manuellement");
  process.exit(0);
}

// Copie le fichier modèle vers .env
try {
  fs.copyFileSync(templatePath, targetPath);
  console.log(
    `✅ Fichier .env créé avec succès dans ./api à partir de ${path.basename(
      templatePath
    )}`
  );
} catch (error) {
  console.error(
    `❌ Erreur lors de la création du fichier .env: ${error.message}`
  );
  process.exit(1);
}
