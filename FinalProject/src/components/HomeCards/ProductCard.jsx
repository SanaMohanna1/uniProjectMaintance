import "./ProductCard.css";
import "bootstrap/dist/css/bootstrap.min.css";
import React from "react";

export default function ProductCards() {
    const productCards = [];

    for (let index = 0; index < 3; index++) {
        productCards.push(
            <div className="ProductCard-item" key={index}>
                <img
                    src={process.env.PUBLIC_URL + `/Imgs/p${index + 1}.jpg`}
                    alt={`Product ${index + 1}`}
                />
            </div>
        );
    }

    return (
        <div className="ProductCard-container">
            {productCards}
        </div>
    );
}