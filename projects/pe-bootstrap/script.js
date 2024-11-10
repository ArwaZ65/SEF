// Initialize tooltips and set up event listeners for each copy button
document.querySelectorAll('.copyButton').forEach((button, index) => {
    // Initialize tooltip for each button
    const tooltip = new bootstrap.Tooltip(button, { title: 'Copy to clipboard' });
    
    button.addEventListener('click', function () {
        const textArea = document.querySelectorAll('.floatingTextarea')[index];
        textArea.select();
        document.execCommand('copy');

        // Update tooltip text to 'Copied!' and show it
        tooltip.setContent({ '.tooltip-inner': 'Copied!' });
        tooltip.show();

        // Show the alert and reset tooltip text after a short delay
        setTimeout(() => {
            alert("تم نسخ النص");
            tooltip.setContent({ '.tooltip-inner': 'Copy to clipboard' });
            tooltip.hide();
        }, 1000);
    });
});
document.addEventListener("DOMContentLoaded", function () {
    const navbarToggler = document.querySelector(".navbar-toggler");
    const navbarContent = document.getElementById("navbarContent");

    navbarToggler.addEventListener("click", function () {
        // Manually toggle the `show` class on the navbar content
        navbarContent.classList.toggle("show");
    });

    // Close the navbar when clicking outside of it
    document.addEventListener("click", function (event) {
        if (!navbarContent.contains(event.target) && !navbarToggler.contains(event.target)) {
            navbarContent.classList.remove("show");
        }
    });
});