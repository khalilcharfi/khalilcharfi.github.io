import React, { useState, useEffect } from 'react';
import { useConsent } from '../context/ConsentContext';
import { useTranslation } from '../hooks/useTranslation';

export const PrivacySettings: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [activeTab, setActiveTab] = useState<'consent' | 'data'>('consent');
    const [dataSize, setDataSize] = useState(0);
    const [showClearConfirm, setShowClearConfirm] = useState(false);
    const [showExportSuccess, setShowExportSuccess] = useState(false);
    
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

    useEffect(() => {
        if (isOpen) {
            setDataSize(getStoredDataSize());
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

    const handleExportData = () => {
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
    };

    const handleClearData = () => {
        clearAllData();
        setDataSize(0);
        setShowClearConfirm(false);
    };

    if (!isOpen) {
        return (
            <button 
                className="privacy-settings-trigger"
                onClick={() => setIsOpen(true)}
                aria-label={String(t('privacy.openSettings'))}
                title={String(t('privacy.openSettings'))}
            >
                <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="2"
                    width="20"
                    height="20"
                >
                    <path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
                    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9c.26.604.852.997 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1Z" />
                </svg>
            </button>
        );
    }

    return (
        <div className="privacy-settings-overlay" onClick={() => setIsOpen(false)}>
            <div className="privacy-settings-modal" onClick={(e) => e.stopPropagation()}>
                {/* Header */}
                <div className="privacy-settings-header">
                    <h2>{String(t('privacy.title'))}</h2>
                    <button 
                        className="privacy-settings-close"
                        onClick={() => setIsOpen(false)}
                        aria-label={String(t('common.close'))}
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
                <div className="privacy-settings-tabs">
                    <button
                        className={`privacy-tab ${activeTab === 'consent' ? 'active' : ''}`}
                        onClick={() => setActiveTab('consent')}
                    >
                        {String(t('privacy.consentTab'))}
                    </button>
                    <button
                        className={`privacy-tab ${activeTab === 'data' ? 'active' : ''}`}
                        onClick={() => setActiveTab('data')}
                    >
                        {String(t('privacy.dataTab'))}
                    </button>
                </div>

                {/* Content */}
                <div className="privacy-settings-content">
                    {activeTab === 'consent' && (
                        <div className="privacy-consent-panel">
                            <p className="privacy-intro">{String(t('privacy.consentIntro'))}</p>

                            {/* Quick Actions */}
                            <div className="privacy-quick-actions">
                                <button
                                    className="privacy-btn privacy-btn-accept"
                                    onClick={() => updateAllConsent(true)}
                                    disabled={respectedDNT}
                                >
                                    {String(t('privacy.acceptAll'))}
                                </button>
                                <button
                                    className="privacy-btn privacy-btn-reject"
                                    onClick={() => updateAllConsent(false)}
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
                        <div className="privacy-data-panel">
                            <p className="privacy-intro">{String(t('privacy.dataIntro'))}</p>

                            {/* Data Size Info */}
                            <div className="privacy-data-info">
                                <div className="privacy-data-stat">
                                    <svg 
                                        xmlns="http://www.w3.org/2000/svg" 
                                        viewBox="0 0 24 24" 
                                        fill="none" 
                                        stroke="currentColor" 
                                        strokeWidth="2"
                                        width="24"
                                        height="24"
                                    >
                                        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                                        <path d="M12 2v20M3.5 7l8.5 5 8.5-5" />
                                    </svg>
                                    <div>
                                        <strong>{formatBytes(dataSize)}</strong>
                                        <p>{String(t('privacy.storedData'))}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Data Actions */}
                            <div className="privacy-data-actions">
                                <div className="privacy-action-card">
                                    <div className="privacy-action-icon">
                                        <svg 
                                            xmlns="http://www.w3.org/2000/svg" 
                                            viewBox="0 0 24 24" 
                                            fill="none" 
                                            stroke="currentColor" 
                                            strokeWidth="2"
                                            width="32"
                                            height="32"
                                        >
                                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" />
                                        </svg>
                                    </div>
                                    <h3>{String(t('privacy.exportData'))}</h3>
                                    <p>{String(t('privacy.exportDescription'))}</p>
                                    <button
                                        className="privacy-btn privacy-btn-secondary"
                                        onClick={handleExportData}
                                    >
                                        {String(t('privacy.exportButton'))}
                                    </button>
                                    {showExportSuccess && (
                                        <div className="privacy-success-message">
                                            ✓ {String(t('privacy.exportSuccess'))}
                                        </div>
                                    )}
                                </div>

                                <div className="privacy-action-card privacy-danger-card">
                                    <div className="privacy-action-icon">
                                        <svg 
                                            xmlns="http://www.w3.org/2000/svg" 
                                            viewBox="0 0 24 24" 
                                            fill="none" 
                                            stroke="currentColor" 
                                            strokeWidth="2"
                                            width="32"
                                            height="32"
                                        >
                                            <path d="M3 6h18M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                                            <path d="M10 11v6M14 11v6" />
                                        </svg>
                                    </div>
                                    <h3>{String(t('privacy.clearData'))}</h3>
                                    <p>{String(t('privacy.clearDescription'))}</p>
                                    
                                    {!showClearConfirm ? (
                                        <button
                                            className="privacy-btn privacy-btn-danger"
                                            onClick={() => setShowClearConfirm(true)}
                                        >
                                            {String(t('privacy.clearButton'))}
                                        </button>
                                    ) : (
                                        <div className="privacy-confirm-actions">
                                            <p className="privacy-warning-text">
                                                {String(t('privacy.clearWarning'))}
                                            </p>
                                            <div className="privacy-confirm-buttons">
                                                <button
                                                    className="privacy-btn privacy-btn-danger"
                                                    onClick={handleClearData}
                                                >
                                                    {String(t('privacy.confirmClear'))}
                                                </button>
                                                <button
                                                    className="privacy-btn privacy-btn-secondary"
                                                    onClick={() => setShowClearConfirm(false)}
                                                >
                                                    {String(t('common.cancel'))}
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PrivacySettings;

