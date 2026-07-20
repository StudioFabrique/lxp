export const validateImageFile = (selectedFile: File, maxSize: number) => {
  const allowedExtensions = /(\.jpeg|\.jpg|\.png|\.gif|\.webp)$/i;
  const maxSizeInBytes = maxSize;

  if (!allowedExtensions.test(selectedFile.name)) {
    return false;
  }

  if (!selectedFile.type.startsWith("image/")) {
    return false;
  }
  if (selectedFile.size > maxSizeInBytes) {
    return false;
  }
  return true;
};
