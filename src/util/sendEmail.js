const nodemailer = require('nodemailer');

// Create a transporter
const transporter = nodemailer.createTransport({
    host: 'smtp.zoho.com',
    port: 465,
    secure: true, // TLS requires secureConnection to be false
    auth: {
        user: 'lifeclinicservice@zohomail.com',
        pass: 'huubach1822'
    }
});

const sendMail = async (to, subject, text) => {

    // Define email options
    const mailOptions = {
        from: 'lifeclinicservice@zohomail.com',
        to: to,
        subject: subject,
        text: text
    };

    // Send email
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error sending email:', error);
        } else {
            console.log('Email sent:', info.response);
        }
    });
}

export default sendMail