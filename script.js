document.addEventListener('DOMContentLoaded', () => {
    // Throttle fonksiyonu
    function throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        }
    }

    // Intersection Observer için options
    const options = {
        root: null,
        rootMargin: '0px',
        threshold: 0.5
    };

    // Bölümleri gözlemle ve active class'ını ekle/çıkar
    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                updateNavigation(entry.target.id);
            } else {
                entry.target.classList.remove('active');
            }
        });
    }, options);

    // Tüm section'ları gözleme al
    document.querySelectorAll('.section').forEach(section => {
        sectionObserver.observe(section);
    });

    // Yan navigasyonu güncelle
    function updateNavigation(currentSection) {
        document.querySelectorAll('.side-nav a').forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').slice(1) === currentSection) {
                link.classList.add('active');
            }
        });
    }

    // Yıldızlı arka plan efekti
    function createStars() {
        const starsContainer = document.createElement('div');
        starsContainer.style.position = 'fixed';
        starsContainer.style.top = '0';
        starsContainer.style.left = '0';
        starsContainer.style.width = '100%';
        starsContainer.style.height = '100%';
        starsContainer.style.pointerEvents = 'none';
        starsContainer.style.zIndex = '1';

        for (let i = 0; i < 200; i++) {
            const star = document.createElement('div');
            star.style.position = 'absolute';
            star.style.width = '2px';
            star.style.height = '2px';
            star.style.backgroundColor = '#fff';
            star.style.borderRadius = '50%';
            star.style.left = `${Math.random() * 100}%`;
            star.style.top = `${Math.random() * 100}%`;
            star.style.animation = `twinkle ${1 + Math.random() * 2}s infinite`;
            starsContainer.appendChild(star);
        }

        document.body.prepend(starsContainer);
    }

    createStars();

    // Paralaks efekti - optimize edilmiş versiyon
    document.addEventListener('scroll', throttle(() => {
        requestAnimationFrame(() => {
            const sections = document.querySelectorAll('.section');
            sections.forEach(section => {
                const distance = window.scrollY - section.offsetTop;
                const background = section.style.backgroundImage;
                if (background) {
                    section.style.backgroundPosition = `center ${distance * 0.5}px`;
                }
            });
        });
    }, 16));

    // Mobil cihazlar için dokunmatik kaydırma desteği
    let touchStartY = 0;
    let touchEndY = 0;

    document.addEventListener('touchstart', (e) => {
        touchStartY = e.touches[0].clientY;
    });

    document.addEventListener('touchend', (e) => {
        touchEndY = e.changedTouches[0].clientY;
        handleSwipe();
    });

    function handleSwipe() {
        const sections = document.querySelectorAll('.section');
        const currentSection = Array.from(sections).find(section => {
            const rect = section.getBoundingClientRect();
            return rect.top <= window.innerHeight / 2 && rect.bottom >= window.innerHeight / 2;
        });

        if (currentSection) {
            const currentIndex = Array.from(sections).indexOf(currentSection);
            if (touchEndY < touchStartY && currentIndex < sections.length - 1) {
                // Aşağı kaydırma
                sections[currentIndex + 1].scrollIntoView({ behavior: 'smooth' });
            } else if (touchEndY > touchStartY && currentIndex > 0) {
                // Yukarı kaydırma
                sections[currentIndex - 1].scrollIntoView({ behavior: 'smooth' });
            }
        }
    }
}); 