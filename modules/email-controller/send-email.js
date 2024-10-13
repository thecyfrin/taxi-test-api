const nodemailer = require('nodemailer');


const sendEmail = async (mailOptions) => {
    let transporter = nodemailer.createTransport({
        host: 'smtp.mailersend.net', // <= your smtp server here
        port: 587, // <= connection port
        // secure: true, // use SSL or not
        auth: {
            user: process.env.AUTH_EMAIL, // <= smtp login user
            pass: process.env.AUTH_PASS // <= smtp login pass
        }, 
        tls:{
            rejectUnauthorized: false
        }
    });

    let mailOption = mailOptions;
    // send mail with defined transport object
    transporter.sendMail(mailOption, (error, info) => {

        if (error) {
            return console.log(error.message);
        }
        console.log('Message sent: %s', info.messageId);
    });
}

module.exports = sendEmail;