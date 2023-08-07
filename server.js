const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
const dotenv = require('dotenv');  // Import the dotenv package

// Load environment variables from .env file
dotenv.config();

const app = express();
const port = process.env.PORT || 5505; 

app.use(cors({ origin: '*' })); // Allow requests from any origin during development
app.use(express.urlencoded({ extended: false }));
app.use(express.static(__dirname));


// Handle form submission
app.post('/contactForm', async (req, res) => {
  // Get form data
  const firstName = req.body['form-first-name'];
  const lastName = req.body['form-last-name'];
  const email = req.body['form-email'];
  const message = req.body['form-message'];

  // Prepare confirmation email
  const subject = 'Thank you for contacting us!';
  const body = `Dear ${firstName} ${lastName},\n\nThank you for contacting us. We have received your message, and we will get back to you soon.\n\nBest regards,\nThe TBMHP Team`;

  try {
    // Send the confirmation email
    await sendContactEmail(email, subject, body, firstName, lastName, email, message);

    // Send a response back to the client
    //res.send('Thank you for contacting us! A confirmation email has been sent to your email address.');
    res.redirect('/confirmation/contact.html');
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).send('An error occurred while sending the email.');
  }
});

// Function to send an email
async function sendContactEmail(to, subject, text, firstName, lastName, email, message) {
  // Create a transporter using GMAIL SMTP, transporter below is for testing purposes only
  //const transporter = nodemailer.createTransport({
    //service: 'Gmail',  
    //auth: {
      //user: process.env.EMAIL_USER,  // Use environment variable
      //pass: process.env.EMAIL_PASS,  // Use environment variable
    //},
  //});
  const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
        user: 'dorian.mcclure40@ethereal.email',
        pass: 'tjfA6vwm8hkvb5XPb3'
    }
});

  const mailOptionsToUser = {
    from: process.env.EMAIL_USER, 
    to: to,
    subject: subject,
    text: text,
  };

  const mailOptionsToAdmin = {
    from: process.env.EMAIL_USER,
    to: process.env.ADMIN_EMAIL,
    subject: `New contact us form submission - ${firstName}`,
    text: `A new contact us form submission has been received:\n\nFirst Name: ${firstName}\nLast Name: ${lastName}\nEmail: ${email}\nMessage: ${message}`
  };

  // Send emails to user and admin
  const userResponse = await transporter.sendMail(mailOptionsToUser);
  const adminResponse = await transporter.sendMail(mailOptionsToAdmin);

  // Print the URLs to view the test email details (ethereal)
  console.log('User email sent. Preview URL:', nodemailer.getTestMessageUrl(userResponse));
  console.log('Admin email sent. Preview URL:', nodemailer.getTestMessageUrl(adminResponse));
}

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
