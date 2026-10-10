// Mobile Menu Toggle
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('active');
});

document.querySelectorAll('.nav-links li a').forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navLinks.classList.remove('active');
    });
});

// Navbar background on scroll
const header = document.querySelector('.header');
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

// Scroll Reveal Animations
const revealElements = document.querySelectorAll('.fade-in, .slide-in-left, .slide-in-right, .zoom-in');

const revealCallback = (entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            // Remove observer after animation
            if(!entry.target.classList.contains('counter')) {
                observer.unobserve(entry.target);
            }
        }
    });
};

const revealObserver = new IntersectionObserver(revealCallback, {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px"
});

revealElements.forEach(el => revealObserver.observe(el));

// Number Counter Animation for Stats
const counters = document.querySelectorAll('.counter');
let animated = false;

const startCounters = (entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && !animated) {
            animated = true;
            counters.forEach(counter => {
                const target = +counter.getAttribute('data-target');
                const duration = 2000; // ms
                const increment = target / (duration / 16); // 60fps
                
                let current = 0;
                const updateCounter = () => {
                    current += increment;
                    if (current < target) {
                        counter.innerText = Math.ceil(current);
                        requestAnimationFrame(updateCounter);
                    } else {
                        counter.innerText = target;
                    }
                };
                updateCounter();
            });
        }
    });
};

const statsSection = document.querySelector('.stats-section');
if(statsSection) {
    const statsObserver = new IntersectionObserver(startCounters, { threshold: 0.5 });
    statsObserver.observe(statsSection);
}

// Form submission handler
const form = document.querySelector('.contact-form');
if(form) {
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const btn = form.querySelector('button');
        const originalText = btn.innerHTML;
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        
        setTimeout(() => {
            btn.innerHTML = 'Sent Successfully <i class="fas fa-check"></i>';
            btn.style.backgroundColor = '#10b981'; // Success green
            form.reset();
            
            setTimeout(() => {
                btn.innerHTML = originalText;
                btn.style.backgroundColor = '';
            }, 3000);
        }, 1500);
    });
}

// Custom Nebula and Speed Bullets Animation
const canvas = document.getElementById('hero-canvas');
if(canvas) {
    const ctx = canvas.getContext('2d');
    
    let width, height;
    
    function resize() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resize);
    resize();
    
    // Nebula properties
    let time = 0;
    
    // Speed Bullets (Shower triggered by Logo click)
    let bullets = [];
    class Bullet {
        constructor() {
            this.x = -200 - Math.random() * 800; // Start off-screen left
            this.y = Math.random() * height;
            this.length = 80 + Math.random() * 150;
            this.speed = 40 + Math.random() * 60; // Extremely fast
            this.thickness = 2 + Math.random() * 4;
            this.opacity = 0.6 + Math.random() * 0.4;
            this.active = true;
        }
        update() {
            if(!this.active) return;
            this.x += this.speed;
            if(this.x - this.length > width) {
                this.active = false; // Deactivate when off-screen
            }
        }
        draw() {
            if(!this.active) return;
            // Draw the bullet head (bright white-cyan center)
            ctx.beginPath();
            ctx.ellipse(this.x, this.y, this.thickness * 3, this.thickness * 1.2, 0, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity + 0.2})`;
            ctx.fill();
            
            // Draw the fading trail behind the bullet
            ctx.beginPath();
            ctx.moveTo(this.x, this.y - this.thickness);
            ctx.lineTo(this.x - this.length, this.y);
            ctx.lineTo(this.x, this.y + this.thickness);
            ctx.closePath();
            
            // Gradient for tail
            const grad = ctx.createLinearGradient(this.x, this.y, this.x - this.length, this.y);
            grad.addColorStop(0, `rgba(0, 220, 255, ${this.opacity})`);
            grad.addColorStop(1, `rgba(0, 162, 199, 0)`);
            
            ctx.fillStyle = grad;
            ctx.fill();
            
            // Glowing aura
            ctx.shadowBlur = 20;
            ctx.shadowColor = '#00a2c7';
            ctx.fill();
            ctx.shadowBlur = 0;
        }
    }
    
    // Trigger bullet shower on logo click
    const logos = document.querySelectorAll('.logo, .about-logo, .footer-logo');
    logos.forEach(logo => {
        logo.style.cursor = 'pointer';
        logo.addEventListener('click', (e) => {
            if(e.currentTarget.tagName === 'A') e.preventDefault();
            
            // Create a massive shower of 100 bullets
            for(let i=0; i<100; i++) {
                bullets.push(new Bullet());
            }
            
            // Clean up inactive bullets array to keep memory usage low
            bullets = bullets.filter(b => b.active);
        });
    });
    
    // Nebula Architecture (Network Nodes)
    const nodes = [];
    class Node {
        constructor() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.vx = (Math.random() - 0.5) * 0.8;
            this.vy = (Math.random() - 0.5) * 0.8;
            this.radius = Math.random() * 2 + 1;
        }
        update() {
            this.x += this.vx;
            this.y += this.vy;
            
            // Bounce off edges
            if(this.x < 0 || this.x > width) this.vx *= -1;
            if(this.y < 0 || this.y > height) this.vy *= -1;
        }
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(0, 162, 199, 0.6)';
            ctx.fill();
        }
    }
    
    for(let i=0; i<70; i++) {
        nodes.push(new Node());
    }
    
    function drawArchitecture() {
        nodes.forEach(node => {
            node.update();
            node.draw();
        });
        
        // Draw connecting lines
        for(let i=0; i<nodes.length; i++) {
            for(let j=i+1; j<nodes.length; j++) {
                const dx = nodes[i].x - nodes[j].x;
                const dy = nodes[i].y - nodes[j].y;
                const dist = Math.sqrt(dx*dx + dy*dy);
                
                if(dist < 150) {
                    ctx.beginPath();
                    ctx.moveTo(nodes[i].x, nodes[i].y);
                    ctx.lineTo(nodes[j].x, nodes[j].y);
                    ctx.strokeStyle = `rgba(0, 162, 199, ${0.3 - (dist/150)*0.3})`;
                    ctx.lineWidth = 1;
                    ctx.stroke();
                }
            }
        }
    }
    
    function drawNebula() {
        // Create a moving gradient background for nebula effect
        const cx = width / 2 + Math.sin(time * 0.0005) * (width * 0.3);
        const cy = height / 2 + Math.cos(time * 0.0007) * (height * 0.3);
        
        const gradient = ctx.createRadialGradient(cx, cy, 0, width/2, height/2, Math.max(width, height) * 0.8);
        gradient.addColorStop(0, 'rgba(0, 120, 160, 0.15)');
        gradient.addColorStop(0.4, 'rgba(0, 60, 90, 0.08)');
        gradient.addColorStop(1, 'rgba(10, 10, 10, 0)');
        
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, width, height);
    }
    
    function animate() {
        // Dark background with slight transparency for motion trails
        ctx.fillStyle = 'rgba(10, 10, 10, 0.4)';
        ctx.fillRect(0, 0, width, height);
        
        drawNebula();
        drawArchitecture();
        
        bullets.forEach(bullet => {
            bullet.update();
            bullet.draw();
        });
        
        time += 16;
        requestAnimationFrame(animate);
    }
    
    animate();
}
