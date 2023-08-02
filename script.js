document.getElementById('contact-us').addEventListener('submit', async (event) => {
  event.preventDefault(); 

  const form = event.target;
  const formData = new FormData(form);

  try {
    // Send the form data to the server using fetch API
    const response = await fetch('/submit_contact_form', {
      method: 'POST',
      body: formData,
    });

    // Handle the server response here
    if (response.ok) {
      const result = await response.text();
      console.log(result); // Log the server response (e.g., "Thank you for contacting us! A confirmation email has been sent to your email address.")
    } else {
      console.error('Server responded with an error:', response.status, response.statusText);
    }
  } catch (error) {
    console.error('Error sending form data:', error);
  }
});
