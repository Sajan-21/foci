const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
dotenv.config();

exports.sendMail = async(options) => {
    try {
        const transporter = nodemailer.createTransport({
            host: process.env.MAIL_HOST,
            port: process.env.MAIL_PORT,
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASS
            }
        });

        const mailOptions = {
            from: "foci@sajan.dev",
            to: options.to,
            subject: options.subject,
            html: options.html
        }

        const sendMail = await transporter.sendMail(mailOptions);
        if(sendMail) {
            return true;
        }

    } catch (error) {
        console.log("error in sendMail: ",error);
        return error.message || error;
    }
}