import nodemailer from "nodemailer";

const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
const ADMIN_PASS = process.env.ADMIN_EMAIL_PASS;
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: ADMIN_EMAIL,
    pass: ADMIN_PASS,
  },
});

export { transporter };
