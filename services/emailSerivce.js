const nodemailer = require('nodemailer')

const transporter = nodemailer.createTransport({
    host: "poczta.ct8.pl",
    auth: {
      user: process.env.email_address,
      pass: process.env.email_pass,
    },
  });

module.exports = {

    sendPassRecoveryEmail(to, pass){

        const mailOptions = {
            from: process.env.email_address,
            to: to,
            subject: "Odzyskiwanie hasła",
            text: `Witaj, twoje hasło zostało zresetowane. Zaloguj się używając hasła ${pass}`
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
              console.log(error);
            } else {
              console.log('Email sent: ' + info.response);
            }
          });

    }

}

