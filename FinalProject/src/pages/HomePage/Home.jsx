import React, { useState } from "react";
import ImageSlider from "../Slider/Slider";
import ProductCard from "../../components/HomeCards/ProductCard";
import secondNavbar from "../../components/Navbar/SecondNavbar";
import PaintCard from "../../components/PaintCard/PaintCard";

function Home() {
  return (
    <div>
      <secondNavbar></secondNavbar>
      <ImageSlider />
      <PaintCard />
    </div>
  );
}
export default Home;
