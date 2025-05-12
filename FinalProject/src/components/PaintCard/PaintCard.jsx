import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { imagedb } from "../../FireBase/Config.js";
import { getDownloadURL, listAll, ref } from "firebase/storage";

function PaintCard() {
  const [products, setProducts] = useState([]);
  const [imgUrl, setImgUrl] = useState([]);

  useEffect(() => {
    const fetchImages = async () => {
      const imgs = await listAll(ref(imagedb, "handwritingPaints"));
      const urlPromises = imgs.items.map((val) =>
        getDownloadURL(val).then((url) => ({
          name: val.name,
          url,
        }))
      );
      const urls = await Promise.all(urlPromises);
      setImgUrl(urls);
    };

    fetchImages();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("http://localhost:3002/paints");
        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error(error);
        // Optionally, handle the error in UI
      }
    };

    fetchProducts();
  }, []);

  // Adjusted styles for centering
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        marginLeft: "100px",
        bottom: "20px"
      }}
    >
      <div
        className="row row-cols-1 row-cols-md-3 g-4"
        style={{ marginTop: "20px" }}
      >
        {products.slice(0, 6).map((item) => {
          let id = item.id;
          const imageName = `p${id}.jpeg`;
          const image = imgUrl.find((img) => img.name === imageName);
          return (
            <div className="col" key={item.id}>
              <div className="card h-50" style={{ width: "80%" }}>
                <img
                  src={image ? image.url : "/path/to/default/image.jpeg"}
                  alt={item.name || "Default image"}
                  className="card-img-top"
                  style={{ width: "100%", height: "300px" }}
                />
                <div className="card-body" style={{margin: "10px"}}>
                  <h5 className="card-title">{item.name}</h5>
                  <p className="card-text" >{item.description}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default PaintCard;
