import React, { useEffect } from "react";

const PaymentPage = () => {
  useEffect(() => {
    // Dynamically load PayPal script and render the PayPal button
    const script = document.createElement("script");
    script.src =
      "https://www.paypal.com/sdk/js?client-id=AUFjtUdfKH972d7tA9bhIV6-NYV5V0zhBjGM1tqhsrLNagOaFFXRAS5xgq-RfiiY8lMUVZ7yPl8o6uVT&currency=USD";
    script.onload = () => {
      window.paypal
        .Buttons({
          createOrder: (data, actions) => {
            return actions.order.create({
              intent: "CAPTURE",
              purchase_units: [
                {
                  description: "order",
                  amount: {
                    currency_code: "USD",
                    value: "20.00", // Ensure this is a string to avoid potential issues in the PayPal API
                  },
                },
              ],
            });
          },
          onApprove: (data, actions) => {
            return actions.order.capture().then(function (details) {
              // Show a success message to the buyer or redirect
              alert(
                "Transaction completed by " + details.payer.name.given_name
              );
              // Implement additional logic on successful transaction
            });
          },
          onError: (err) => {
            console.error(err);
          },
        })
        .render("#paypal-button-container"); // Render the PayPal button into this container
    };
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script); // Cleanup the script when the component unmounts
    };
  }, []);

  // Event handler for alternative payment method
  const handleAlternativePayment = () => {
    alert("Alternative payment method selected.");
    // Here, implement what happens when an alternative payment method is selected
  };

  return (
    <div>
      <h2>Complete Your Payment</h2>
      <div id="paypal-button-container"></div>{" "}
      {/* PayPal button will be rendered here */}
      <button onClick={handleAlternativePayment} style={{ marginTop: "20px" }}>
        Use Alternative Payment
      </button>
    </div>
  );
};

export default PaymentPage;
