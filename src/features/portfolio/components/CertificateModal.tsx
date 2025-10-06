import React, { useRef, useState, useEffect, useCallback } from 'react';
import { useTranslation, CertificateItem } from '@/features/i18n';
import { useAnnouncer } from '@/shared/hooks';
import { ANIMATION_DURATION } from '@/shared/constants';

interface CertificateModalProps {
    cert: CertificateItem | null;
    onClose: () => void;
}

export const CertificateModal: React.FC<CertificateModalProps> = ({ cert, onClose }) => {
    const { t } = useTranslation();
    const modalOverlayRef = useRef<HTMLDivElement>(null);
    const modalContentRef = useRef<HTMLDivElement>(null);
    const closeButtonRef = useRef<HTMLButtonElement>(null);
    const { announce } = useAnnouncer();
    const [isVisible, setIsVisible] = useState(false);
    const [imageLoaded, setImageLoaded] = useState(false);

    // Handle modal close with animation
    const handleClose = useCallback(() => {
        setIsVisible(false);
        setImageLoaded(false);
        // Wait for animation to complete before calling onClose
        setTimeout(() => {
            onClose();
        }, ANIMATION_DURATION.MODAL_CLOSE);
    }, [onClose]);

    // Keyboard event handler
    useEffect(() => {
        if (!cert) return;

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                handleClose();
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [cert, handleClose]);

    // Focus trap implementation
    useEffect(() => {
        if (!cert || !modalContentRef.current) return;

        const focusableElements = modalContentRef.current.querySelectorAll<HTMLElement>(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        const handleTabKey = (e: KeyboardEvent) => {
            if (e.key !== 'Tab') return;

            if (e.shiftKey) {
                if (document.activeElement === firstElement) {
                    e.preventDefault();
                    lastElement?.focus();
                }
            } else {
                if (document.activeElement === lastElement) {
                    e.preventDefault();
                    firstElement?.focus();
                }
            }
        };

        document.addEventListener('keydown', handleTabKey);
        return () => document.removeEventListener('keydown', handleTabKey);
    }, [cert]);

    // Body scroll lock and initial focus
    useEffect(() => {
        if (cert) {
            // Lock body scroll
            const scrollBarWidth = window.innerWidth - document.documentElement.clientWidth;
            document.body.style.overflow = 'hidden';
            document.body.style.paddingRight = `${scrollBarWidth}px`;
            
            // Trigger animation
            requestAnimationFrame(() => {
                setIsVisible(true);
            });

            // Focus close button after animation
            setTimeout(() => {
                closeButtonRef.current?.focus();
            }, ANIMATION_DURATION.MODAL_FOCUS_DELAY);

            // Announce to screen readers
            announce(t('general.viewCertificate') + ': ' + cert.title, 'polite');
        } else {
            // Restore body scroll
            document.body.style.overflow = '';
            document.body.style.paddingRight = '';
        }

        return () => {
            document.body.style.overflow = '';
            document.body.style.paddingRight = '';
        };
    }, [cert, announce, t]);

    if (!cert) return null;

    return (
        <div
            ref={modalOverlayRef}
            className={`modal-overlay ${isVisible ? 'modal-visible' : ''}`}
            onClick={handleClose}
            role="dialog"
            aria-modal="true"
            aria-labelledby="cert-modal-title"
            aria-describedby="cert-modal-description"
        >
            <div 
                ref={modalContentRef}
                className={`modal-content ${isVisible ? 'modal-content-visible' : ''}`}
                onClick={e => e.stopPropagation()}
            >
                <button 
                    ref={closeButtonRef}
                    onClick={handleClose} 
                    className="modal-close-btn" 
                    aria-label={String(t('general.closeModal'))}
                    type="button"
                >
                    <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        viewBox="0 0 24 24" 
                        fill="none" 
                        stroke="currentColor" 
                        strokeWidth="2"
                        width="24"
                        height="24"
                        aria-hidden="true"
                    >
                        <line x1="18" y1="6" x2="6" y2="18" />
                        <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                </button>
                
                <div className="modal-image-container">
                    {!imageLoaded && (
                        <div className="modal-image-loading" aria-live="polite" aria-busy="true">
                            <div className="spinner"></div>
                        </div>
                    )}
                    <img 
                        src={cert.imageUrl} 
                        alt={cert.title}
                        className={`modal-image ${imageLoaded ? 'modal-image-loaded' : ''}`}
                        onLoad={() => setImageLoaded(true)}
                        onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"%3E%3Crect fill="%23333" width="200" height="200"/%3E%3Ctext fill="%23fff" x="50%25" y="50%25" text-anchor="middle" dominant-baseline="middle"%3EImage Error%3C/text%3E%3C/svg%3E';
                            setImageLoaded(true);
                        }}
                    />
                </div>
                
                <div className="modal-info">
                    <h3 id="cert-modal-title" className="modal-title">{cert.title}</h3>
                    <p id="cert-modal-description" className="modal-description">
                        <span className="modal-issuer">{cert.issuer}</span>
                        <span className="modal-separator" aria-hidden="true"> • </span>
                        <span className="modal-date">{cert.date}</span>
                    </p>
                </div>
            </div>
        </div>
    );
};
