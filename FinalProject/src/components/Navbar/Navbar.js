import React from "react";
import "./Navbar.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShoppingCart } from "@fortawesome/free-solid-svg-icons";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { faPalette } from "@fortawesome/free-solid-svg-icons";
//<li><a href='#'>Paint Art</a></li>
//<li><a href='#'>Religious Paintings</a></li>
//<li><a href='#'>Workshops</a></li>
//<li><a href='#'>Candles</a></li>
function Navbar() {
  return (
    <nav className="navbar">
      <a href="/" className="site-title">
        رهف <FontAwesomeIcon className="artIcon" icon={faPalette} />
      </a>
      <ul className="active">
        <li>
          <a href="/" className="HomePageLink">
            Home
          </a>
        </li>
        <li>
          <a href="/about" className="AboutUsPageLink">
            About Us
          </a>
        </li>
        <li>
          <a href="/all_products" className="ProductsPageLink">
            Candels
          </a>
        </li>
        <li>
          <a href="/PaintProduct" className="ProductsPageLink">
            PaintProduct
          </a>
        </li>
        <li>
          <a href="/courses" className="CoursesPageLink">
            Courses
          </a>
        </li>

        <li>
          <a href="/cart" className="CartPageLink">
            <FontAwesomeIcon
              className="fa fa-shopping-cart"
              icon={faShoppingCart}
            />
          </a>
        </li>
        <il>
          <a href="/profile" className="ProfilePageLink">
            <FontAwesomeIcon className="fa-user" icon={faUser} />
          </a>
        </il>
      </ul>
    </nav>
  );
}

export default Navbar;
