import imageCompression from "browser-image-compression";

export async function compressImage(imageFile: File, maxWidthOrHeight: number) {
  const options = {
    maxSizeMB: 1,
    maxWidthOrHeight,
  };
  try {
    const compressedFile = await imageCompression(imageFile, options);
    console.log(compressedFile.size);
    return compressedFile;
  } catch (error) {
    console.log(error);
  }
}
