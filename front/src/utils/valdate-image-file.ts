export const validateImageFile = (file: File) => {
  const allowedExtensions = /(\.jpeg|\.jpg|\.png|\.gif|\.webp)$/i;
  const maxSizeInBytes = 2 * 1024 * 1024; // 2 Mo

  if (!allowedExtensions.test(file.name)) {
    return false; // Extension de fichier non autorisée
  }

  if (file.size > maxSizeInBytes) {
    return false; // Fichier trop volumineux
  }

  return true; // Fichier valide
};
