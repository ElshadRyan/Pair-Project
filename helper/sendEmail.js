const nodemailer = require("nodemailer");
async function sendEmail() {

    // Step 1: Create a transporter
    // This is like choosing WHICH mail service to use

    
    const transporter = nodemailer.createTransport({
        service: "gmail",

        auth: {
            user: "elshadryanardiyanto@gmail.com",
            pass: "pmoh yeod ydoh fwph",
        },
    });

    // Step 2: Create the email
    const mailOptions = {
        from: "elshadryanardiyanto@gmail.com",
        to: "elshadpw@gmail.com",
        subject: "berhasil login",
        text: "akun nya berhasil login",
    };

    // Step 3: Send the email
    const info = await transporter.sendMail(mailOptions);

}

module.exports = sendEmail