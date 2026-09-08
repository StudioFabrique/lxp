export const downloadFile = async (url: string, filename: string) => {
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    const blob = await response.blob();
    const downloadLink = document.createElement("a");
    const objectUrl = URL.createObjectURL(blob);
    downloadLink.href = objectUrl;
    downloadLink.download = filename;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    downloadLink.remove();
    URL.revokeObjectURL(objectUrl);
    return true;
  } catch (error) {
    console.error("Erreur lors du téléchargement du fichier:", error);
    return false;
  }
};
