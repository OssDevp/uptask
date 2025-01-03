import nodemailer from "nodemailer";

const config = () => {
  return {
    host: "sandbox.smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: "7deb9cb880f8d5",
      pass: "860cb163a5a190"
    }
  }
}

export const transporter = nodemailer.createTransport(config());