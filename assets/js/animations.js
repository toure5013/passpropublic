// Initialize GSAP
gsap.registerPlugin(ScrollTrigger);

// Page Transition
const pageTransition = document.querySelector('#page-transition');
gsap.to(pageTransition, {
    duration: 0.5,
    x: '100%',
    ease: 'power2.inOut'
});

// Hero Animations
gsap.from('.animate-title', {
    duration: 1,
    y: 50,
    opacity: 0,
    delay: 0.5,
    ease: 'power3.out'
});

gsap.from('.animate-subtitle', {
    duration: 1,
    y: 30,
    opacity: 0,
    delay: 0.7,
    ease: 'power3.out'
});

gsap.from('.animate-search', {
    duration: 1,
    y: 30,
    opacity: 0,
    delay: 0.9,
    ease: 'power3.out'
});

// Categories Slider
const categoriesSlider = new Swiper('.categories-slider', {
    slidesPerView: 'auto',
    spaceBetween: 16,
    freeMode: true,
    grabCursor: true,
    resistance: true,
    resistanceRatio: 0.5,
    touchRatio: 1.5
});

// Featured Event Animation
gsap.to('.featured-event', {
    scrollTrigger: {
        trigger: '.featured-event',
        start: 'top bottom-=100',
        toggleActions: 'play none none reverse'
    },
    duration: 1,
    opacity: 1,
    y: 0,
    ease: 'power3.out'
});

// Event Cards Stagger Animation
gsap.to('.event-card', {
    scrollTrigger: {
        trigger: '.event-card',
        start: 'top bottom-=50',
        toggleActions: 'play none none reverse'
    },
    duration: 0.8,
    opacity: 1,
    y: 0,
    stagger: 0.2,
    ease: 'power3.out'
});

// Hover Animations
document.querySelectorAll('.event-card').forEach(card => {
    card.addEventListener('mouseenter', () => {
        gsap.to(card.querySelector('img'), {
            duration: 0.3,
            scale: 1.05,
            ease: 'power2.out'
        });
    });

    card.addEventListener('mouseleave', () => {
        gsap.to(card.querySelector('img'), {
            duration: 0.3,
            scale: 1,
            ease: 'power2.out'
        });
    });
});