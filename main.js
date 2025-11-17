// Configuración inicial y utilidades
const utils = {
    // Throttle function para optimizar eventos de scroll
    throttle: (func, limit) => {
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
    },

    // Verificar si un elemento está en el viewport
    isInViewport: (element) => {
        const rect = element.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }
};

// Sistema de navegación suave
document.addEventListener('DOMContentLoaded', function() {
    // Navegación suave
    const navLinks = document.querySelectorAll('a[href^="#"]');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const offsetTop = targetElement.offsetTop - 80; // Ajustar por el header fijo
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Animación de timeline al hacer scroll
    const timelineItems = document.querySelectorAll('.timeline-item');
    
    const animateTimeline = utils.throttle(() => {
        timelineItems.forEach((item, index) => {
            if (utils.isInViewport(item)) {
                setTimeout(() => {
                    item.classList.add('animate');
                }, index * 200);
            }
        });
    }, 100);

    // Efectos de scroll para timeline
    window.addEventListener('scroll', animateTimeline);
    animateTimeline(); // Ejecutar una vez al cargar

    // Animación de cards al hacer scroll
    const cards = document.querySelectorAll('.card-hover');
    
    const animateCards = utils.throttle(() => {
        cards.forEach((card, index) => {
            if (utils.isInViewport(card) && !card.classList.contains('animated')) {
                setTimeout(() => {
                    anime({
                        targets: card,
                        opacity: [0, 1],
                        translateY: [30, 0],
                        duration: 800,
                        easing: 'easeOutQuart'
                    });
                    card.classList.add('animated');
                }, index * 100);
            }
        });
    }, 100);

    window.addEventListener('scroll', animateCards);
    
    // Animación inicial de elementos
    anime({
        targets: '.hero-content h1',
        opacity: [0, 1],
        translateY: [50, 0],
        duration: 1200,
        delay: 500,
        easing: 'easeOutQuart'
    });

    anime({
        targets: '.hero-content p',
        opacity: [0, 1],
        translateY: [30, 0],
        duration: 1000,
        delay: 800,
        easing: 'easeOutQuart'
    });

    anime({
        targets: '.hero-content .flex',
        opacity: [0, 1],
        translateY: [20, 0],
        duration: 800,
        delay: 1100,
        easing: 'easeOutQuart'
    });
});

// Sistema de partículas con p5.js
let particles = [];
let particleCount = 50;

function setup() {
    const canvas = document.getElementById('particleCanvas');
    if (canvas) {
        const p5Canvas = createCanvas(canvas.offsetWidth, canvas.offsetHeight);
        p5Canvas.parent('particleCanvas');
        
        // Inicializar partículas
        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }
    }
}

function draw() {
    clear();
    
    // Actualizar y dibujar partículas
    particles.forEach(particle => {
        particle.update();
        particle.display();
        particle.connect(particles);
    });
}

function windowResized() {
    const canvas = document.getElementById('particleCanvas');
    if (canvas) {
        resizeCanvas(canvas.offsetWidth, canvas.offsetHeight);
    }
}

class Particle {
    constructor() {
        this.x = random(width);
        this.y = random(height);
        this.vx = random(-0.5, 0.5);
        this.vy = random(-0.5, 0.5);
        this.size = random(2, 4);
        this.opacity = random(0.3, 0.8);
    }
    
    update() {
        this.x += this.vx;
        this.y += this.vy;
        
        // Rebotar en los bordes
        if (this.x < 0 || this.x > width) this.vx *= -1;
        if (this.y < 0 || this.y > height) this.vy *= -1;
        
        // Mantener dentro de los límites
        this.x = constrain(this.x, 0, width);
        this.y = constrain(this.y, 0, height);
    }
    
    display() {
        fill(255, 255, 255, this.opacity * 255);
        noStroke();
        ellipse(this.x, this.y, this.size);
    }
    
    connect(particles) {
        particles.forEach(other => {
            const distance = dist(this.x, this.y, other.x, other.y);
            if (distance < 100) {
                const alpha = map(distance, 0, 100, 0.3, 0);
                stroke(255, 255, 255, alpha * 255);
                strokeWeight(0.5);
                line(this.x, this.y, other.x, other.y);
            }
        });
    }
}

// Efectos de hover mejorados
document.addEventListener('DOMContentLoaded', function() {
    const publicationCards = document.querySelectorAll('.publication-card');
    
    publicationCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            anime({
                targets: this,
                scale: 1.02,
                duration: 300,
                easing: 'easeOutQuart'
            });
        });
        
        card.addEventListener('mouseleave', function() {
            anime({
                targets: this,
                scale: 1,
                duration: 300,
                easing: 'easeOutQuart'
            });
        });
    });

    // Efectos de hover para botones
    const buttons = document.querySelectorAll('a[class*="bg-"]');
    buttons.forEach(button => {
        button.addEventListener('mouseenter', function() {
            anime({
                targets: this,
                scale: 1.05,
                duration: 200,
                easing: 'easeOutQuart'
            });
        });
        
        button.addEventListener('mouseleave', function() {
            anime({
                targets: this,
                scale: 1,
                duration: 200,
                easing: 'easeOutQuart'
            });
        });
    });
});

// Sistema de filtros para publicaciones (para futuras páginas)
class PublicationFilter {
    constructor() {
        this.publications = [];
        this.currentFilter = 'all';
        this.init();
    }
    
    init() {
        // Inicializar datos de publicaciones
        this.loadPublications();
        this.setupFilters();
    }
    
    loadPublications() {
        // Datos de ejemplo - en producción vendrían de una API
        this.publications = [
            {
                id: 1,
                title: 'Ciencia ciudadana en el ámbito biomédico',
                year: 2025,
                type: 'article',
                tags: ['bibliometria', 'ciencia-ciudadana', 'biomedicina']
            },
            {
                id: 2,
                title: 'Retos para la democracia en el nuevo contexto de IA',
                year: 2023,
                type: 'article',
                tags: ['ia', 'democracia', 'ciudadania']
            }
            // Más publicaciones...
        ];
    }
    
    setupFilters() {
        const filterButtons = document.querySelectorAll('[data-filter]');
        filterButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const filter = e.target.dataset.filter;
                this.applyFilter(filter);
            });
        });
    }
    
    applyFilter(filter) {
        this.currentFilter = filter;
        const filteredPubs = this.publications.filter(pub => {
            if (filter === 'all') return true;
            return pub.type === filter || pub.tags.includes(filter);
        });
        
        this.renderPublications(filteredPubs);
    }
    
    renderPublications(publications) {
        const container = document.getElementById('publications-container');
        if (!container) return;
        
        // Animación de salida
        anime({
            targets: '.publication-card',
            opacity: 0,
            translateY: -20,
            duration: 300,
            complete: () => {
                // Actualizar contenido
                container.innerHTML = publications.map(pub => this.createPublicationCard(pub)).join('');
                
                // Animación de entrada
                anime({
                    targets: '.publication-card',
                    opacity: [0, 1],
                    translateY: [20, 0],
                    duration: 500,
                    delay: anime.stagger(100)
                });
            }
        });
    }
    
    createPublicationCard(pub) {
        return `
            <div class="publication-card rounded-2xl p-6 card-hover">
                <h3 class="font-display text-lg font-bold text-blue-900 mb-3">${pub.title}</h3>
                <p class="text-gray-600 text-sm">Año: ${pub.year}</p>
            </div>
        `;
    }
}

// Inicializar el filtro cuando se cargue la página de publicaciones
document.addEventListener('DOMContentLoaded', function() {
    if (document.getElementById('publications-container')) {
        new PublicationFilter();
    }
});

// Sistema de búsqueda
document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
        searchInput.addEventListener('input', utils.throttle(function(e) {
            const searchTerm = e.target.value.toLowerCase();
            const cards = document.querySelectorAll('.publication-card');
            
            cards.forEach(card => {
                const title = card.querySelector('h3').textContent.toLowerCase();
                const content = card.textContent.toLowerCase();
                
                if (title.includes(searchTerm) || content.includes(searchTerm)) {
                    card.style.display = 'block';
                    anime({
                        targets: card,
                        opacity: [0, 1],
                        duration: 300
                    });
                } else {
                    anime({
                        targets: card,
                        opacity: [1, 0],
                        duration: 300,
                        complete: () => {
                            card.style.display = 'none';
                        }
                    });
                }
            });
        }, 300));
    }
});

// Indicador de progreso de scroll
document.addEventListener('DOMContentLoaded', function() {
    const progressBar = document.createElement('div');
    progressBar.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 0%;
        height: 3px;
        background: linear-gradient(90deg, #1e3a8a, #f59e0b);
        z-index: 9999;
        transition: width 0.1s ease;
    `;
    document.body.appendChild(progressBar);
    
    const updateProgressBar = utils.throttle(() => {
        const scrollTop = window.pageYOffset;
        const docHeight = document.body.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;
        progressBar.style.width = scrollPercent + '%';
    }, 10);
    
    window.addEventListener('scroll', updateProgressBar);
});

// Animación de carga de página
window.addEventListener('load', function() {
    const loader = document.querySelector('.loader');
    if (loader) {
        anime({
            targets: loader,
            opacity: 0,
            duration: 500,
            complete: () => {
                loader.style.display = 'none';
            }
        });
    }
    
    // Animar elementos principales
    anime({
        targets: 'section',
        opacity: [0, 1],
        translateY: [30, 0],
        duration: 1000,
        delay: anime.stagger(200),
        easing: 'easeOutQuart'
    });
});

// Sistema de notificaciones
document.addEventListener('DOMContentLoaded', function() {
    // Mostrar notificación de bienvenida
    setTimeout(() => {
        showNotification('¡Bienvenido! Explora la investigación de Alejandro Fernández del Río.', 'info');
    }, 2000);
});

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `fixed top-20 right-4 p-4 rounded-lg shadow-lg z-50 max-w-sm ${
        type === 'info' ? 'bg-blue-600 text-white' : 
        type === 'success' ? 'bg-green-600 text-white' : 
        'bg-red-600 text-white'
    }`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    anime({
        targets: notification,
        translateX: [300, 0],
        opacity: [0, 1],
        duration: 500,
        easing: 'easeOutQuart'
    });
    
    setTimeout(() => {
        anime({
            targets: notification,
            translateX: [0, 300],
            opacity: [1, 0],
            duration: 500,
            easing: 'easeInQuart',
            complete: () => {
                document.body.removeChild(notification);
            }
        });
    }, 4000);
}

// Responsive menu toggle
document.addEventListener('DOMContentLoaded', function() {
    const mobileMenuButton = document.querySelector('.md\\:hidden button');
    const mobileMenu = document.querySelector('.mobile-menu');
    
    if (mobileMenuButton) {
        mobileMenuButton.addEventListener('click', function() {
            // Toggle mobile menu
            if (mobileMenu) {
                mobileMenu.classList.toggle('hidden');
            }
        });
    }
});

// Performance optimization
document.addEventListener('DOMContentLoaded', function() {
    // Lazy loading for images
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                observer.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
    
    // Preload critical resources
    const criticalResources = [
        'https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=Inter:wght@300;400;500;600&display=swap'
    ];
    
    criticalResources.forEach(resource => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.href = resource;
        link.as = 'style';
        document.head.appendChild(link);
    });
});

console.log('🚀 Página de Alejandro Fernández del Río cargada exitosamente');
console.log('📧 Contacto: alejandro.fernandez-rio@uv.es');
console.log('🏫 Universidad de Valencia - INN4ALL');