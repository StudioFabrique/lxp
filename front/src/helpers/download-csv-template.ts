export const downloadFile = (url: string, filename: string) => {
  fetch(url)
    .then((response) => response.blob())
    .then((blob) => {
      // Créer un lien temporaire pour télécharger le fichier
      const downloadLink = document.createElement("a");
      downloadLink.href = URL.createObjectURL(blob);
      downloadLink.download = filename;

      // Simuler un clic sur le lien pour démarrer le téléchargement
      downloadLink.click();

      // Nettoyer les ressources temporaires
      URL.revokeObjectURL(downloadLink.href);
    })
    .catch((error) => {
      console.error("Erreur lors du téléchargement du fichier:", error);
    });
};
