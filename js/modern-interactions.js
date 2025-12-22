document.addEventListener('DOMContentLoaded', () => {
    // Typewriter Effect
    const textElement = document.getElementById('typewriter');
    if (textElement) {
        const texts = ["Backend Developer", "Java & Spring Boot Specialist", "API Architect", "Problem Solver"];
        let count = 0;
        let index = 0;
        let currentText = "";
        let letter = "";
        let isDeleting = false;

        (function type() {
            if (count === texts.length) {
                count = 0;
            }
            currentText = texts[count];

            if (isDeleting) {
                letter = currentText.slice(0, --index);
            } else {
                letter = currentText.slice(0, ++index);
            }

            textElement.textContent = letter;

            let typeSpeed = 100;
            if (isDeleting) {
                typeSpeed = 50; 
            }

            if (!isDeleting && letter.length === currentText.length) {
                typeSpeed = 2000; // Wait at end
                isDeleting = true;
            } else if (isDeleting && letter.length === 0) {
                isDeleting = false;
                count++;
                typeSpeed = 500;
            }

            setTimeout(type, typeSpeed);
        })();
    }

    // Navbar Scroll Effect (Glassmorphism intensity change)
    const navbar = document.querySelector('.navbar');
    if(navbar) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                navbar.style.background = 'rgba(15, 23, 42, 0.9) !important';
                navbar.style.boxShadow = '0 10px 30px -10px rgba(0,0,0,0.5)';
            } else {
                navbar.style.background = 'rgba(15, 23, 42, 0.6) !important';
                navbar.style.boxShadow = 'none';
            }
        });
    }
});
