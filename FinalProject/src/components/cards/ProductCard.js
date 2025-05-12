import "./ProductCard.css";
import "bootstrap/dist/css/bootstrap.min.css";
import React from "react";
import {Card, CardHeader, CardBody, Image} from "@nextui-org/react";

export default function ProductCard(props) {
    return (
    <Card className="py-4">
    <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
      <p className="text-tiny uppercase font-bold">{props.category}</p>
      <small className="text-default-500">{props.price}</small>
      <h4 className="font-bold text-large">{props.productName}</h4>
    </CardHeader>
    <CardBody className="overflow-visible py-2">
      <Image
        alt="Card background"
        className="object-cover rounded-xl"
        src="cards/p2.jpg"
        width={270}
      />
    </CardBody>
  </Card>
    )};