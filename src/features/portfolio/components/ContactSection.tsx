import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from '@/features/i18n';
import { useDynamicContent, useSectionTracking } from '@/features/visitor-personalization';
import { Section, LinkedinIcon, GithubIcon, XingIcon } from '@/shared/components';
import { FORM_LIMITS, ANIMATION_DURATION } from '@/shared/constants';

export const ContactSection: React.FC = React.memo(() => {
    const { t } = useTranslation();
    const { personalizedContent } = useDynamicContent();
    const sectionTracking = useSectionTracking('contact');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [errors, setErrors] = useState<{ name?: string; email?: string; message?: string }>({});
    const [touched, setTouched] = useState<{ name?: boolean; email?: boolean; message?: boolean }>({});
    const [submissionStatus, setSubmissionStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
    const nameInputRef = useRef<HTMLInputElement>(null);
    const emailInputRef = useRef<HTMLInputElement>(null);
    const messageInputRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        sectionTracking.trackSectionView();
    }, []);

    // Enhanced email validation with RFC 5322 simplified regex
    const validateEmail = (email: string): boolean => {
        const emailRegex = /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
        return emailRegex.test(email);
    };

    // Validation helper functions
    const validateName = (value: string): string | undefined => {
        if (!value.trim()) return String(t('contact.form.requiredError'));
        if (value.trim().length < FORM_LIMITS.NAME_MIN) return String(t('contact.form.nameTooShort'));
        if (value.trim().length > FORM_LIMITS.NAME_MAX) return String(t('contact.form.nameTooLong'));
        return undefined;
    };

    const validateEmailField = (value: string): string | undefined => {
        if (!value.trim()) return String(t('contact.form.requiredError'));
        if (!validateEmail(value.trim())) return String(t('contact.form.emailError'));
        return undefined;
    };

    const validateMessage = (value: string): string | undefined => {
        if (!value.trim()) return String(t('contact.form.requiredError'));
        if (value.trim().length < FORM_LIMITS.MESSAGE_MIN) return String(t('contact.form.messageTooShort'));
        if (value.trim().length > FORM_LIMITS.MESSAGE_MAX) return String(t('contact.form.messageTooLong'));
        return undefined;
    };

    const validateField = (fieldName: 'name' | 'email' | 'message', value: string): string | undefined => {
        switch (fieldName) {
            case 'name': return validateName(value);
            case 'email': return validateEmailField(value);
            case 'message': return validateMessage(value);
            default: return undefined;
        }
    };

    const validateForm = (): boolean => {
        const newErrors: { name?: string; email?: string; message?: string } = {};

        const nameError = validateField('name', name);
        const emailError = validateField('email', email);
        const messageError = validateField('message', message);

        if (nameError) newErrors.name = nameError;
        if (emailError) newErrors.email = emailError;
        if (messageError) newErrors.message = messageError;

        setErrors(newErrors);
        setTouched({ name: true, email: true, message: true });

        // Focus first field with error
        if (nameError && nameInputRef.current) {
            nameInputRef.current.focus();
        } else if (emailError && emailInputRef.current) {
            emailInputRef.current.focus();
        } else if (messageError && messageInputRef.current) {
            messageInputRef.current.focus();
        }

        return Object.keys(newErrors).length === 0;
    };

    const handleBlur = (fieldName: 'name' | 'email' | 'message', value: string) => {
        setTouched(prev => ({ ...prev, [fieldName]: true }));
        const error = validateField(fieldName, value);
        setErrors(prev => ({ ...prev, [fieldName]: error }));
    };

    const handleResetForm = () => {
        setName('');
        setEmail('');
        setMessage('');
        setErrors({});
        setTouched({});
        setSubmissionStatus('idle');
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (validateForm()) {
            setSubmissionStatus('submitting');
            setTimeout(() => {
                setSubmissionStatus('success');
            }, ANIMATION_DURATION.MOCK_API_DELAY); // Mock API call
        }
    };
    
    if (submissionStatus === 'success') {
        return (
            <Section id="contact">
                 <div className="contact-content">
                    <h2 className="section-title animate-in">{personalizedContent.contact.title}</h2>
                    <div className="contact-form-success glass-panel animate-in">
                        <h3>{String(t('contact.form.successTitle'))}</h3>
                        <p>{String(t('contact.form.successMessage'))}</p>
                        <button onClick={handleResetForm} className="btn">{String(t('contact.form.sendAnother'))}</button>
                    </div>
                </div>
            </Section>
        );
    }

    return (
        <Section id="contact">
            <div className="contact-content">
                 <h2 className="section-title animate-in">{String(personalizedContent.contact.title)}</h2>
                 <p className="contact-intro animate-in">{String(personalizedContent.contact.message)}</p>
                <form onSubmit={handleSubmit} className="contact-form glass-panel animate-in" noValidate>
                     <div className="form-grid">
                        <div className="form-group">
                            <label htmlFor="name">{String(t('contact.form.nameLabel'))}</label>
                            <input
                                ref={nameInputRef}
                                type="text"
                                id="name"
                                name="name"
                                value={name}
                                onChange={e => {
                                    setName(e.target.value);
                                    if (touched.name) {
                                        const error = validateField('name', e.target.value);
                                        setErrors(prev => ({ ...prev, name: error }));
                                    }
                                }}
                                onBlur={() => handleBlur('name', name)}
                                required
                                maxLength={FORM_LIMITS.NAME_MAX}
                                className={errors.name && touched.name ? 'invalid' : ''}
                                aria-invalid={!!(errors.name && touched.name)}
                                aria-describedby={errors.name && touched.name ? 'name-error' : undefined}
                                autoComplete="name"
                            />
                            {errors.name && touched.name && (
                                <p id="name-error" className="error-message" role="alert">
                                    {errors.name}
                                </p>
                            )}
                        </div>
                        <div className="form-group">
                            <label htmlFor="email">{String(t('contact.form.emailLabel'))}</label>
                            <input
                                ref={emailInputRef}
                                type="email"
                                id="email"
                                name="email"
                                value={email}
                                onChange={e => {
                                    setEmail(e.target.value);
                                    if (touched.email) {
                                        const error = validateField('email', e.target.value);
                                        setErrors(prev => ({ ...prev, email: error }));
                                    }
                                }}
                                onBlur={() => handleBlur('email', email)}
                                className={errors.email && touched.email ? 'invalid' : ''}
                                aria-invalid={!!(errors.email && touched.email)}
                                aria-describedby={errors.email && touched.email ? 'email-error' : undefined}
                                required
                                autoComplete="email"
                            />
                            {errors.email && touched.email && (
                                <p id="email-error" className="error-message" role="alert">
                                    {errors.email}
                                </p>
                            )}
                        </div>
                    </div>
                    <div className="form-group full-width">
                        <label htmlFor="message">{String(t('contact.form.messageLabel'))}</label>
                        <textarea
                            ref={messageInputRef}
                            id="message"
                            name="message"
                            rows={5}
                            value={message}
                            onChange={e => {
                                setMessage(e.target.value);
                                if (touched.message) {
                                    const error = validateField('message', e.target.value);
                                    setErrors(prev => ({ ...prev, message: error }));
                                }
                            }}
                            onBlur={() => handleBlur('message', message)}
                            required
                            maxLength={FORM_LIMITS.MESSAGE_MAX}
                            className={errors.message && touched.message ? 'invalid' : ''}
                            aria-invalid={!!(errors.message && touched.message)}
                            aria-describedby={errors.message && touched.message ? 'message-error' : undefined}
                        ></textarea>
                        {errors.message && touched.message && (
                            <p id="message-error" className="error-message" role="alert">
                                {errors.message}
                            </p>
                        )}
                        <small className="character-count" aria-live="polite">
                            {message.length}/{FORM_LIMITS.MESSAGE_MAX}
                        </small>
                    </div>
                    <button type="submit" className="btn" disabled={submissionStatus === 'submitting'}>
                        {submissionStatus === 'submitting' ? String(t('contact.form.submitting')) : String(t('contact.form.sendBtn'))}
                    </button>
                </form>
                <div className="social-links animate-in">
                    <h3>{String(t('contact.connectTitle'))}</h3>
                    <a href="https://www.linkedin.com/in/khalil-charfi/" aria-label={String(t('contact.linkedinAria'))} target="_blank" rel="noopener noreferrer"><LinkedinIcon /></a>
                    <a href="https://github.com/khalil-charfi" aria-label={String(t('contact.githubAria'))} target="_blank" rel="noopener noreferrer"><GithubIcon /></a>
                    <a href="https://www.xing.com/profile/Khalil_Charfi2" aria-label="Khalil Charfi's Xing Profile" target="_blank" rel="noopener noreferrer"><XingIcon /></a>
                </div>
            </div>
        </Section>
    );
});
