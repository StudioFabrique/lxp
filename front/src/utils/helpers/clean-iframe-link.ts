import { regexIframe, regexUrl } from "../../config/constantes";

export default function cleanIframeLink(link: string): string {
  if (regexUrl.test(link)) {
    return link;
  } else if (regexIframe.test(link)) {
    const srcPos = link.lastIndexOf('src="') + 5;
    const lastPos = link.indexOf('"', srcPos + 1);
    const cleanedSrc = link.substring(srcPos, lastPos);
    if (!regexUrl.test(cleanedSrc))
      throw new Error("Le lien d'intégration iframe est incorrect");
    return cleanedSrc;
  } else throw new Error("Le lien d'intégration iframe est incorrect");
}
