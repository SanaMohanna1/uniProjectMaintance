import React, { useState, useEffect } from "react";
import "./orderModal.css";

export const ShowDetailsModal = ({ closeModal, defaultValue = {}, orderId }) => {
  // Existing form state setup
  const [formState, setFormState] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    ...defaultValue,
  });

  // State for storing the fetched products
  const [products, setProducts] = useState([]);

  useEffect(() => {
    // Function to fetch products from the backend
    if (orderId){
    const fetchProducts = async () => {
      try {
        const response = await fetch(`http://localhost:3002/Getorder'sProduct/${orderId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }
        const data = await response.json();
        setProducts(data); // Assuming 'data' is the array of products
        console.log(data);
      } catch (error) {
        console.error(error);
      }
    
    };

    fetchProducts(); // Call fetchProducts to load products when the component mounts
  }
  }, [orderId]); // Empty dependency array means this effect runs once on mount

  const handleSubmit = (e) => {
    closeModal(); // Close the modal
  };
  return (
    <div
      className="modal-container"
      onClick={(e) => {
        if (e.target.className === "modal-container") closeModal();
      }}
    >
      <div className="modal">
        <form onSubmit={handleSubmit}>
          <div className="product-table">
            <h3>Products</h3>
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Description</th>
                  <th>Price</th>
                  <th>Quantity</th>
                  <th>Category</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id}>
                    <td>{product.id}</td>
                    <td>{product.name}</td>
                    <td>{product.description}</td>
                    <td>{product.price}</td>
                    <td>{product.quantity}</td>
                    <td>{product.category}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <button type="submit" className="btn">
            Done
          </button>
        </form>

      </div>
    </div>
  );
};
