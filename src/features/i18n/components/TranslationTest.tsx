import React, { useState, useEffect } from 'react';
import { useTranslation } from '../hooks/useTranslation';
import { validateAllTranslations, generateValidationReport } from '../utils/translationValidator';
import type { TranslationTestProps } from '../../../shared/types';

export const TranslationTest: React.FC<TranslationTestProps> = ({ showDebugInfo = false }) => {
  const { t, currentLanguage, baseLanguage, isRTL } = useTranslation();
  const [validationResult, setValidationResult] = useState<any>(null);
  const [showValidation, setShowValidation] = useState(false);

  // Test the specific keys mentioned in the user's issue
  const testKeys = [
    'about.title',
    'dynamicContent.professionalSummary',
    'dynamicContent.fullStackProficiency',
    'dynamicContent.problemSolving',
    'dynamicContent.modernFrameworks',
    'about.keyHighlightsTitle',
    'about.languagesTitle',
    'about.languages'
  ];

  useEffect(() => {
    if (showDebugInfo) {
      const result = validateAllTranslations();
      setValidationResult(result);
    }
  }, [showDebugInfo]);

  if (!showDebugInfo) return null;

  return (
    <div style={{ 
      position: 'fixed', 
      top: '10px', 
      right: '10px', 
      background: 'rgba(0,0,0,0.9)', 
      color: 'white', 
      padding: '20px', 
      borderRadius: '8px',
      maxWidth: '400px',
      fontSize: '12px',
      zIndex: 9999,
      fontFamily: 'monospace'
    }}>
      <h3 style={{ margin: '0 0 10px 0', color: '#4CAF50' }}>🌐 Translation Debug</h3>
      
      <div style={{ marginBottom: '10px' }}>
        <strong>Current Language:</strong> {currentLanguage}<br/>
        <strong>Base Language:</strong> {baseLanguage}<br/>
        <strong>RTL:</strong> {isRTL ? 'Yes' : 'No'}
      </div>

      <div style={{ marginBottom: '10px' }}>
        <strong>Test Keys:</strong>
        {testKeys.map(key => {
          const value = t(key);
          const isMissing = value === key;
          return (
            <div key={key} style={{ 
              margin: '2px 0', 
              color: isMissing ? '#ff6b6b' : '#4CAF50',
              fontSize: '11px'
            }}>
              <span style={{ color: '#888' }}>{key}:</span> {isMissing ? 'MISSING' : String(value)}
            </div>
          );
        })}
      </div>

      <div style={{ marginBottom: '10px' }}>
        <button 
          onClick={() => setShowValidation(!showValidation)}
          style={{
            background: '#2196F3',
            color: 'white',
            border: 'none',
            padding: '5px 10px',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '11px'
          }}
        >
          {showValidation ? 'Hide' : 'Show'} Validation Report
        </button>
      </div>

      {showValidation && validationResult && (
        <div style={{ 
          background: 'rgba(255,255,255,0.1)', 
          padding: '10px', 
          borderRadius: '4px',
          fontSize: '10px',
          maxHeight: '200px',
          overflow: 'auto'
        }}>
          <pre style={{ margin: 0, whiteSpace: 'pre-wrap' }}>
            {generateValidationReport(validationResult)}
          </pre>
        </div>
      )}
    </div>
  );
};

export { TranslationTest as default };
