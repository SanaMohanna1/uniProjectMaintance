import React, { useState, useEffect } from "react";
import "./style.css"; 
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faShoppingCart,
  faUser,
  faRightToBracket,
  faRightFromBracket,
  faBars,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";

const ResponsiveNavbar = () => {
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 800);
  const [isLoggedIn, setIsLoggedIn] = useState(undefined);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 800);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const checkLogin = async () => {
      try {
        const res = await fetch("http://localhost:3002/checkAuth", {
          credentials: "include",
        });
        const data = await res.json();
        setIsLoggedIn(data.isLoggedIn);
      } catch (err) {
        console.error("Login check failed", err);
        setIsLoggedIn(false);
      }
    };
    checkLogin();
  }, []);

  const toggleSidebar = () => setIsSidebarVisible(!isSidebarVisible);

  if (typeof isLoggedIn === "undefined") return null;

  return (
    <div className="navbar-wrapper">
      <nav className="navbar">
        <ul className={`sidebar ${isSidebarVisible ? "visible" : ""}`} onClick={toggleSidebar}>
          <li><a href="/">Home</a></li>
          <li><a href="/Candels">Candels</a></li>
          <li><a href="/PaintProduct">PaintProduct</a></li>
          <li><a href="/courses">Courses</a></li>
        </ul>

        <ul className="main-nav">
          <li className="logo"><a href="/">RAHAF</a></li>
          <li className="hideOnMobile"><a href="/">Home</a></li>
          <li className="hideOnMobile"><a href="/Candels">Candels</a></li>
          <li className="hideOnMobile"><a href="/PaintProduct">PaintProduct</a></li>
          <li className="hideOnMobile"><a href="/courses">Courses</a></li>
          <li className="menu-button" onClick={toggleSidebar}>
            <FontAwesomeIcon icon={isSidebarVisible ? faTimes : faBars} />
          </li>
        </ul>
      </nav>

      <div className="bottom-nav">
        <a href="/cart">
          <FontAwesomeIcon icon={faShoppingCart} title="Cart" />
        </a>
        <a href="/profile">
          <FontAwesomeIcon icon={faUser} title="Profile" />
        </a>
        {!isLoggedIn ? (
          <a href="/login">
            <FontAwesomeIcon icon={faRightToBracket} title="Login" />
          </a>
        ) : (
          <a
            href="/logout"
            onClick={(e) => {
              e.preventDefault();
              fetch("http://localhost:3002/logout", {
                method: "POST",
                credentials: "include",
              }).then(() => {
                setIsLoggedIn(false);
                window.location.href = "/login";
              });
            }}
          >
            <FontAwesomeIcon icon={faRightFromBracket} title="Logout" />
          </a>
        )}
      </div>
    </div>
  );
};

export default ResponsiveNavbar;
