/* export function convertPNGToBlob  (file:File)  {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onloadend = () => {
        const base64Data = reader.result!.split(",")[1];
        const byteCharacters = atob(base64Data);
        const byteArrays = [];

        for (let i = 0; i < byteCharacters.length; i++) {
          byteArrays.push(byteCharacters.charCodeAt(i));
        }

        const byteArray = new Uint8Array(byteArrays);
        const blob = new Blob([byteArray], { type: "image/png" });

        resolve(blob);
      };

      reader.onerror = () => {
        reject(new Error("Failed to convert PNG to Blob"));
      };

      reader.readAsDataURL(file);
    });
  }; */
