export const validateImageFile = (selectedFile: File, maxSize: number) => {
  const allowedExtensions = /(\.jpeg|\.jpg|\.png|\.gif|\.webp)$/i;
  const maxSizeInBytes = maxSize;
  console.log({ selectedFile });

  if (!allowedExtensions.test(selectedFile.name)) {
    console.log("Extension de fichier non autorisée");
    return false; // Extension de fichier non autorisée
  }

  if (!selectedFile.type.startsWith("image/")) {
    console.log("ne commence pas par image");
    return false;
  }
  if (selectedFile.size > maxSizeInBytes) {
    console.log("fichier trop volumineux");
    return false; // Fichier trop volumineux
  }
  console.log("done");
  return true; // Fichier valide
};
