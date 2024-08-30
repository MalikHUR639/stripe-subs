import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Checkout from "./Checkout";
import { toast } from "react-toastify";
import Loader from "../components/Loader";
import {
  useGetUserMutation,
  useGetPriceMutation,
  useCreateSubscriptionMutation,
  useCancelSubscriptionMutation,
} from "../slices/usersApiSlice";
import Alert from "react-bootstrap/Alert";

const Payment = () => {
  const [isSubscriber, setIsSubscriber] = useState(false);
  const [product, setProduct] = useState({});
  const [clientSecret, setClientSecret] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [customerID, setCustomerID] = useState("");
  const [cancelSubscription, setCancelSubscription] = useState(false);

  const [cancelSubscriptionMutation] = useCancelSubscriptionMutation();
  const [createSubsciption] = useCreateSubscriptionMutation();
  const [getProfile] = useGetUserMutation();
  const [getPrice] = useGetPriceMutation();
  const { userInfo } = useSelector((state) => state.auth);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await getProfile({ userId: userInfo._id }).unwrap();
        setIsSubscriber(res.isSubscriber);
        setCustomerID(res.customerID);
      } catch (err) {
        if (err?.data?.message) {
          toast.error(err.data.message);
        } else {
          console.error("Fetch Profile Error:", err);
          toast.error("An error occurred while fetching the user profile.");
        }
      }
    };

    fetchProfile();
  }, [userInfo, getProfile]);

  useEffect(() => {
    const fetchPrice = async () => {
      try {
        const priceId = process.env.REACT_APP_STRIPE_Price_ID || "";
        const response = await getPrice({ priceId }).unwrap();
        setProduct(response);
      } catch (err) {
        if (err?.status === 404) {
          setAlertMessage("No subscription found");
          toast.error("No Subscription Found");
        } else {
          console.error("Fetch Price Error:", err);
          toast.error(
            "An error occurred while fetching the subscription price."
          );
        }
      }
    };

    fetchPrice();
  }, []);

  const handleSubscribe = async (priceId) => {
    setLoading(true);

    try {
      const response = await createSubsciption({
        priceId,
        customerID,
      }).unwrap();
      setClientSecret(response.clientSecret);
    } catch (error) {
      console.error("Subscribe Error:", error);
      toast.error("An error occurred while subscribing. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const closeSubscription = async () => {
    setLoading(true);

    try {
      const response = await cancelSubscriptionMutation({
        customerID,
      }).unwrap();
      setCancelSubscription(true);
    } catch (error) {
      console.error("Close Subscription Error:", error);
      toast.error("An error occurred while cancelling the subscription.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      {alertMessage && <p className="mt-4 h5">{alertMessage}</p>}
      {product?.nickname && (
        <div className="card" style={{ width: "30rem", margin: "20px auto" }}>
          <div className="card-body">
            <h5 className="card-title">{product.nickname}</h5>
            <p>$ {product.unit_amount / 100}</p>
            {isSubscriber ? (
              <button
                disabled={cancelSubscription}
                className="btn btn-danger d-flex gap-2"
                onClick={closeSubscription}
              >
                <span>Cancel Subscription</span>
                {loading && <Loader />}
              </button>
            ) : (
              <>
                {!clientSecret && (
                  <button
                    disabled={loading}
                    className="btn btn-primary d-flex gap-2"
                    onClick={() => handleSubscribe(product.id)}
                  >
                    <span>Subscribe Annually</span>
                    {loading && <Loader />}
                  </button>
                )}
                {clientSecret && <Checkout clientSecret={clientSecret} />}
              </>
            )}
            {cancelSubscription && (
              <Alert severity="success" className="mt-2 mb-0">
                Subscription cancelled successfully!
              </Alert>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Payment;
