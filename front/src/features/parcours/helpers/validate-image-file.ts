export const validateImageFile = (selectedFile: File, maxSize: number) => {
  const allowedExtensions = /(\.jpeg|\.jpg|\.png|\.svg)$/i;
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

export const validateImageDimensions = (
  selectedFile: File,
  maxWidth: number,
  maxHeight: number,
) =>
  new Promise<boolean>((resolve) => {
    const image = new Image();
    const objectUrl = URL.createObjectURL(selectedFile);

    image.onload = () => {
      URL.revokeObjectURL(objectUrl);
      resolve(image.naturalWidth <= maxWidth && image.naturalHeight <= maxHeight);
    };
    image.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      resolve(false);
    };
    image.src = objectUrl;
  });
