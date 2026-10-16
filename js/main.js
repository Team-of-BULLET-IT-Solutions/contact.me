// Theme toggle (the saved or system theme is applied in <head> before first paint)
const root = document.documentElement;
const themeToggle = document.querySelector('.theme-toggle');
const darkQuery = window.matchMedia('(prefers-color-scheme: dark)');

function savedTheme() {
    try { return localStorage.getItem('theme'); } catch (e) { return null; }
}

if (themeToggle) {
    themeToggle.addEventListener('click', () => {
        const next = root.dataset.theme === 'dark' ? 'light' : 'dark';
        root.dataset.theme = next;
        try { localStorage.setItem('theme', next); } catch (e) {}
    });
}

// Follow the system setting until the visitor picks a theme themselves
darkQuery.addEventListener('change', (e) => {
    if (!savedTheme()) root.dataset.theme = e.matches ? 'dark' : 'light';
});

// Mobile menu
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');
const navBackdrop = document.querySelector('.nav-backdrop');

function setMenu(open) {
    hamburger.classList.toggle('active', open);
    hamburger.setAttribute('aria-expanded', String(open));
    hamburger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    navMenu.classList.toggle('active', open);
    navBackdrop.classList.toggle('active', open);
    document.body.classList.toggle('menu-open', open);
}

if (hamburger && navMenu && navBackdrop) {
    hamburger.addEventListener('click', () => setMenu(!navMenu.classList.contains('active')));
    navBackdrop.addEventListener('click', () => setMenu(false));
    navMenu.querySelectorAll('a').forEach(link => link.addEventListener('click', () => setMenu(false)));
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && navMenu.classList.contains('active')) setMenu(false);
    });
}

// Header background once the page scrolls
const header = document.querySelector('.header');
if (header) {
    const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
}

// Reveal on scroll
const revealElements = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
    revealElements.forEach(el => revealObserver.observe(el));
} else {
    revealElements.forEach(el => el.classList.add('visible'));
}

// Count-up animation for the impact numbers
const counters = document.querySelectorAll('.counter');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const statsBlock = document.querySelector('.stats');

if (statsBlock && counters.length && !reduceMotion && 'IntersectionObserver' in window) {
    counters.forEach(counter => { counter.textContent = '0'; });
    const statsObserver = new IntersectionObserver((entries, observer) => {
        if (!entries.some(entry => entry.isIntersecting)) return;
        observer.disconnect();
        counters.forEach(counter => {
            const target = +counter.dataset.target;
            const start = performance.now();
            const duration = 1600;
            const tick = (now) => {
                const progress = Math.min((now - start) / duration, 1);
                counter.textContent = Math.round(target * (1 - Math.pow(1 - progress, 3)));
                if (progress < 1) requestAnimationFrame(tick);
            };
            requestAnimationFrame(tick);
        });
    }, { threshold: 0.4 });
    statsObserver.observe(statsBlock);
}

// Contact form: send through FormSubmit's AJAX endpoint so visitors stay on the page
const form = document.querySelector('.contact-form');
if (form) {
    const status = form.querySelector('.form-status');
    const button = form.querySelector('button[type="submit"]');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const original = button.innerHTML;
        button.disabled = true;
        button.innerHTML = 'Sending... <span class="arrow"><i class="fas fa-spinner fa-spin"></i></span>';
        status.textContent = '';
        status.className = 'form-status';

        try {
            const endpoint = form.action.replace('formsubmit.co/', 'formsubmit.co/ajax/');
            const response = await fetch(endpoint, {
                method: 'POST',
                headers: { 'Accept': 'application/json' },
                body: new FormData(form)
            });
            if (!response.ok) throw new Error('Request failed');
            form.reset();
            status.textContent = 'Thanks! Your message was sent. We will reply within 24 hours.';
            status.classList.add('ok');
        } catch (err) {
            status.textContent = 'Your message could not be sent. Please email us at bullet.itsolutions@gmail.com.';
            status.classList.add('err');
        } finally {
            button.disabled = false;
            button.innerHTML = original;
        }
    });
}

// Footer year
document.querySelectorAll('.year').forEach(el => { el.textContent = new Date().getFullYear(); });
