import { readAndCompressImage } from 'browser-image-resizer';
import axios, { AxiosResponse } from "axios";

interface Prediction {
  class: string;
}

interface ResponseData {
  predictions: Prediction[];
}

const config = {
  quality: 0.7,
  width: 800,
  height: 600
};

const loadImageBase64 = (file: Blob): Promise<string | ArrayBuffer | null> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
}

export const inferFromImageFiles = async (apiKey: string, imageFiles: File[]): Promise<Record<string, number>> => {
  const inferenceResults = await Promise.all(
    imageFiles.map(async (imageFile) => {
      try {
        const resizedImage = await readAndCompressImage(imageFile, config);
        const imageData = await loadImageBase64(resizedImage);
  
        const response = await axios.post<ResponseData>(
          "https://detect.roboflow.com/laundry-estimator/3", 
          imageData, 
          {
            params: {
              api_key: apiKey
            },
            headers: {
              "Content-Type": "application/x-www-form-urlencoded"
            }
          }
        );
  
        return response.data;
      } catch (error) {
        console.error('Error during image inference:', error);
        return null;
      }
    })
  );

  const itemCounts = inferenceResults.reduce((acc: Record<string, number>, curr) => {
    if (curr) {
      curr.predictions.forEach((prediction) => {
        acc[prediction.class] = acc[prediction.class] ? acc[prediction.class] + 1 : 1;
      });
    }
    return acc;
  }, {});

  return itemCounts;
}
