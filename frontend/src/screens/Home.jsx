import React, { useEffect, useState } from "react";
import { Unity, useUnityContext } from "react-unity-webgl";
import "../App.css";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { useGetUserMutation } from "../slices/usersApiSlice";
import { toast } from "react-toastify";
import Loader from "../components/Loader";

function Home() {
  const [isSubscriber, setisSubscriber] = useState(false);
  const { userInfo } = useSelector((state) => state.auth);
  const [getProfile, { isLoading }] = useGetUserMutation();

  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await getProfile({userId: userInfo._id}).unwrap();
        setisSubscriber(res.isSubscriber);
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    }
    fetchProfile();
  }, [userInfo, getProfile]);

  const { unityProvider, loadingProgression, isLoaded } = useUnityContext({
    loaderUrl: "assets/Build.loader.js",
    dataUrl: "assets/Build.data",
    frameworkUrl: "assets/Build.framework.js",
    codeUrl: "assets/Build.wasm",
  });

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <>
          {isSubscriber ? (
            <div className="App">
              <div className="game-provider">
                {isLoaded === false && (
                  <>
                    <div className="loadingBar">
                      <div
                        className="loadingBarFill"
                        style={{ width: loadingProgression * 100 * 4 }}
                      />
                    </div>
                    <p className="text1" style={{ color: "white" }}>
                      Loading Application...{" "}
                      {Math.round(loadingProgression * 100)}%
                    </p>
                  </>
                )}
                <Unity
                  unityProvider={unityProvider}
                  className="unity-container"
                  style={{ display: isLoaded ? "block" : "none" }}
                />
              </div>
            </div>
          ) : (
            <div
              className="card text-center"
              style={{ width: "18rem", margin: "auto", marginTop: "20px" }}
            >
              <div className="card-body">
                <h5 className="card-title">Unlock Unlimited Fun!</h5>
                <p className="card-text">Buy Your Subscription Today</p>
                <Link to="/subscription" className="btn btn-success">
                  Get Started
                </Link>
              </div>
            </div>
          )}
        </>
      )}
    </>
  );
}

export default Home;
