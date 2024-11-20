
const sendEmail = require("./send-email");

module.exports = {
    sendOtp: async ({email, firstName, otpCode, duration=1}) => {
            //send email
            var fromEmail = process.env.AUTH_EMAIL;
            const mailOptions = {
                from: `"Cochevia" <${fromEmail}>`,
                to: `${firstName} <${email}>`,
                subject: 'WELCOME TO COCHEVIA',
                html: `<html>
                        <body>
                            <p> Verify your email </p> <p style:"color:tomato; font-size: 25px; letter-spacing: 2px;"><b>${otpCode}</b></p>
                            <p> This code expires in ${duration} hours(s)</b>.</p>
                            </body>
                        </html>`, 
                        
            };

            await sendEmail(mailOptions);

    },

    sendDriverOtp: async ({email, firstName, otpCode, duration=1}) => {
        //send email
        var fromEmail = process.env.AUTH_EMAIL;
        const mailOptions = {
            from: `"Cochevia" <${fromEmail}>`,
            to: `${firstName} <${email}>`,
            subject: 'WELCOME TO COCHEVIA FAMILY',
            html: `<html>
                    <body>
                        <p> Verify your email to join us </p> <p style:"color:tomato; font-size: 25px; letter-spacing: 2px;"><b>${otpCode}</b></p>
                        <p> This code expires in ${duration} hours(s)</b>.</p>
                        </body>
                    </html>`, 
                    
        };

        await sendEmail(mailOptions);
    },


    sendAdminInvite: async ({email, url}) => {
        //send email
        var fromEmail = process.env.AUTH_EMAIL;
        const mailOptions = {
            from: `"Cochevia" <${fromEmail}>`,
            to: `<${email}>`,
            subject: 'WELCOME TO CORE COCHEVIA',
            html: `<html>
                    <body>
                        <h4> We are glad to invite you in our management team </h4> 
                        <p style:"color:tomato; font-size: 25px; letter-spacing: 2px;"><b>${url}</b></p>
                        
                    </body>
                    </html>`, 
                    
        };

        await sendEmail(mailOptions);
    }
}