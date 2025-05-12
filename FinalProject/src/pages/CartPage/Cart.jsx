import React, { useState, useEffect, useRef } from "react";
import "./Cart.css";
import useFirebaseImages from "../../FireBase/ImageContext";
import { imagedb } from "../../FireBase/Config";
import { getDownloadURL, listAll, ref } from "firebase/storage";
import { Toast } from "primereact/toast";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const CartItem = ({ item, onIncrease, onDecrease }) => {
  return (
    <div className="cart-item">
      <img src={item.image} alt={item.name} className="cart-item-image" />
      <div className="cart-item-info">
        <span className="cart-item-title">{item.name}</span>
        <span className="cart-item-price">Price: ₪{item.price}</span>
        <div className="cart-item-quantity">
          <button onClick={() => onDecrease(item.product_id)}>-</button>
          <input type="number" value={item.quantity} readOnly />
          <button onClick={() => onIncrease(item.product_id)}>+</button>
        </div>
      </div>
    </div>
  );
};

async function UpdateDatabase(data) {
  try {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/cart`, {
      method: "POST",
      mode: "cors",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const data_json = await response.json();

    if (response.status === 401 || data_json.status === false) {
      toast.warning(data_json.message || "Please log in to update cart.");
      return { success: false };
    }

    toast.success("Cart updated successfully!");
    return { success: true };
  } catch (error) {
    console.error("Update error:", error);
    toast.error("Something went wrong while updating the cart.");
    return { success: false };
  }
}

const Cart = () => {
  const imageUrls = useFirebaseImages("uploads");
  const [products, setProducts] = useState([]);
  const [imgUrl, setImgUrl] = useState([]);
  const [imgUrl1, setImgUrl1] = useState([]);
  const [authError, setAuthError] = useState(false);

  const navigate = useNavigate();
  const toastBC = useRef(null);

  const handleDelete = (productId) => {
    setProducts((current) => current.filter((item) => item.product_id !== productId));
  };

  const handleIncreaseQty = async (productId) => {
    const updated = products.map((item) =>
      item.product_id === productId
        ? { ...item, quantity: item.quantity + 1 }
        : item
    );
    setProducts(updated);
    await UpdateDatabase({ key: productId, quantity: updated.find(i => i.product_id === productId).quantity, flag: "update" });
  };

  const handleDecreaseQty = async (productId) => {
    const targetItem = products.find(i => i.product_id === productId);
    const newQty = targetItem.quantity - 1;

    if (newQty < 1) {
      handleDelete(productId);
      await UpdateDatabase({ key: productId, quantity: 0, flag: "delete" });
      return;
    }

    const updated = products.map((item) =>
      item.product_id === productId
        ? { ...item, quantity: newQty }
        : item
    );

    setProducts(updated);
    await UpdateDatabase({ key: productId, quantity: newQty, flag: "update" });
  };

  useEffect(() => {
    listAll(ref(imagedb, "candles")).then((imgs) => {
      imgs.items.forEach((val) => {
        getDownloadURL(val).then((url) => {
          const name = val.name;
          setImgUrl((prev) => [...prev, { name, url }]);
        });
      });
    });
  }, []);

  useEffect(() => {
    const fetchImages = async () => {
      const imgs = await listAll(ref(imagedb, "handwritingPaints"));
      const urlPromises = imgs.items.map((val) =>
        getDownloadURL(val).then((url) => ({ name: val.name, url }))
      );
      const urls = await Promise.all(urlPromises);
      setImgUrl1(urls);
    };
    fetchImages();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/cart`, {
        method: "GET",
        credentials: "include",
      });

      const data = await response.json();

      if (response.status === 401 || data.status === false) {
        setAuthError(true);
        toast.warning(data.message || "You must log in first.");
        return;
      }

      setProducts(data.products || data);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load cart.");
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const itemsWithImages = products.map((item) => {
    const imageInfo =
      imgUrl.find((img) => img.name === `p${item.id}.PNG`) ||
      imgUrl1.find((img) => img.name === `p${item.id}.jpeg`);
    return {
      ...item,
      image: imageInfo ? imageInfo.url : "default-image-url.jpg",
    };
  });

  const totalPrice = itemsWithImages.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const handleOrder = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/cartToOrder`, {
        method: "POST",
        credentials: "include",
      });

      const data = await response.json();

      if (response.status === 401 || data.status === false) {
        toastBC.current.show({
          severity: "warn",
          summary: "Login Required",
          detail: data.message || "Please log in to place an order.",
        });

        setTimeout(() => navigate("/login"), 2000);
        return;
      }

      toastBC.current.show({
        severity: "success",
        summary: "Order Accepted",
        detail: "Your order has been successfully accepted.",
      });

      navigate("/paymentPage");
    } catch (error) {
      console.error(error);
      toastBC.current.show({
        severity: "error",
        summary: "Order Failed",
        detail: "There was a problem processing your order.",
      });
    }
  };

  if (authError) {
    return (
      <div style={{ padding: "40px", textAlign: "center" }}>
        <h2>🛒 Please log in to view your cart.</h2>
        <a
          href="/login"
          style={{
            marginTop: "20px",
            display: "inline-block",
            fontSize: "18px",
            color: "#007bff",
            textDecoration: "underline",
          }}
        >
          👉 Login here
        </a>
      </div>
    );
  }

  return (
    <div className="cart-container">
      <h2 className="cart-title">Your Cart</h2>
      <div className="cart-items">
        {itemsWithImages.map((item) => (
          <CartItem
            key={item.product_id}
            item={item}
            onIncrease={handleIncreaseQty}
            onDecrease={handleDecreaseQty}
          />
        ))}
      </div>
      <div className="cart-total">Total: ₪{totalPrice.toFixed(2)}</div>
      <Toast ref={toastBC} />
      <button className="cart-checkout-btn" onClick={handleOrder}>
        Pay
      </button>
    </div>
  );
};

export default Cart;
