import React from 'react';
import { ShieldCheck, MapPin, Building, Landmark } from 'lucide-react';
import { getLocalized } from '../../../i18n';

export function VillageSpotlight({ village, lang }) {
    if (!village || !village.name) return null;

    return (
        <div className="civic-card" style={{ background: '#ffffff', border: '1px solid var(--color-border)', marginBottom: '1.5rem' }}>
            <div className="card-header-row">
                <span className="badge badge-civic">
                    <Landmark size={13} style={{ marginRight: '4px' }} />
                    Community Habitation Profile
                </span>
                <span className="badge badge-verified">
                    <ShieldCheck size={12} style={{ marginRight: '3px' }} /> Verified
                </span>
            </div>

            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--color-slate-950)', margin: '0.25rem 0' }}>
                {getLocalized(village, 'name', lang)} Habitation Overview
            </h2>

            {village.gram_panchayat && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.875rem', color: 'var(--color-slate-500)', marginBottom: '0.75rem', flexWrap: 'wrap' }}>
                    <MapPin size={14} style={{ color: 'var(--color-blue-600)' }} />
                    <span>{village.gram_panchayat} Gram Panchayat</span>
                    <span>•</span>
                    <span>{village.mandal} Mandal</span>
                    <span>•</span>
                    <span>{village.district} District</span>
                    <span>•</span>
                    <span>{village.state || 'Andhra Pradesh'}</span>
                </div>
            )}

            <p style={{ fontSize: '0.9375rem', color: 'var(--color-slate-700)', lineHeight: '1.65', margin: '0.5rem 0 1.25rem' }}>
                {getLocalized(village, 'description', lang)}
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '0.75rem', background: 'var(--color-slate-50)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-slate-200)' }}>
                <div>
                    <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--color-slate-500)', textTransform: 'uppercase' }}>Gram Panchayat</div>
                    <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-slate-900)' }}>{village.gram_panchayat || '--'}</div>
                </div>
                <div>
                    <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--color-slate-500)', textTransform: 'uppercase' }}>Mandal</div>
                    <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-slate-900)' }}>{village.mandal || '--'}</div>
                </div>
                <div>
                    <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--color-slate-500)', textTransform: 'uppercase' }}>District</div>
                    <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-slate-900)' }}>{village.district || '--'}</div>
                </div>
                <div>
                    <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--color-slate-500)', textTransform: 'uppercase' }}>State</div>
                    <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-slate-900)' }}>{village.state || 'Andhra Pradesh'}</div>
                </div>
            </div>

            <div className="card-verify-tag" style={{ marginTop: '1rem' }}>
                <span>Source: {village.source || 'CSP Field Survey'}</span>
                <span>Verified: {village.verified_on || 'Current'}</span>
            </div>
        </div>
    );
}

export default VillageSpotlight;
