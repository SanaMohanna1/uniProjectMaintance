import React, { useState } from "react";
import Login from "./pages/LoginPage/Login";
import SignUp from "./pages/SignUpPage/Signup";
import Home from "./pages/HomePage/Home";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Contact from "./pages/ContactPage/Contact";
import About from "./pages/AboutUsPage/About";
import Cart from "./pages/CartPage/Cart";
import Categories from "./pages/CategoriesPage/Categories";
import Profile from "./pages/User/UserProfile";
import Footer from "./components/Footer/Footer";
import Candels from "./pages/All_Products_Page/AllProducts";
import Courses from "./pages/CoursesPage/Courses";
import FirebaseImageUpload from "./FireBase/firebase_image_upload";
import ResponsiveNavbar from "./components/ResponsiveNav/ResponsiveNavbar";
import PaintProduct from "./pages/PaintProductPage/PaintProducts";
import PaymentPage from "./pages/CartPage/PaymentPage";
import { Toaster } from "sonner";
function App() {
  return (
    <div className="App">
      <ResponsiveNavbar />
      <Toaster position="top-center" richColors />

      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/Signup" element={<SignUp />} />
          <Route
            path="/"
            element={
              <>
                <Home />
              </>
            }
          />
          <Route
            path="/about"
            element={
              <>
                <About />
              </>
            }
          />
          <Route
            path="/contact"
            element={
              <>
                <Contact />
              </>
            }
          />
          <Route
            path="/cart"
            element={
              <>
                <Cart />
              </>
            }
          />
          <Route
            path="/categories"
            element={
              <>
                <Categories />
              </>
            }
          />
          <Route
            path="/profile"
            element={
              <>
                <Profile />
              </>
            }
          />
          <Route
            path="/Candels"
            element={
              <>
                <Candels />
              </>
            }
          />

          <Route
            path="/courses"
            element={
              <>
                <Courses />
              </>
            }
          />
          <Route
            path="/firebase"
            element={
              <>
                <FirebaseImageUpload />
              </>
            }
          />
          <Route
            path="/PaintProduct"
            element={
              <>
                <PaintProduct />
              </>
            }
          />
          <Route path="/paymentPage" element={<PaymentPage />} />

          <Route path="/user/:activepage" element={<Profile />} />
        </Routes>
      </BrowserRouter>
      <Footer />
    </div>
  );
}

export default App;
