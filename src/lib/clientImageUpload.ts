"use client";

const MAX_IMAGE_SIDE = 1280;
const IMAGE_QUALITY = 0.72;
const MAX_UPLOAD_FILE_SIZE_BYTES = 8 * 1024 * 1024;

function optimizeImageFileToBlob(file: File): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onerror = () => reject(new Error("No se pudo leer la imagen."));
    reader.onload = () => {
      const image = new Image();
      image.onerror = () => reject(new Error("No se pudo procesar la imagen."));
      image.onload = () => {
        const largestSide = Math.max(image.width, image.height);
        const scale = largestSide > MAX_IMAGE_SIDE ? MAX_IMAGE_SIDE / largestSide : 1;
        const width = Math.max(1, Math.round(image.width * scale));
        const height = Math.max(1, Math.round(image.height * scale));

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        if (!ctx) {
          reject(new Error("No se pudo preparar el lienzo de imagen."));
          return;
        }

        ctx.drawImage(image, 0, 0, width, height);
        canvas.toBlob(
          (b) => {
            if (b) resolve(b);
            else reject(new Error("No se pudo generar la imagen comprimida."));
          },
          "image/jpeg",
          IMAGE_QUALITY
        );
      };

      image.src = reader.result as string;
    };

    reader.readAsDataURL(file);
  });
}

export async function uploadImageToBlob(file: File): Promise<string> {
  if (file.size > MAX_UPLOAD_FILE_SIZE_BYTES) {
    throw new Error("La imagen es demasiado grande. Máximo 8 MB.");
  }

  const blob = await optimizeImageFileToBlob(file);
  const formData = new FormData();
  formData.append("file", blob, `foto-${Date.now()}.jpg`);

  const res = await fetch("/api/upload", {
    method: "POST",
    body: formData,
  });

  const data = (await res.json()) as { url?: string; error?: string };

  if (!res.ok) {
    throw new Error(data.error || `Error al subir (${res.status})`);
  }

  if (!data.url) {
    throw new Error("El servidor no devolvió una URL.");
  }

  return data.url;
}
