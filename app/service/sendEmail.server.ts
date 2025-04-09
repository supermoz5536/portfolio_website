import { Config } from "~/config";
import nodemailer from "nodemailer";

export async function sendContactForm(request: Request) {
  const formData = await request.formData();
  console.log(formData);

  const title = formData.get("title")?.toString();
  const email = formData.get("email")?.toString();
  const content = formData.get("content")?.toString();

  const transportOptions = {
    host: Config.SMTP_HOST,
    port: Config.SMTP_PORT,
    secure: Config.SMTP_SECURE,
    auth: {
      user: Config.SMTP_AUTH_USER,
      pass: Config.SMTP_AUTH_PASS,
    },
  } as unknown as import("nodemailer/lib/smtp-transport").Options;

  const transporter = nodemailer.createTransport(transportOptions);

  const info = await transporter.sendMail({
    from: Config.SMTP_AUTH_USER,
    to: Config.SEND_MAIL_ADDRESS,
    replyTo: email,
    subject: title,
    text: content,
  });

  console.log("Message sent:", info.messageId);
  console.log("Preview URL:", nodemailer.getTestMessageUrl(info));
}
