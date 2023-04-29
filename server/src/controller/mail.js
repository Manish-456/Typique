const {EMAIL, PASSWORD} = require('../config')

const nodeMailer = require("nodemailer");
const Mailgen = require("mailgen");

let config = {
  service: "gmail",
  auth: {
    user: EMAIL,
    pass: PASSWORD,
  },
};

let transporter = nodeMailer.createTransport(config);

let MailGenerator = new Mailgen({
  theme: "default",
  product: {
    name: "Typique",
    link: "https://typique.onrender.com",
  },
});

//  send mail from real gmail account

const mailer = async (req, res) => {
  const { username, email, text, subject } = req.body;
  let response = {
    body: {
      name: username,
      intro: text || "Welcome to Typique Blog",
      outro: "Looking forward to do more business",
    },
  };

  let mail = MailGenerator.generate(response);
  let message = {
    from: "Typique",
    to: email,
    subject: subject || "Signup successfully",
    html: mail,
  };
  transporter
    .sendMail(message)
    .then(() => {
      return res.status(201).json({
        msg: "You should receive an email",
      });
    })
    .catch((error) => {
      return res.status(500).json({ error });
    });
};

module.exports = mailer
