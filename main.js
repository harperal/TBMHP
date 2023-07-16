// Get references to the elements
const toggleButton = document.querySelector('.toggle');
const menuItems = document.querySelectorAll('.item');

// Add an event listener to the toggle button
toggleButton.addEventListener('click', function() {
  // Loop through each menu item
  menuItems.forEach(item => {
    // Toggle the "active" class to show/hide the menu items
    item.classList.toggle('active');
  });
});