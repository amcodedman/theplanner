require("dotenv").config();
const mailgen = require("mailgen");
const nodemailer = require("nodemailer");



const Transporter = nodemailer.createTransport({
  service: "gmail",
  secure: true,
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASS,
  },
});

const RegisterUser = async (user, userEmail, token) => {
  try {
  
    const MAILGEN = new mailgen({
      theme: "default",
      product: {
        name: "myplanner",
        link: `${process.env.SITE_DOMAIN}`,
      },
    });

    const emailbody = {
      body: {
        name: user,
        intro: "Welcome to myplanner We're very excited to have you here.",
        action: {
          instructions: "Please click below to verify your account and Enjoy",
          button: {
            color: "#22BC66", // Optional action button color
            text: "Confirm your account",
            link: `${process.env.SITE_DOMAIN}account/verification/?t=${token}`,
          },
        },
        outro: "Need help  ?.",
      },
    };

    const msg = MAILGEN.generate(emailbody);
    let message = {
      from: process.env.EMAIL,
      to: userEmail,
      subject: "Account verification",
      html: msg,
    };

    await Transporter.sendMail(message);
    return true;
  } catch (error) {
    console.log(error);
  }
};

const ResetPass = async (email_user, token) => {
  try {
    let mailG = new mailgen({
      theme: "default",
      product: {
        name: "myplanner",
        link: `${process.env.EMAIL_MAIN_URL}`,
      },
    });

    const email = {
      body: {
        name: email_user,
        intro: "we  are sorry for the stress",
        action: {
          instructions: "Please click below to reset your password",
          button: {
            color: "#1a73e8",
            text: "password reset link",
            link: `${process.env.SITE_DOMAIN}account/passwordreset?t=${token}`,
          },
        },
        outra: "you need any help?",
      },
    };
    let emailbody = mailG.generate(email);
    let message = {
      from: process.env.EMAIL,
      to: email_user,
      subject: "Password Reset",
      html: emailbody,
    };

    await Transporter.sendMail(message);
    return true;
  } catch (error) {
    console.log(error);
  }
};
/////////////////////////////////////////////
const Contactmail = async (emails, msg) => {
  try {
    let mailG = new Mailgen({
      theme: "default",
      product: {
        name: "luxurytransport",
        link: `${process.env.EMAIL_MAIN_URL}`,
      },
    });

    const email = {
      body: {
        intro: ["someone went a msg", `Email:${emails}`],
        outro: [`${msg}`],
      },
    };
    let emailbody = mailG.generate(email);
    let message = {
      from: process.env.EMAIL,
      to: `${emails}`,
      subject: "Contact message",
      html: emailbody,
    };
    await transporter.sendMail(message);
    return true;
  } catch (error) {
    if (error) {
    }
  }
};

/////////send email
const sendmail = async (contact) => {
  try {
    let mailG = new Mailgen({
      theme: "default",
      product: {
        name: "myplanner",
        link: `${process.env.EMAIL_MAIN_URL}`,
      },
    });

    const email = {
      body: {
        intro: [
          `Email:${contact.email}`,
          `firstname:${contact.fullname}`,
        ,
        ],
        outro: [`${contact.message}`],
      },
    };
    let emailbody = mailG.generate(email);
    let message = {
      from: `${process.env.EMAIL}`,
      to: `${contact.email}`,
      subject: "Contact message",
      html: emailbody,
    };
    await transporter.sendMail(message);
    return true;
  } catch (error) {
    if (error) {
      console.log(error);
    }
  }
};



module.exports = {
  RegisterUser,

  ResetPass
};
