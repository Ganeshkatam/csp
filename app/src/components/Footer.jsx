import React from 'react';
import { I18N_DICT } from '../lib/i18n';

export default function Footer({ lang }) {
    const t = I18N_DICT[lang];

    return (
        <footer className="site-footer" role="contentinfo">
            <div className="container footer-inner">
                <div className="footer-top-row">
                    <div>
                        <div className="footer-brand">
                            {t.portalTitleEn} | {t.portalTitleRegional}
                        </div>
                        <p style={{ marginTop: '0.25rem' }}>{t.footerCopyright}</p>
                        <p style={{ color: '#64748b', marginTop: '0.25rem' }}>
                            In compliance with APSCHE Internship Guidelines (G.O. Ms. No. 46, HE Dept.)
                        </p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                        <div style={{ fontWeight: 600, color: '#ffffff' }}>24x7 Public Emergency Services</div>
                        <div style={{ color: '#94a3b8', fontSize: '0.75rem', marginTop: '0.25rem' }}>
                            Ambulance: 108 | Police: 100 | Health Helpline: 104
                        </div>
                    </div>
                </div>

                <div className="footer-bottom-row">
                    <div>
                        <span>{t.footerDisclaimer}</span>
                    </div>
                    <div>
                        <span>{t.footerDb}</span>
                    </div>
                </div>
            </div>
        </footer>
    );
}
