import axios from 'axios';
import { useEffect, useState } from 'react';

const useImageLoader = (url) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [imageData, setImageData] = useState(null);

 useEffect(() => {
   const maxAttempts = 10;
   let attempts = 0;

   const loadImage = () => {
     setIsLoading(true);
     setIsError(false);

     axios
       .get(url, {
         responseType: 'arraybuffer',
         timeout: 20000,
       })
       .then((response) => {
         const base64 = btoa(
           new Uint8Array(response.data).reduce(
             (data, byte) => data + String.fromCharCode(byte),
             '',
           ),
         );
         setImageData(`data:image/jpeg;base64,${base64}`);
         setIsLoading(false);
       })
       .catch((error) => {
         console.error('Error loading image:', error);
         attempts += 1;
         if (attempts < maxAttempts) {
           loadImage();
         } else {
           setIsError(true);
           setIsLoading(false);
         }
       });
   };

   loadImage();
 }, [url]);

  return { isLoading, isError, imageData };
};

export default useImageLoader;
