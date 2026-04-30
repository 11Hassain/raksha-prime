document.addEventListener('DOMContentLoaded', () => {
    // Accordion Logic
    const accordionHeaders = document.querySelectorAll('.accordion-header');

    accordionHeaders.forEach(header => {
        header.addEventListener('click', () => {
            const item = header.parentElement;
            const body = item.querySelector('.accordion-body');
            const icon = header.querySelector('i');

            const isOpen = item.classList.contains('active');

            // Close all
            document.querySelectorAll('.accordion-item').forEach(i => {
                i.classList.remove('active');
                i.querySelector('.accordion-body').style.maxHeight = null;
                i.querySelector('i').classList.replace('fa-minus', 'fa-plus');
            });

            // Open clicked
            if (!isOpen) {
                item.classList.add('active');
                body.style.maxHeight = body.scrollHeight + "px";
                icon.classList.replace('fa-plus', 'fa-minus');
            }
        });
    });

    // Sticky Navbar Glassmorphism Effect
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Full Page Language Translation via Google Translate
    const langSelector = document.querySelector('.language-selector');
    if (langSelector) {
        // Automatically sync our custom dropdown with the current google language cookie on page load
        if (document.cookie.includes('googtrans=')) {
            const match = document.cookie.match(/googtrans=\/en\/([a-z]{2})/);
            if (match && match[1]) langSelector.value = match[1];
        }

        langSelector.addEventListener('change', (e) => {
            const lang = e.target.value;

            if (lang === 'en') {
                // Safest & most reliable way to perfectly revert google translation to original English
                document.cookie = 'googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
                document.cookie = 'googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; domain=' + window.location.hostname + '; path=/;';
                window.location.reload();
            } else {
                const googleSelect = document.querySelector('.goog-te-combo');
                if (googleSelect) {
                    googleSelect.value = lang;
                    googleSelect.dispatchEvent(new Event('change'));
                }
            }
        });
    }

    // Smooth Scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href !== "#") {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });
});
