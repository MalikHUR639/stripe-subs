import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.js";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import store from "./store.js";
import { Provider } from "react-redux";
import LoginScreen from "./screens/LoginScreen.jsx";
import RegisterScreen from "./screens/RegisterScreen.jsx";
import ProfileScreen from "./screens/ProfileScreen.jsx";
import PrivateRoute from "./components/PrivateRoute.jsx";
import Info from "./screens/Info.jsx";
import Home from "./screens/Home.jsx";
import Payment from "./screens/Subscription.jsx";
import Checkout from "./screens/Checkout.jsx";
import Notfound from "./NotFound.js";
import ResetPassword from "./screens/ResetPassword.jsx";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route path="/login" element={<LoginScreen />} />
      {/* <Route path="/login/:token" element={<LoginScreen />} /> */}
      <Route path="/register" element={<RegisterScreen />} />
      <Route path="/resetPassword" element={<ResetPassword />} />
      <Route path="" element={<PrivateRoute />}>
        <Route index={true} path="/" element={<Home />} />
        <Route path="/profile" element={<ProfileScreen />} />
        <Route path="/info" element={<Info />} />
        <Route path="/subscription" element={<Payment />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="*" element={<Notfound />} />
      </Route>
    </Route>
  )
);

ReactDOM.createRoot(document.getElementById("root")).render(
  <Provider store={store}>
      <RouterProvider router={router} />
  </Provider>
);
