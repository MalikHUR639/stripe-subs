import { useState, useEffect } from "react";
import { Form, Button, Row, Col } from "react-bootstrap";
import FormContainer from "../components/FormContainer";
import Loader from "../components/Loader";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useRegisterMutation } from "../slices/usersApiSlice";
import { setCredentials } from "../slices/authSlice";
import { toast } from "react-toastify";

const RegisterScreen = () => {
  const [validated, set_Validated] = useState(false);
  const [form_Data, set_Form_Data] = useState({
    name: "",
    pass: "",
    confimPass: "",
    email: "",
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [register, { isLoading }] = useRegisterMutation();

  const { userInfo } = useSelector((state) => state.auth);

  useEffect(() => {
    if (userInfo) {
      navigate("/");
    }
  }, [navigate, userInfo]);

  const submitFn = async (event) => {
    console.log(event);
    
    const form = event.currentTarget;
    console.log("event>>",form, form.checkValidity(), "lion", form_Data.name, form_Data.email, "helo",form_Data.pass, /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,100}$/.test(form_Data.pass));
    
    if (form.checkValidity() === false && form_Data.name !== '' && form_Data.email !== '' && /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,100}$/.test(form_Data.pass)) {
     
    event.preventDefault();
    event.stopPropagation();
      try {
        const res = await register({
          name: form_Data.name,
          email: form_Data.email,
          password: form_Data.pass,
        }).unwrap();
        
        dispatch(setCredentials({ ...res }));
        navigate("/");
      } catch (err) {
        console.log("error", err);
        toast.error(err?.data?.message || err.error);
      }
    } else if(form.checkValidity()) {
      set_Validated(true);
      event.preventDefault();
    }
    else{
      set_Validated(false);
    }
  };
  
  const chngFn = (event) => {
    const { name, value } = event.target;
    console.log("helloo",name,value);
    set_Form_Data({
      ...form_Data,
      [name]: value,
    });
    set_Validated(false);
  };
  return (
    <FormContainer>
      <h1>Register</h1>
      <Form noValidate validated={validated} onSubmit={submitFn}>
        <Form.Group controlId="username">
          <Form.Label>Name</Form.Label>
          <Form.Control
            type="text"
            name="name"
            value={form_Data.name}
            minLength={2}
            onChange={chngFn}
            pattern="^[a-zA-Z0-9]+$"
            required
            isInvalid={validated && !/^[a-zA-Z0-9]+$/.test(form_Data.name)}
          />
          <Form.Control.Feedback type="invalid">
            Please enter a valid username (alphanumeric characters only).
          </Form.Control.Feedback>
        </Form.Group>
        
        <Form.Group controlId="email">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            name="email"
            value={form_Data.email}
            onChange={chngFn}
            required
            isInvalid={validated && !/^\S+@\S+\.\S+$/.test(form_Data.email)}
          />
          <Form.Control.Feedback type="invalid">
            Please enter a valid email address.
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group controlId="password">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            name="pass"
            value={form_Data.pass}
            onChange={chngFn}
            // pattern={form_Data.pass}
            required
            isInvalid={validated && 
              !/^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,100}$/.test(form_Data.pass)}
          />
          <Form.Control.Feedback type="invalid">
            Password must be at least 8 characters long. and must be include one special character
          </Form.Control.Feedback>
        </Form.Group>
        <Form.Group controlId="confirmPassword">
          <Form.Label>Confirm Password</Form.Label>
          <Form.Control
            type="password"
            name="confimPass"
            value={form_Data.confimPass}
            onChange={chngFn}
            required
            pattern={form_Data.pass}
            isInvalid={validated && form_Data.confimPass !== form_Data.pass}
          />
          <Form.Control.Feedback type="invalid">
            Passwords do not match.
          </Form.Control.Feedback>
        </Form.Group>

        <Button
          disabled={isLoading}
          type="submit"
          variant="primary"
          className="mt-3 w-100"
        >
          {isLoading ? <Loader /> : "Register"}
        </Button>
      </Form>

      <Row className="py-3">
        <Col>
          Already have an account? <Link to={`/login`}>Login</Link>
        </Col>
      </Row>
    </FormContainer>
  );
};

export default RegisterScreen;
