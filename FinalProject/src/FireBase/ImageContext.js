import { useState, useEffect } from "react";
import { imagedb } from "./Config";
import { getDownloadURL, listAll, ref } from "firebase/storage";

const useFirebaseImages = (folderPath) => {
  const [imageUrls, setImageUrls] = useState([]);

  useEffect(() => {
    const imageRefs = ref(imagedb, folderPath);
    listAll(imageRefs).then((result) => {
      const urlsPromises = result.items.map((itemRef) => getDownloadURL(itemRef));
      Promise.all(urlsPromises).then((urls) => setImageUrls(urls));
    });
  }, [folderPath]);

  return imageUrls;
};

export default useFirebaseImages;
