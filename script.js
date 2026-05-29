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
        // Sync custom dropdown with current googtrans cookie on load
        if (document.cookie.includes('googtrans=')) {
            const match = document.cookie.match(/googtrans=\/en\/([a-z]{2})/);
            if (match && match[1]) langSelector.value = match[1];
        }

        langSelector.addEventListener('change', (e) => {
            const lang = e.target.value;

            if (lang === 'en') {
                // Clear the translation cookies and reload to restore English
                document.cookie = 'googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
                document.cookie = 'googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; domain=' + window.location.hostname + '; path=/;';
                window.location.reload();
            } else {
                // Step 1: Set the googtrans cookie so reload always works as fallback
                document.cookie = `googtrans=/en/${lang}; path=/`;
                // Also set for the actual domain (needed when hosted on Netlify etc.)
                if (window.location.hostname && window.location.hostname !== '') {
                    document.cookie = `googtrans=/en/${lang}; domain=${window.location.hostname}; path=/`;
                }

                // Step 2: Try to trigger Google Translate directly (avoids reload)
                // Retry because .goog-te-combo loads asynchronously
                const tryTranslate = (attempts) => {
                    const googleSelect = document.querySelector('.goog-te-combo');
                    if (googleSelect) {
                        googleSelect.value = lang;
                        googleSelect.dispatchEvent(new Event('change'));
                    } else if (attempts < 20) {
                        setTimeout(() => tryTranslate(attempts + 1), 150);
                    } else {
                        // Google Translate never loaded — reload with cookie already set
                        window.location.reload();
                    }
                };
                tryTranslate(0);
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
