import nodemailer from 'nodemailer';
interface EmailData {
  email: string;
  subject: string;
  html: string;
}
export const sendEmail = async (data: EmailData) => {
  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
  });

  //verify connection configuration
  transporter.verify(function (error) {
    if (error) {
      console.log('errors in transporter email ', error);
    } else {
      console.log('Server is ready to take our messages');
    }
  });

  const info = await transporter.sendMail({
    from: process.env.SMTP_USER,
    to: data.email,
    subject: data.subject,
    html: data.html,
  });

  console.log('Message sent: %s', info.messageId);
};
