import React, { useRef, useEffect } from 'react';

interface SectionProps {
    id: string;
    children: React.ReactNode;
    className?: string;
}

export const Section: React.FC<SectionProps> = ({ id, children, className }) => {
    const sectionRef = useRef<HTMLElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            },
            {
                root: null,
                rootMargin: '0px',
                threshold: 0.1
            }
        );

        const currentRef = sectionRef.current;
        if (currentRef) {
            observer.observe(currentRef);
        }

        return () => {
            if (currentRef) {
                observer.unobserve(currentRef);
            }
        };
    }, []);

    return (
        <section id={id} ref={sectionRef} className={className}>
            <div className="container">
                {children}
            </div>
        </section>
    );
};

