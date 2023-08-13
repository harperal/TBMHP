const express = require('express');
const path = require('path');
const cors = require('cors');
const nodemailer = require('nodemailer');
const dotenv = require('dotenv');  // Import the dotenv package

// Load environment variables from .env file
dotenv.config();

const app = express();
const port = process.env.PORT || 5506; 

app.use(cors({ origin: '*' })); // Allow requests from any origin during development
app.use(express.urlencoded({ extended: false }));
app.use(express.static(__dirname));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/home', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'home.html'));
});

// Handle Contact Us form submission
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

// Function to send Contact Us confirmation email to user and admin
async function sendContactEmail(to, subject, text, firstName, lastName, email, message) {
  // Create a transporter using GMAIL SMTP, smtp.ethereal transporter below is for testing purposes only
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


// Handle registration form submission
app.post('/registerForm', async (req, res) => {
  const { distance, firstname, lastname, email, phone, gender, age, participation } = req.body;

  const subject = 'Thank you for registering!';
  const body = `Dear ${firstname} ${lastname},\n\nThank you for registering for the race. Your registration details are as follows:\n\nDistance: ${distance}\nEmail: ${email}\nPhone: ${phone}\nGender: ${gender}\nAge: ${age}\nParticipation: ${participation}\n\nWe look forward to seeing you at the event!\n\nBest regards,\nThe TBMHP Team`;

  try {
    // Send the confirmation email
    await sendRegistrationEmail(email, subject, body, firstname, lastname, email, participation);

    // Send a response back to the client
    res.redirect('/confirmation/registration.html');
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).send('An error occurred while sending the email.');
  }
});

// Function to send a registration email
async function sendRegistrationEmail(to, subject, text, firstname, lastname, email, participation) {
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
    subject: `New registration form submission - ${firstname}`,
    text: `A new registration form submission has been received:\n\nFirst Name: ${firstname}\nLast Name: ${lastname}\nEmail: ${email}\nParticipation: ${participation}`
  };

  // Send emails to user and admin
  const userResponse = await transporter.sendMail(mailOptionsToUser);
  const adminResponse = await transporter.sendMail(mailOptionsToAdmin);

  // Print the URLs to view the test email details (ethereal)
  console.log('User email sent. Preview URL:', nodemailer.getTestMessageUrl(userResponse));
  console.log('Admin email sent. Preview URL:', nodemailer.getTestMessageUrl(adminResponse));
}

// Handle donation form submission
app.post('/donateForm', async (req, res) => {
  const { firstName, lastName, email, address1, address2, city, state, zip } = req.body;

  const subject = 'Thank you for your donation!';
  const body = `Dear ${firstName} ${lastName},\n\nThank you for your generous donation. Your support is greatly appreciated.\n\nBest regards,\nThe TBMHP Team`;

  try {
    // Send the confirmation email
    await sendDonationEmail(email, subject, body, firstName, lastName, email, address1, address2, city, state, zip);

    // Send a response back to the client
    res.redirect('/confirmation/donation.html');
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).send('An error occurred while sending the email.');
  }
});

// Function to send a donation email to user and admin
async function sendDonationEmail(to, subject, text, firstName, lastName, email, address1, address2, city, state, zip) {
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
    subject: `New donation form submission - ${firstName}`,
    text: `A new donation form submission has been received:\n\nFirst Name: ${firstName}\nLast Name: ${lastName}\nEmail: ${email}\nAddress: ${address1}\nAddress 2: ${address2}\nCity: ${city}\nState: ${state}\nZip: ${zip}`
  };

  // Send emails to user and admin
  const userResponse = await transporter.sendMail(mailOptionsToUser);
  const adminResponse = await transporter.sendMail(mailOptionsToAdmin);

  // Print the URLs to view the test email details (ethereal)
  console.log('User email sent. Preview URL:', nodemailer.getTestMessageUrl(userResponse));
  console.log('Admin email sent. Preview URL:', nodemailer.getTestMessageUrl(adminResponse));
}

app.post('/subscribeForm', async (req, res) => {
  //const { email } = req.body;
  const email = req.body['sub-email'];

  const subject = 'Thank you for subscribing!';
  const body = `Dear Subscriber,\n\nThank you for subscribing to our newsletter. You'll receive updates and news from us.\n\nBest regards,\nThe TBMHP Team`;

  try {
    await sendSubscribeEmail(email, subject, body);

    res.redirect('/confirmation/subscription.html');
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).send('An error occurred while sending the email.');
  }
});

async function sendSubscribeEmail(to, subject, text) {
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
    to: process.env.ADMIN_EMAIL, // Set the admin's email address
    subject: `New subscriber!`,
    text: `A new subscription form submission has been received:\n\nEmail: ${to}`
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
