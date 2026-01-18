document.addEventListener('DOMContentLoaded', () => {

    // --- Mobile Menu Toggle ---
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const header = document.getElementById('header');
    let isMenuOpen = false;

    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', () => {
            isMenuOpen = !isMenuOpen;
            if (isMenuOpen) {
                mobileMenu.classList.remove('hidden');
                // Icon change logic can be added here if needed
            } else {
                mobileMenu.classList.add('hidden');
            }
        });

        // Close menu when clicking a link
        const mobileLinks = mobileMenu.querySelectorAll('a');
        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                isMenuOpen = false;
                mobileMenu.classList.add('hidden');
            });
        });
    }

    // --- Header Background on Scroll ---
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('shadow-md');
            header.classList.remove('py-4'); // Adjust padding if initial state had more
        } else {
            header.classList.remove('shadow-md');
        }
    });

    // --- Intersection Observer for Fade-in Animations ---
    const observerOptions = {
        root: null, // viewport
        rootMargin: '0px',
        threshold: 0.1 // Trigger when 10% of the element is visible
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target); // Only animate once
            }
        });
    }, observerOptions);

    const animatedElements = document.querySelectorAll('.fade-in, .fade-in-up');
    animatedElements.forEach(el => {
        observer.observe(el);
    });

    // --- Smooth Scroll for Anchor Links (Backup for Safari if css scroll-behavior not supported) ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                // Adjust for sticky header height
                const headerHeight = header.offsetHeight;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerHeight;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: "smooth"
                });
            }
        });
    });

    // --- Contact Form Handling (Formspree) ---
    const contactForm = document.getElementById('contact-form');
    const formStatus = document.getElementById('form-status');

    if (contactForm) {
        contactForm.addEventListener('submit', async function (event) {
            event.preventDefault();
            const form = event.target;
            const data = new FormData(form);
            const action = form.action;
            const submitButton = form.querySelector('button[type="submit"]');

            // Disable button during submission
            submitButton.disabled = true;
            submitButton.textContent = '送信中...';

            try {
                const response = await fetch(action, {
                    method: 'POST',
                    body: data,
                    headers: {
                        'Accept': 'application/json'
                    }
                });

                if (response.ok) {
                    Swal.fire({
                        title: '送信完了！',
                        text: 'お問い合わせを受け付けました。ありがとうございます。',
                        icon: 'success',
                        confirmButtonText: '閉じる',
                        confirmButtonColor: '#003D82'
                    });
                    form.reset();
                } else {
                    const jsonData = await response.json();
                    let errorMessage = "送信に失敗しました。時間をおいて再度お試しください。";
                    if (Object.hasOwn(jsonData, 'errors')) {
                        errorMessage = jsonData["errors"].map(error => error["message"]).join(", ");
                    }

                    Swal.fire({
                        title: '送信失敗',
                        text: errorMessage,
                        icon: 'error',
                        confirmButtonText: '閉じる',
                        confirmButtonColor: '#d33'
                    });
                }
            } catch (error) {
                Swal.fire({
                    title: 'エラー',
                    text: '送信エラーが発生しました。インターネット接続を確認してください。',
                    icon: 'error',
                    confirmButtonText: '閉じる',
                    confirmButtonColor: '#d33'
                });
            } finally {
                submitButton.disabled = false;
                submitButton.textContent = '送信する';
            }
        });
    }

});
