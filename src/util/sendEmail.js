const nodemailer = require('nodemailer');
const path = require('path');
const puppeteer = require('puppeteer');

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

const sendMail = async (to, subject, text, html = null) => {

    let mailOptions = null
    if (html) {
        let imagePath = await htmlToImage(html, 'output.png');
        // Define email options
        mailOptions = {
            from: 'lifeclinicservice@zohomail.com',
            to: to,
            subject: subject,
            html: `<div style="margin-bottom: 15px;"><img width="350px" src="cid:unique@cid" alt="Embedded Image" /></div>` + text,
            attachments: [
                {
                    filename: 'EmailPicture.png', // Tên file hình ảnh
                    path: path.join(__dirname, 'EmailPicture.png'), // Đường dẫn tới file hình ảnh
                    cid: 'unique@cid' // CID để nhúng hình ảnh vào nội dung HTML
                },
                {
                    filename: 'output.png',
                    path: imagePath
                }
            ]
        };
    } else {
        // Define email options
        mailOptions = {
            from: 'lifeclinicservice@zohomail.com',
            to: to,
            subject: subject,
            html: `<div style="margin-bottom: 15px;"><img width="350px" src="cid:unique@cid" alt="Embedded Image" /></div>` + text,
            attachments: [
                {
                    filename: 'EmailPicture.png', // Tên file hình ảnh
                    path: path.join(__dirname, 'EmailPicture.png'), // Đường dẫn tới file hình ảnh
                    cid: 'unique@cid' // CID để nhúng hình ảnh vào nội dung HTML
                }
            ]
        };
    }

    // Send email
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error sending email:', error);
        } else {
            console.log('Email sent:', info.response);
        }
    });
}

async function htmlToImage(htmlContent, outputPath) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    // Set the page content
    await page.setContent(htmlContent);

    // Use page.evaluate to get the size of the rendered content
    const bodyWidth = await page.evaluate(() => document.body.scrollWidth);
    const bodyHeight = await page.evaluate(() => document.body.scrollHeight);

    // Set viewport size based on the size of the rendered content
    await page.setViewport({ width: bodyWidth, height: bodyHeight });

    // Example: Wait for a specific element to be rendered
    await page.waitForSelector('body');

    // Example: Take a screenshot of the body
    await page.screenshot({ path: outputPath });

    await browser.close();
    console.log(`Screenshot saved to ${outputPath}`);

    return outputPath;
}

export default sendMail