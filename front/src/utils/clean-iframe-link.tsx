import { regexIframe, regexUrl } from "./constantes";

/**
 * Vérifier et nettoyer un lien iframe
 * @param link le lien sous la forme d'url ou sous la forme hmtl <iframe src="" /> ou <div></iframe src""></div>
 * @returns Le src
 */
export default function cleanIframeLink(link: string): string {
  if (regexUrl.test(link)) {
    console.log({ link });
    return link;
  } else if (regexIframe.test(link)) {
    const srcPos = link.lastIndexOf('src="') + 5;
    const lastPos = link.indexOf('"', srcPos + 1);
    const cleanedSrc = link.substring(srcPos, lastPos);
    if (!regexUrl.test(cleanedSrc))
      throw new Error("Le lien d'intégration iframe est incorrect");
    console.log({ cleanedSrc });
    return cleanedSrc;
  } else throw new Error("Le lien d'intégration iframe est incorrect");
}
