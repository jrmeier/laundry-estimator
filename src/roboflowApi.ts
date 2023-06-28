import { readAndCompressImage } from 'browser-image-resizer';
import axios from "axios";


const config = {
  quality: 0.7,
  width: 800,
  height: 600
};

const loadImageBase64 = (file: any) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
    });
}

export const inferFromImageFiles = async (apiKey: string, imageFiles: any[]) => {
    // call them concurrently and wait for all to finish
    const interanceResults = await Promise.all(imageFiles.map(async (imageFile) => {
        // create the image file
        const resizedImage = await readAndCompressImage(imageFile, config);
        const imageData = await loadImageBase64(resizedImage);
        try {
        const res = await axios({
            method: "POST",
            url: "https://detect.roboflow.com/laundry-estimator/3",
            params: {
                api_key: apiKey
            },
            data: imageData,
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            }
        })

        return res.data;
        } catch (err) {
            console.log({err})
        }
    }
        )) as any[]

    // count up each type of item
    const itemCounts = interanceResults
    .filter(x=>x)
    .reduce((acc: any, curr) => {
        curr.predictions.forEach((prediction: any) => {
            if (acc[prediction.class]) {
                acc[prediction.class] += 1;
            } else {
                acc[prediction.class] = 1;
            }
        })
        return acc;
    }, {})

    return itemCounts;

}