import {Spinner} from "react-bootstrap";

const Loader = () => {
  return (
    <Spinner
      animation="border"
      role="status"
      style={{
        width: "24px",
        height: "24px",
        margin: "auto",
        display: "block",
      }}
    ></Spinner>
  );
};

export default Loader;
