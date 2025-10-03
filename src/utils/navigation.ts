// Enhanced smooth scroll with proper offset positioning and title targeting
export const smoothScrollTo = (id: string) => {
    const element = document.getElementById(id);
    if (!element) return;

    if (id === 'home') {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
        return;
    }

    const navbarHeight = 90; 
    const additionalOffset = 20; 
    const totalOffset = navbarHeight + additionalOffset;
    
    const sectionTitle = element.querySelector('.section-title, h1, h2, h3');
    const targetElement = sectionTitle || element;
    
    const elementPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
    const offsetPosition = elementPosition - totalOffset;
    
    const finalPosition = Math.max(0, offsetPosition);
    
    window.scrollTo({
        top: finalPosition,
        behavior: 'smooth'
    });
    
    if (!('scrollBehavior' in document.documentElement.style)) {
        const startPosition = window.pageYOffset;
        const distance = finalPosition - startPosition;
        const duration = 800; 
        let start: number | null = null;
        
        const step = (timestamp: number) => {
            if (!start) start = timestamp;
            const progress = timestamp - start;
            const percentage = Math.min(progress / duration, 1);
            
            const easeOut = 1 - Math.pow(1 - percentage, 3);
            window.scrollTo(0, startPosition + distance * easeOut);
            
            if (progress < duration) {
                window.requestAnimationFrame(step);
            }
        };
        
        window.requestAnimationFrame(step);
    }
};

