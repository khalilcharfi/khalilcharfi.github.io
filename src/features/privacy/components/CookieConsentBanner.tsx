import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import type { CookieConsentBannerProps } from '../../../shared/types';

export const CookieConsentBanner: React.FC<CookieConsentBannerProps> = () => {
  const { t } = useTranslation();

  useEffect(() => {
    // Dynamically import to avoid SSR issues
    Promise.all([
      import('vanilla-cookieconsent'),
      import('vanilla-cookieconsent/dist/cookieconsent.css')
    ]).then(([{ default: CookieConsent }]) => {
      CookieConsent.run({
        guiOptions: {
          consentModal: {
            layout: 'cloud',
            position: 'bottom center',
            transition: 'slide',
          },
          preferencesModal: {
            layout: 'box',
            position: 'right',
            transition: 'slide'
          }
        },
        categories: {
          necessary: {
            enabled: true,
            readOnly: true
          },
          analytics: {
            enabled: false,
            readOnly: false
          }
        },
        services: ['google-analytics'],
        language: {
          default: 'en',
          translations: {
            en: {
              consentModal: {
                title: t('cookieConsent.title'),
                description: t('cookieConsent.description'),
                acceptAllBtn: t('cookieConsent.acceptAllBtn'),
                acceptNecessaryBtn: t('cookieConsent.acceptNecessaryBtn'),
                showPreferencesBtn: t('cookieConsent.showPreferencesBtn'),
                closeIconLabel: t('cookieConsent.closeIconLabel')
              },
              preferencesModal: {
                title: t('cookieConsent.preferencesTitle'),
                acceptAllBtn: t('cookieConsent.acceptAllBtn'),
                acceptNecessaryBtn: t('cookieConsent.acceptNecessaryBtn'),
                savePreferencesBtn: t('cookieConsent.savePreferencesBtn'),
                closeIconLabel: t('cookieConsent.closeIconLabel'),
                sections: [
                  {
                    title: t('cookieConsent.cookieUsageTitle'),
                    description: t('cookieConsent.cookieUsageDescription')
                  },
                  {
                    title: t('cookieConsent.necessaryCookiesTitle'),
                    description: t('cookieConsent.necessaryCookiesDescription')
                  },
                  {
                    title: t('cookieConsent.analyticsCookiesTitle'),
                    description: t('cookieConsent.analyticsCookiesDescription')
                  }
                ]
              }
            }
          }
        },
        onAccept: function (cookie: any) {
          if (cookie.categories.includes('analytics')) {
            window.dispatchEvent(new Event('cookieconsent-analytics-granted'));
          } else {
            window.dispatchEvent(new Event('cookieconsent-analytics-denied'));
          }
        }
      });
    });
  }, [t]);

  return null;
};

export { CookieConsentBanner as default }; 