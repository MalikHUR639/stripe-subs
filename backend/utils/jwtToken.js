import jwt from "jsonwebtoken";

const encodeToken = (email, time) => {
  const token = jwt.sign({ email }, "secret", {
    expiresIn: time,
  });
  return token;
};

const decodeToken = (token) => {
  let decoded = jwt.verify(token, "secret");
  return decoded;
};

export { encodeToken, decodeToken };
