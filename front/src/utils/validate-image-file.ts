export const validateImageFile = (selectedFile: File, maxSize: number) => {
  const allowedExtensions = /(\.jpeg|\.jpg|\.png|\.gif|\.webp)$/i;
  const maxSizeInBytes = maxSize; // 2 Mo

  if (!allowedExtensions.test(selectedFile.name)) {
    return false; // Extension de fichier non autorisée
  }

  if (selectedFile.size > maxSizeInBytes) {
    return false; // Fichier trop volumineux
  }

  return true; // Fichier valide
};
