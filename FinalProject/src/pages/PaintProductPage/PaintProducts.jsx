import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { imagedb } from "../../FireBase/Config.js";
import { getDownloadURL, listAll, ref, uploadBytes } from "firebase/storage";
import "./PaintProducts.css";
import { toast } from 'sonner';

function PaintProduct() {
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
        const response = await fetch(`${process.env.REACT_APP_API_URL}/paints`);
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

  async function addToCart(item) {
  try {
    console.log("add to cart");
    const response = await fetch(`${process.env.REACT_APP_API_URL}/AddProductToCart`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        item,
      }),
    });

    const data_json = await response.json();  // <-- await here is critical

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
    <div className="row row-cols-1 row-cols-md-5 g-4">
      {products &&
        products.map((item) => {
          let id = item.id;
          const imageName = `p${id}.jpeg`;
          const image = imgUrl.find((img) => img.name === imageName);
          return (
            <div className="col" key={item.id}>
              <div className="card productCard">
                <img
                  src={image ? image.url : "/path/to/default/image.jpeg"}
                  alt={item.name}
                  className="card-img-top"
                />
                <div className="card-body productCardContent">
                  <h5 className="productCardTitle">{item.name}</h5>
                  <p className="productCardDescription">{item.description}</p>
                </div>
                <div className="productCardFooter">
                  <small className="text-muted">₪ {item.price}</small>
                  <button
                    type="button"
                    className="productCardButton"
                    onClick={() => addToCart(item)}
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>

          );
        })}
    </div>
  );
}

export default PaintProduct;
