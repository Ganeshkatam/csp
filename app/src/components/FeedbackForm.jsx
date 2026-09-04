import React, { useState } from 'react';
import { supabase, DEFAULT_VILLAGE_ID } from '../lib/supabase';
import CustomSelect from './CustomSelect';

export default function FeedbackForm({ villageId, t }) {
    const [fbName, setFbName] = useState('');
    const [fbPhone, setFbPhone] = useState('');
    const [fbType, setFbType] = useState('Correction');
    const [fbMessage, setFbMessage] = useState('');
    const [fbStatus, setFbStatus] = useState(null); // 'submitting' | 'success' | 'error'

    async function handleSubmit(e) {
        e.preventDefault();
        setFbStatus('submitting');
        try {
            const { error } = await supabase.from('citizen_feedback').insert({
                village_id: villageId || DEFAULT_VILLAGE_ID,
                name: fbName.trim() || 'Anonymous Resident',
                phone: fbPhone.trim() || null,
                feedback_type: fbType,
                message: fbMessage.trim(),
                status: 'Pending'
            });
            if (error) throw error;
            setFbStatus('success');
            setFbName('');
            setFbPhone('');
            setFbMessage('');
        } catch (err) {
            console.error('Feedback submission error:', err);
            setFbStatus('error');
        }
    }

    return (
        <section className="section-block" id="sectionFeedback">
            <div className="section-head">
                <h2 className="section-title">{t.feedbackTitle}</h2>
                <p className="section-desc">{t.feedbackDesc}</p>
            </div>
            <div className="civic-card feedback-card">
                {fbStatus === 'success' && (
                    <div className="alert alert-success" role="status">
                        {t.feedbackSuccess}
                    </div>
                )}
                {fbStatus === 'error' && (
                    <div className="alert alert-danger" role="alert">
                        {t.feedbackError}
                    </div>
                )}
                <form onSubmit={handleSubmit}>
                    <div className="choice-grid columns-2">
                        <div className="form-group">
                            <label className="form-label">{t.yourName}</label>
                            <input 
                                type="text" 
                                className="form-control" 
                                value={fbName}
                                onChange={(e) => setFbName(e.target.value)}
                                placeholder="Resident Name" 
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label">{t.yourPhone}</label>
                            <input 
                                type="tel" 
                                className="form-control" 
                                value={fbPhone}
                                onChange={(e) => setFbPhone(e.target.value)}
                                placeholder="+91 98765 43210" 
                            />
                        </div>
                    </div>
                    <div className="choice-grid columns-2">
                        <div className="form-group feedback-category-group">
                            <label className="form-label">{t.feedbackCategory}</label>
                            <CustomSelect 
                                value={fbType}
                                onChange={setFbType}
                                options={[
                                    { value: 'Correction', label: 'Phone Number / Information Correction' },
                                    { value: 'New Listing Request', label: 'Request New Business / Artisan Listing' },
                                    { value: 'Scheme Inquiry', label: 'Scheme Information Inquiry' },
                                    { value: 'General', label: 'General Village Suggestion' }
                                ]}
                                minWidth="100%"
                                ariaLabel={t.feedbackCategory}
                            />
                        </div>
                    </div>
                    <div className="form-group">
                        <label className="form-label">{t.description}</label>
                        <textarea 
                            className="form-control" 
                            rows="4" 
                            value={fbMessage}
                            onChange={(e) => setFbMessage(e.target.value)}
                            placeholder="Please specify the business/institution name, correct contact number, or details..."
                            required
                        ></textarea>
                    </div>
                    <button 
                        type="submit" 
                        className="btn btn-primary"
                        disabled={fbStatus === 'submitting'}
                        style={{ minHeight: '48px', padding: '0.75rem 1.5rem' }}
                    >
                        {fbStatus === 'submitting' ? 'Submitting...' : t.submitBtn}
                    </button>
                </form>
            </div>
        </section>
    );
}
