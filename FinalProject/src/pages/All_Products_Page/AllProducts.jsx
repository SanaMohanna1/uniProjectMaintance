import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { imagedb } from "../../FireBase/Config.js";
import { getDownloadURL, listAll, ref, uploadBytes } from "firebase/storage";
import "./AllProducts.css";
import { toast } from 'sonner';

function Candels() {
  const [products, setProducts] = useState([]);
  const [imgUrl, setImgUrl] = useState([]);

  useEffect(() => {
    listAll(ref(imagedb, "candles")).then((imgs) => {
      imgs.items.forEach((val) => {
        getDownloadURL(val).then((url) => {
          const name = val.name;
          setImgUrl((prevUrls) => [...prevUrls, { name, url }]);
        });
      });
    });
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/candels`);
      if (!response.ok) {
        throw new Error("Failed to fetch products");
      }
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchProducts(); // This should ideally set `products`
  }, []);

async function addToCart(item) {
  try {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/AddProductToCart`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ item }),
    });

    const data_json = await response.json();

    if (!data_json.status) {
      toast.warning(data_json.message || "Please log in first");
    } else {
      toast.success("✅ Product added successfully!");
    }

  } catch (error) {
    console.error("Error adding to cart:", error);
    toast.error("❌ Something went wrong. Please try again later.");
  }
}

return (
    <div className="product-grid">
      {products &&
        products.map((item) => {
          const imageName = `p${item.id}.PNG`;
          const image = imgUrl.find((img) => img.name === imageName);
          return (
            <div className="productCard" key={item.id}>
              <img
                src={image ? image.url : "path/to/default/image"}
                alt={item.name}
              />
              <div className="productCardTitle">{item.name}</div>
              <div className="productCardDescription">{item.description}</div>
              <div className="productCardFooter">
                <div>₪ {item.price}</div>
                <button
                  type="button"
                  className="productCardButton"
                  onClick={() => addToCart(item)}
                >
                  Add to Cart
                </button>
              </div>
            </div>
          );
        })}
    </div>
  );
}

export default Candels;
