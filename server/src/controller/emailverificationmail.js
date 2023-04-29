const {EMAIL, PASSWORD} = require('../config');
const nodemailer = require('nodemailer');
const Mailgen = require('mailgen');
const emailValidator = require('email-validator');

let config = {
    service : "gmail",
    auth : {
        user : EMAIL,
        pass : PASSWORD
    }
};

let transporter = nodemailer.createTransport(config);

let MailGenerator = new Mailgen({
    theme : "default",
    product : {
        name : "Typique",
        link : "http://localhost:5173/auth"
    }
})

const sendVerifcationEmail = async(email, verificationCode) => {
    let response = {
        body : {
            intro : "Please click the button below to verify your email address:",
            action : {
                instructions : "Click the button below to verify your email address",
                button: {
                    color: "#33b5e5",
                    text: "Verify Email",
                    link: `https://typique.onrender.com/auth?email=${email}&verificationCode=${verificationCode}`,
                  },
            },
            outro : "If you did not create an account with Typique, please ignore this email."
        }
    }

    let mail = MailGenerator.generate(response);
    let message = {
        from : "Typique",
        to : email,
        subject : "Verify Your Email Address",
        html : mail,
    }
    await transporter.sendMail(message);
}

const sendVerificationCode = async(req, res) => {
    const {email, verificationCode} = req.body;
  
    const isValidEmail = emailValidator.validate(email);
    if(!isValidEmail){
        return res.status(400).json({error : "Invalid email address"})
    }

  

  // Send the verification email
  try {
    await sendVerifcationEmail(email, verificationCode);
    return res.status(200).json({
      msg: "Verification email sent.",
      verificationCode: verificationCode,
    });
  } catch (error) {
    return res.status(500).json({
      error: "Failed to send verification email.",
    });
  }
}

module.exports = {sendVerificationCode};