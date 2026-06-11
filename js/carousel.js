

function initCourseCarousel() {
    const courseCarousel = document.getElementById('course-carousel');
    const coursePrev = document.getElementById('course-prev');
    const courseNext = document.getElementById('course-next');

    if (!courseCarousel || !coursePrev || !courseNext) return;

    const updateArrowStates = () => {
        const isAtStart = courseCarousel.scrollLeft <= 5;
        const isAtEnd = courseCarousel.scrollLeft + courseCarousel.clientWidth >= courseCarousel.scrollWidth - 5;
        coursePrev.disabled = isAtStart;
        courseNext.disabled = isAtEnd;
    };

    const scrollBySet = (direction) => {
        const firstCard = courseCarousel.querySelector('.course-card');
        if (!firstCard) return;
        const cardWidth = firstCard.offsetWidth + 30; // Card width + gap
        courseCarousel.scrollBy({ left: direction * cardWidth * 2, behavior: 'smooth' });
    };

    coursePrev.addEventListener('click', () => scrollBySet(-1));
    courseNext.addEventListener('click', () => scrollBySet(1));
    
    courseCarousel.addEventListener('scroll', updateArrowStates);
    window.addEventListener('resize', updateArrowStates);
    
    // Initial check
    updateArrowStates();
}

function initScrollReveal() {
    const revealElements = document.querySelectorAll('.reveal');
    if (revealElements.length === 0) return;

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, { threshold: 0.1 });

    revealElements.forEach((el) => {
        revealObserver.observe(el);
        if (el.getBoundingClientRect().top < window.innerHeight * 0.95) {
            el.classList.add('active');
        }
    });
}

function initAll() {
    initCourseCarousel();
    initScrollReveal();
}

// Initialize on DOM ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAll);
} else {
    initAll();
}
