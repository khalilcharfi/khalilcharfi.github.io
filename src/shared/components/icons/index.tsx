import React from 'react';

// SVG Icons
export const SunIcon: React.FC = React.memo(() => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
      <path d="M12 2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM7.5 12a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM18.894 6.106a.75.75 0 00-1.06-1.06l-1.591 1.59a.75.75 0 101.06 1.061l1.591-1.59zM21.75 12a.75.75 0 01-.75.75h-2.25a.75.75 0 010-1.5h2.25a.75.75 0 01.75.75zM17.836 17.894a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 10-1.061 1.06l1.59 1.591zM12 18.75a.75.75 0 01.75.75V21a.75.75 0 01-1.5 0v-1.5a.75.75 0 01.75-.75zM5.106 17.894a.75.75 0 001.061 1.06l1.591-1.59a.75.75 0 00-1.06-1.061l-1.591 1.59zM3 12a.75.75 0 01-.75.75H.75a.75.75 0 010-1.5h2.25A.75.75 0 013 12zM6.106 5.106a.75.75 0 00-1.06 1.06l1.59 1.591a.75.75 0 001.061-1.06l-1.59-1.591z" />
    </svg>
));
SunIcon.displayName = 'SunIcon';

export const MoonIcon: React.FC = React.memo(() => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
      <path fillRule="evenodd" d="M9.528 1.718a.75.75 0 01.162.819A8.97 8.97 0 009 6a9 9 0 009 9 8.97 8.97 0 003.463-.69.75.75 0 01.981.98 10.503 10.503 0 01-9.694 6.46c-5.799 0-10.5-4.7-10.5-10.5 0-3.51 1.713-6.638 4.383-8.528a.75.75 0 01.818.162z" clipRule="evenodd" />
    </svg>
));
MoonIcon.displayName = 'MoonIcon';

export const ArrowUpIcon: React.FC = React.memo(() => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="28" height="28">
        <path d="M12 6c-.28 0-.53.11-.71.29l-6 6a1 1 0 101.42 1.42L12 8.41l5.29 5.3a1 1 0 001.42-1.42l-6-6A1 1 0 0012 6z" />
    </svg>
));
ArrowUpIcon.displayName = 'ArrowUpIcon';

export const UserIcon: React.FC = React.memo(() => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="80" height="80">
        <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z" clipRule="evenodd" />
    </svg>
));
UserIcon.displayName = 'UserIcon';

export const AwardIcon: React.FC = React.memo(() => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="80" height="80">
        <path fillRule="evenodd" d="M12.963 2.286a.75.75 0 00-1.071 1.052A6.75 6.75 0 0115.75 12c0 2.593-1.47 4.88-3.642 6.002a.75.75 0 00.723 1.348A8.25 8.25 0 0017.25 12c0-3.41-2.078-6.388-5.037-7.662a.75.75 0 00-.25-.052zM4.75 12A8.25 8.25 0 0112 3.75a.75.75 0 010 1.5A6.75 6.75 0 005.25 12a6.75 6.75 0 006.75 6.75.75.75 0 010 1.5A8.25 8.25 0 014.75 12z" clipRule="evenodd" />
    </svg>
));
AwardIcon.displayName = 'AwardIcon';

export const GithubIcon: React.FC = React.memo(() => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 16 16"
        fill="currentColor"
        aria-hidden="true"
        focusable="false"
    >
        <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"></path>
    </svg>
));
GithubIcon.displayName = 'GithubIcon';

export const ExternalLinkIcon: React.FC = React.memo(() => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
        <path d="M10.75 8.75a.75.75 0 000 1.5h1.5a.75.75 0 000-1.5h-1.5z"></path>
        <path fillRule="evenodd" d="M3.501 4.5A2.999 2.999 0 016.5 1.5h11A2.999 2.999 0 0120.5 4.5v11a3 3 0 01-3 3h-11a3 3 0 01-3-3v-11zm1.5 0a1.5 1.5 0 011.5-1.5h11a1.5 1.5 0 011.5 1.5v11a1.5 1.5 0 01-1.5-1.5h-11a1.5 1.5 0 01-1.5-1.5v-11z" clipRule="evenodd"></path>
    </svg>
));
ExternalLinkIcon.displayName = 'ExternalLinkIcon';

export const LinkedinIcon: React.FC = React.memo(() => (
    <svg
        viewBox="0 0 24 24"
        fill="currentColor"
        aria-hidden="true"
        focusable="false"
    >
        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"></path>
    </svg>
));
LinkedinIcon.displayName = 'LinkedinIcon';

export const MailIcon: React.FC = React.memo(() => (
    <svg
        viewBox="0 0 24 24"
        fill="currentColor"
        aria-hidden="true"
        focusable="false"
    >
        <path d="M0 3v18h24v-18h-24zm6.623 7.929l-4.623 5.712v-9.458l4.623 3.746zm-4.141-5.929h19.035l-9.517 7.713-9.518-7.713zm5.694 7.188l3.824 3.099 3.83-3.104 5.068 6.787h-17.779l5.057-6.782zm.225-1.352l-5.648-4.616v9.319l5.648-4.703z"></path>
    </svg>
));
MailIcon.displayName = 'MailIcon';

export const AiChatIcon: React.FC = React.memo(() => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="28" height="28">
      <path d="M11.25 3.375c0-.622.503-1.125 1.125-1.125h.375c.622 0 1.125.503 1.125 1.125v.375c0 .622-.503 1.125-1.125 1.125h-.375a1.125 1.125 0 01-1.125-1.125V3.375z" />
      <path d="M9.375 5.25c0-.622.503-1.125 1.125-1.125h.375c.622 0 1.125.503 1.125 1.125v.375c0 .622-.503 1.125-1.125 1.125h-.375A1.125 1.125 0 019.375 5.625V5.25z" />
      <path d="M6 5.625c0-.622.503-1.125 1.125-1.125h.375c.622 0 1.125.503 1.125 1.125v.375c0 .622-.503 1.125-1.125 1.125H7.125A1.125 1.125 0 016 5.625V5.625z" />
      <path d="M15.375 5.25c0-.622.503-1.125 1.125-1.125h.375c.622 0 1.125.503 1.125 1.125v.375c0 .622-.503 1.125-1.125 1.125h-.375a1.125 1.125 0 01-1.125-1.125V5.25z" />
      <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm11.125-3.625a.75.75 0 00-1.5 0v2.69l-1.656-.83a.75.75 0 00-.658 1.338l2.5 1.25a.75.75 0 00.658 0l2.5-1.25a.75.75 0 00-.658-1.338l-1.656.83V8.375z" clipRule="evenodd" />
    </svg>
));
AiChatIcon.displayName = 'AiChatIcon';

export const SendIcon: React.FC = React.memo(() => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
      <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
    </svg>
));
SendIcon.displayName = 'SendIcon';

