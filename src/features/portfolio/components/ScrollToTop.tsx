import React from 'react';
import { useTranslation } from '@/features/i18n';
import { smoothScrollTo } from '@/shared/utils';
import { ArrowUpIcon } from '@/shared/components';
import { POSITION } from '@/shared/constants';

interface ScrollToTopProps {
  chatbotVisible: boolean;
  isVisible: boolean;
}

export const ScrollToTop: React.FC<ScrollToTopProps> = ({ chatbotVisible, isVisible }) => {
    const { t } = useTranslation();
    const bottom = chatbotVisible ? POSITION.SCROLL_TOP_WITH_CHATBOT : POSITION.SCROLL_TOP_DEFAULT;
    
    return (
        <button
            type="button"
            onClick={() => smoothScrollTo('home')}
            className={`scroll-to-top${isVisible ? ' visible' : ''}`}
            aria-label={String(t('general.scrollToTop'))}
            title={String(t('general.scrollToTop'))}
            style={{ bottom }}
        >
            <ArrowUpIcon />
        </button>
    );
};
