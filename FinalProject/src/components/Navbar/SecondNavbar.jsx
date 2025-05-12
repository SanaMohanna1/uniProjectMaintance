import React from "react";
import "./SecondNavbar.css";

function SecondNavbar() {
  return (
    <nav className="secondNav">
      <ul className="items_list">
        <li className="items">
          <a href="/all_products">All Products</a>
        </li>
        <li className="items">
          <a href="/PaintProduct">Paint Art</a>
        </li>
        <li className="items">
          <a href="#">Religious Paintings</a>
        </li>

        <li className="items">
          <a href="#">Candles</a>
        </li>
      </ul>
    </nav>
  );
}
export default SecondNavbar;
