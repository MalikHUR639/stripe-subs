import { useState } from "react";
import { Form, Button, Row, Col } from "react-bootstrap";
import FormContainer from "../components/FormContainer";
import Loader from "../components/Loader";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useGetTokenQuery, useResetPasswordMutation } from "../slices/usersApiSlice";
import { toast } from "react-toastify";

const ResetPassword = () => {
  let [searchParams, setSearchParams] = useSearchParams();
  const [password, setPassword] = useState("");
  const [isUrl,setIsUrl]=useState(true);
  const [confirmPassword, setConfirmPassword] = useState("");

  const navigate = useNavigate();

  const [resetPassword, { isLoading }] = useResetPasswordMutation();
  const { data, isFetching, isError, isSuccess} = useGetTokenQuery({ skip: isUrl });


  const submitHandler = async (e) => {
    e.preventDefault();
    const token = searchParams.get("token");
    if (password && confirmPassword && password === confirmPassword) {
      try {
        const res = await resetPassword({ password, token }).unwrap();
        navigate("/");
      } catch (err) {
        console.log("error", err);
        toast.error(err?.data?.message || err.error);
      }
    } else {
      toast.error("Passwords do not match");
    }
  };
  
  const fetchurl = () => {
    setIsUrl(false);
    try {
      if (data && isSuccess) {
        window.open(`${data.token}`, "_blank");
      } else {
        console.log("Token not found in response or query not successful");
      }
    } catch (isError) {
      console.error("Error fetching token:", isError);
      toast.error(isError);
    }
  };
  
  return (
    <FormContainer>
      <h1>Reset Password</h1>
      <Form onSubmit={submitHandler}>
        <Form.Group className="my-2" controlId="password">
          <Form.Label>Password</Form.Label>
          <Form.Control
            required
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          ></Form.Control>
        </Form.Group>
        <Form.Group className="my-2" controlId="confirmPassword">
          <Form.Label>Confirm Password</Form.Label>
          <Form.Control
            required
            type="password"
            placeholder="Confirm password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          ></Form.Control>
        </Form.Group>

        <Button type="submit" variant="primary" className="mt-3">
          Reset Password
        </Button>

        {isLoading && <Loader />}
      </Form>

      <Row className="py-3">
        <Col>
          <Link to={`/login`}>Login</Link>
        </Col>
        <Col>
        <Button onClick={fetchurl} variant="primary" >
        {isFetching?"loading":"Login magic url"} 
        </Button>
        </Col>
      </Row>
    </FormContainer>
  );
};

export default ResetPassword;
