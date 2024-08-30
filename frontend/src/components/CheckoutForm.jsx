import React, { useState } from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import Alert from "react-bootstrap/Alert";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { useUpdateSubscriptionMutation } from "../slices/usersApiSlice";

export default function CheckoutForm({ clientSecret }) {
  const [succeeded, setSucceeded] = useState(false);
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState("");
  const [disabled, setDisabled] = useState(true);
  const stripe = useStripe();
  const elements = useElements();
  const [updateSubscription]=useUpdateSubscriptionMutation();
  const { userInfo } = useSelector((state) => state.auth);
  const handleChange = async (event) => {
    setDisabled(event.empty);
    setError(event.error ? event.error.message : "");
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();
  
    if (!stripe || !elements) {
      return;
    }
  
    setProcessing(true);
  
    try {
      const payload = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
        },
      });
  
      if (payload.error) {
        setError(`Payment failed ${payload.error.message}`);
      } else {
        setError(null);
        setProcessing(true);
  
        await updateSubscription({ isSubscriber: true, userId: userInfo._id });
  
        console.log("Subscription updated successfully!");
      }
    } catch (error) {
      setError(`An error occurred: ${error.message}`);
      console.error(error);
    } finally {
      setProcessing(false);
      setSucceeded(true);
    }
  };

  const CARD_OPTIONS = {
    hidePostalCode: true,
  };

  return (
    <div className="mt-3">
      {error && <Alert variant="danger">{error}</Alert>}
      {succeeded ? (
        <div>
          <Alert severity="success" className="mt-2 mb-0">
            You're all set! Your subscription is active, granting you
            uninterrupted access to our content.
          </Alert>
          <Link to="/">
            <button className="btn btn-primary mt-3">Back to Home</button>
          </Link>
        </div>
      ) : (
        <form id="payment-form" onSubmit={handleSubmit}>
          <div
            style={{
              padding: "20px",
              backgroundColor: "#e7e7e7",
              borderRadius: "10px",
            }}
          >
            <CardElement
              id="card-element"
              options={CARD_OPTIONS}
              onChange={handleChange}
            />
            <button
              style={{
                marginTop: "20px",
                backgroundColor: processing || disabled ? "#ccc" : "black",
                color: "white",
                border: 0,
                padding: "8px 20px",
                borderRadius: "30px",
              }}
              disabled={processing || disabled || !stripe}
              id="submit"
              type="submit"
            >
              {processing ? "Processing..." : "Pay now"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
