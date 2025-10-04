import React, { useState, useEffect, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { useConsent } from '../context/ConsentContext';
import { useTranslation } from '../hooks/useTranslation';

export const PrivacySettings: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [activeTab, setActiveTab] = useState<'consent' | 'data'>('consent');
    const [dataSize, setDataSize] = useState(0);
    const [showClearConfirm, setShowClearConfirm] = useState(false);
    const [showExportSuccess, setShowExportSuccess] = useState(false);
    const [isLoadingData, setIsLoadingData] = useState(false);
    const [exportError, setExportError] = useState<string | null>(null);
    const [clearError, setClearError] = useState<string | null>(null);
    
    const triggerButtonRef = useRef<HTMLButtonElement>(null);
    const modalRef = useRef<HTMLDivElement>(null);
    const firstFocusableRef = useRef<HTMLButtonElement>(null);
    const lastFocusableRef = useRef<HTMLButtonElement>(null);
    
    const { 
        consent, 
        privacySettings,
        updateConsent, 
        updateAllConsent, 
        clearAllData, 
        exportData, 
        getStoredDataSize,
        respectedDNT
    } = useConsent();
    
    const { t } = useTranslation();

    // Calculate data size when modal opens
    useEffect(() => {
        if (isOpen) {
            setIsLoadingData(true);
            // Use requestIdleCallback for better performance
            const calculateSize = () => {
                try {
                    setDataSize(getStoredDataSize());
                } catch (error) {
                    console.error('Error calculating data size:', error);
                    setDataSize(0);
                } finally {
                    setIsLoadingData(false);
                }
            };
            
            if ('requestIdleCallback' in window) {
                requestIdleCallback(calculateSize);
            } else {
                setTimeout(calculateSize, 0);
            }
        }
    }, [isOpen, getStoredDataSize]);

    const formatBytes = (chars: number) => {
        const bytes = chars * 2; // Approximate UTF-16 bytes
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
    };

    // ESC key handler and body scroll lock
    useEffect(() => {
        if (!isOpen) return;

        // Lock body scroll
        const originalOverflow = document.body.style.overflow;
        const originalPaddingRight = document.body.style.paddingRight;
        const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
        
        document.body.style.overflow = 'hidden';
        document.body.style.paddingRight = `${scrollbarWidth}px`;

        // Handle ESC key
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                closeModal();
            }
        };

        document.addEventListener('keydown', handleEsc);

        return () => {
            document.body.style.overflow = originalOverflow;
            document.body.style.paddingRight = originalPaddingRight;
            document.removeEventListener('keydown', handleEsc);
        };
    }, [isOpen]);

    // Focus trap
    useEffect(() => {
        if (!isOpen || !modalRef.current) return;

        const modal = modalRef.current;
        const focusableElements = modal.querySelectorAll<HTMLElement>(
            'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
        );

        const firstFocusable = focusableElements[0];
        const lastFocusable = focusableElements[focusableElements.length - 1];

        // Focus first element
        firstFocusable?.focus();

        const handleTab = (e: KeyboardEvent) => {
            if (e.key !== 'Tab') return;

            if (e.shiftKey) {
                if (document.activeElement === firstFocusable) {
                    e.preventDefault();
                    lastFocusable?.focus();
                }
            } else {
                if (document.activeElement === lastFocusable) {
                    e.preventDefault();
                    firstFocusable?.focus();
                }
            }
        };

        modal.addEventListener('keydown', handleTab as any);

        return () => {
            modal.removeEventListener('keydown', handleTab as any);
        };
    }, [isOpen, activeTab]); // Re-run when tab changes to update focusable elements

    const openModal = useCallback(() => {
        setIsOpen(true);
        setExportError(null);
        setClearError(null);
    }, []);

    const closeModal = useCallback(() => {
        setIsOpen(false);
        setShowClearConfirm(false);
        setShowExportSuccess(false);
        setExportError(null);
        setClearError(null);
        // Return focus to trigger button
        setTimeout(() => {
            triggerButtonRef.current?.focus();
        }, 100);
    }, []);

    const handleExportData = useCallback(() => {
        try {
            setExportError(null);
            const data = exportData();
            const blob = new Blob([data], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `privacy-data-export-${new Date().toISOString().split('T')[0]}.json`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            
            setShowExportSuccess(true);
            setTimeout(() => setShowExportSuccess(false), 3000);
        } catch (error) {
            console.error('Export error:', error);
            setExportError('Failed to export data. Please try again.');
            setTimeout(() => setExportError(null), 5000);
        }
    }, [exportData]);

    const handleClearData = useCallback(() => {
        try {
            setClearError(null);
            clearAllData();
            setDataSize(0);
            setShowClearConfirm(false);
        } catch (error) {
            console.error('Clear data error:', error);
            setClearError('Failed to clear data. Please try again.');
            setTimeout(() => setClearError(null), 5000);
        }
    }, [clearAllData]);

    const modalContent = isOpen ? (
        <div 
            className="privacy-settings-overlay" 
            onClick={closeModal}
            role="presentation"
        >
            <div 
                ref={modalRef}
                className="privacy-settings-modal" 
                onClick={(e) => e.stopPropagation()}
                role="dialog"
                aria-modal="true"
                aria-labelledby="privacy-modal-title"
                aria-describedby="privacy-modal-description"
            >
                {/* Header */}
                <div className="privacy-settings-header">
                    <h2 id="privacy-modal-title">{String(t('privacy.title'))}</h2>
                    <button 
                        ref={firstFocusableRef}
                        className="privacy-settings-close"
                        onClick={closeModal}
                        aria-label={String(t('common.close'))}
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
                        >
                            <path d="M18 6 6 18M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* DNT Banner */}
                {respectedDNT && (
                    <div className="privacy-dnt-banner">
                        <svg 
                            xmlns="http://www.w3.org/2000/svg" 
                            viewBox="0 0 24 24" 
                            fill="none" 
                            stroke="currentColor" 
                            strokeWidth="2"
                            width="20"
                            height="20"
                        >
                            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                        </svg>
                        <div>
                            <strong>{String(t('privacy.dntActive'))}</strong>
                            <p>{String(t('privacy.dntDescription'))}</p>
                        </div>
                    </div>
                )}

                {/* Tabs */}
                <div className="privacy-settings-tabs" role="tablist" aria-label="Privacy settings sections">
                    <button
                        className={`privacy-tab ${activeTab === 'consent' ? 'active' : ''}`}
                        onClick={() => setActiveTab('consent')}
                        role="tab"
                        aria-selected={activeTab === 'consent'}
                        aria-controls="consent-panel"
                        id="consent-tab"
                        type="button"
                    >
                        <span>{String(t('privacy.consentTab'))}</span>
                    </button>
                    <button
                        className={`privacy-tab ${activeTab === 'data' ? 'active' : ''}`}
                        onClick={() => setActiveTab('data')}
                        role="tab"
                        aria-selected={activeTab === 'data'}
                        aria-controls="data-panel"
                        id="data-tab"
                        type="button"
                    >
                        <span>{String(t('privacy.dataTab'))}</span>
                    </button>
                </div>

                {/* Content */}
                <div className="privacy-settings-content">
                    {activeTab === 'consent' && (
                        <div 
                            className="privacy-consent-panel"
                            role="tabpanel"
                            id="consent-panel"
                            aria-labelledby="consent-tab"
                        >
                            <p id="privacy-modal-description" className="privacy-intro">{String(t('privacy.consentIntro'))}</p>

                            {/* Quick Actions */}
                            <div className="privacy-quick-actions">
                                <button
                                    className="privacy-btn privacy-btn-accept"
                                    onClick={() => updateAllConsent(true)}
                                    disabled={respectedDNT}
                                    type="button"
                                    aria-label="Accept all privacy categories"
                                >
                                    {String(t('privacy.acceptAll'))}
                                </button>
                                <button
                                    className="privacy-btn privacy-btn-reject"
                                    onClick={() => updateAllConsent(false)}
                                    type="button"
                                    aria-label="Reject all optional privacy categories"
                                >
                                    {String(t('privacy.rejectAll'))}
                                </button>
                            </div>

                            {/* Individual Consent Controls */}
                            <div className="privacy-consent-items">
                                {/* Necessary */}
                                <div className="privacy-consent-item">
                                    <div className="privacy-consent-header">
                                        <div>
                                            <h3>{String(t('privacy.necessary.title'))}</h3>
                                            <p>{String(t('privacy.necessary.description'))}</p>
                                        </div>
                                        <div className="privacy-toggle disabled">
                                            <input
                                                type="checkbox"
                                                checked={consent.necessary}
                                                disabled
                                                readOnly
                                            />
                                            <span className="privacy-toggle-slider"></span>
                                        </div>
                                    </div>
                                </div>

                                {/* Analytics */}
                                <div className="privacy-consent-item">
                                    <div className="privacy-consent-header">
                                        <div>
                                            <h3>{String(t('privacy.analytics.title'))}</h3>
                                            <p>{String(t('privacy.analytics.description'))}</p>
                                        </div>
                                        <div className={`privacy-toggle ${respectedDNT ? 'disabled' : ''}`}>
                                            <input
                                                type="checkbox"
                                                checked={consent.analytics}
                                                onChange={(e) => updateConsent('analytics', e.target.checked)}
                                                disabled={respectedDNT}
                                            />
                                            <span className="privacy-toggle-slider"></span>
                                        </div>
                                    </div>
                                </div>

                                {/* Functional */}
                                <div className="privacy-consent-item">
                                    <div className="privacy-consent-header">
                                        <div>
                                            <h3>{String(t('privacy.functional.title'))}</h3>
                                            <p>{String(t('privacy.functional.description'))}</p>
                                        </div>
                                        <div className={`privacy-toggle ${respectedDNT ? 'disabled' : ''}`}>
                                            <input
                                                type="checkbox"
                                                checked={consent.functional}
                                                onChange={(e) => updateConsent('functional', e.target.checked)}
                                                disabled={respectedDNT}
                                            />
                                            <span className="privacy-toggle-slider"></span>
                                        </div>
                                    </div>
                                </div>

                                {/* Personalization */}
                                <div className="privacy-consent-item">
                                    <div className="privacy-consent-header">
                                        <div>
                                            <h3>{String(t('privacy.personalization.title'))}</h3>
                                            <p>{String(t('privacy.personalization.description'))}</p>
                                        </div>
                                        <div className={`privacy-toggle ${respectedDNT ? 'disabled' : ''}`}>
                                            <input
                                                type="checkbox"
                                                checked={consent.personalization}
                                                onChange={(e) => updateConsent('personalization', e.target.checked)}
                                                disabled={respectedDNT}
                                            />
                                            <span className="privacy-toggle-slider"></span>
                                        </div>
                                    </div>
                                </div>

                                {/* Marketing */}
                                <div className="privacy-consent-item">
                                    <div className="privacy-consent-header">
                                        <div>
                                            <h3>{String(t('privacy.marketing.title'))}</h3>
                                            <p>{String(t('privacy.marketing.description'))}</p>
                                        </div>
                                        <div className={`privacy-toggle ${respectedDNT ? 'disabled' : ''}`}>
                                            <input
                                                type="checkbox"
                                                checked={consent.marketing}
                                                onChange={(e) => updateConsent('marketing', e.target.checked)}
                                                disabled={respectedDNT}
                                            />
                                            <span className="privacy-toggle-slider"></span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="privacy-footer-text">
                                <p>
                                    {String(t('privacy.lastUpdated'))}: {new Date(privacySettings.lastUpdated).toLocaleDateString()}
                                </p>
                            </div>
                        </div>
                    )}

                    {activeTab === 'data' && (
                        <div 
                            className="privacy-data-panel"
                            role="tabpanel"
                            id="data-panel"
                            aria-labelledby="data-tab"
                        >
                            <p className="privacy-intro">{String(t('privacy.dataIntro'))}</p>

                            {/* Data Size Info - Compact */}
                            <div className="privacy-data-info" role="status" aria-live="polite">
                                <strong aria-label={`Data size: ${formatBytes(dataSize)}`}>
                                    {isLoadingData ? 'Calculating...' : formatBytes(dataSize)}
                                </strong>
                                <span>{String(t('privacy.storedData'))}</span>
                            </div>

                            {/* Data Actions - Compact */}
                            <div className="privacy-data-actions">
                                <div className="privacy-action-card">
                                    <h3>{String(t('privacy.exportData'))}</h3>
                                    <button
                                        className="privacy-btn privacy-btn-secondary"
                                        onClick={handleExportData}
                                        type="button"
                                        aria-label="Export all stored privacy data as JSON file"
                                    >
                                        {String(t('privacy.exportButton'))}
                                    </button>
                                    {showExportSuccess && (
                                        <div className="privacy-success-message" role="status" aria-live="polite">
                                            ✓ {String(t('privacy.exportSuccess'))}
                                        </div>
                                    )}
                                    {exportError && (
                                        <div className="privacy-error-message" role="alert" aria-live="assertive">
                                            ⚠️ {exportError}
                                        </div>
                                    )}
                                </div>

                                <div className="privacy-action-card privacy-danger-card">
                                    <h3>{String(t('privacy.clearData'))}</h3>
                                    
                                    {!showClearConfirm ? (
                                        <button
                                            className="privacy-btn privacy-btn-danger"
                                            onClick={() => setShowClearConfirm(true)}
                                            type="button"
                                            aria-label="Delete all stored privacy data"
                                        >
                                            {String(t('privacy.clearButton'))}
                                        </button>
                                    ) : (
                                        <div className="privacy-confirm-actions" role="alert">
                                            <p className="privacy-warning-text">
                                                {String(t('privacy.clearWarning'))}
                                            </p>
                                            <div className="privacy-confirm-buttons">
                                                <button
                                                    className="privacy-btn privacy-btn-danger"
                                                    onClick={handleClearData}
                                                    type="button"
                                                    aria-label="Confirm deletion of all data"
                                                >
                                                    {String(t('privacy.confirmClear'))}
                                                </button>
                                                <button
                                                    ref={lastFocusableRef}
                                                    className="privacy-btn privacy-btn-secondary"
                                                    onClick={() => setShowClearConfirm(false)}
                                                    type="button"
                                                    aria-label="Cancel data deletion"
                                                >
                                                    {String(t('common.cancel'))}
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                    {clearError && (
                                        <div className="privacy-error-message" role="alert" aria-live="assertive">
                                            ⚠️ {clearError}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="privacy-settings-footer">
                    <p className="privacy-footer-text">
                        {String(t('privacy.footerText', 'Your privacy matters. All data is stored locally.'))}
                    </p>
                </div>
            </div>
        </div>
    ) : null;

    return (
        <>
            <button 
                ref={triggerButtonRef}
                className="privacy-settings-trigger"
                onClick={openModal}
                aria-label={String(t('privacy.openSettings'))}
                title={String(t('privacy.openSettings'))}
                aria-haspopup="dialog"
            >
                <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="2"
                    width="20"
                    height="20"
                    aria-hidden="true"
                >
                    <path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
                    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9c.26.604.852.997 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1Z" />
                </svg>
                <span className="privacy-settings-label">{String(t('privacy.settings'))}</span>
            </button>
            {typeof document !== 'undefined' && createPortal(modalContent, document.body)}
        </>
    );
};

export default PrivacySettings;

