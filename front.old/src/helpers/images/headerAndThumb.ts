/**
 *  compresse l'image sélectionnée et génère un aperçu de taille réduite
 * et le convertit en chaîne de caractère pour être stocké sous forme de blob
 */

import { compressImage } from "../compress-image";

export async function headerAndThumb(file: File) {
  let images: {
    image: any;
    thumb: string | null;
  } = { image: null, thumb: null };
  const compressedHeadImage = await compressImage(file, 1920);
  if (compressedHeadImage) {
    images = { ...images, image: compressedHeadImage };
  } else {
    images = { ...images, image: null };
  }
  const compressedThumb = await compressImage(file, 20);
  if (compressedThumb) {
    const reader = new FileReader();
    reader.onloadend = () => {
      const imageString = reader.result as string;
      if (imageString) {
        images = { ...images, thumb: imageString };
        return images;
      }
    };
    reader.readAsDataURL(file);
  } else {
    images = { ...images, thumb: null };
  }
  return images;
}
