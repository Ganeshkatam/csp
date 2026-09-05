import React, { useState } from 'react';
import { Button } from '../../../components/ui/Button';
import { Select } from '../../../components/ui/Select';
import { feedbackService } from '../api/feedback';

export function FeedbackForm({ villageId, t }) {
    const [fbName, setFbName] = useState('');
    const [fbPhone, setFbPhone] = useState('');
    const [fbType, setFbType] = useState('Correction');
    const [fbMessage, setFbMessage] = useState('');
    const [fbStatus, setFbStatus] = useState(null); // 'submitting' | 'success' | 'error' | 'offline'

    async function handleSubmit(e) {
        e.preventDefault();
        setFbStatus('submitting');
        try {
            const result = await feedbackService.submitFeedback({
                village_id: villageId,
                name: fbName,
                phone: fbPhone,
                category: fbType,
                message: fbMessage
            });

            if (result.offline) {
                setFbStatus('offline');
            } else {
                setFbStatus('success');
            }
            setFbName('');
            setFbPhone('');
            setFbMessage('');
        } catch (err) {
            console.error('Feedback error:', err);
            setFbStatus('error');
        }
    }

    return (
        <div className="civic-card" style={{ padding: '1.75rem' }}>
            {fbStatus === 'success' && (
                <div className="alert alert-success" role="status">
                    {t?.feedbackSuccess || 'Thank you. Your feedback has been recorded successfully.'}
                </div>
            )}
            {fbStatus === 'offline' && (
                <div className="alert alert-info" role="status">
                    You appear to be offline. Your feedback has been saved locally and will synchronize when connection restores.
                </div>
            )}
            {fbStatus === 'error' && (
                <div className="alert alert-danger" role="alert">
                    {t?.feedbackError || 'Failed to submit feedback. Please try again.'}
                </div>
            )}

            <form onSubmit={handleSubmit}>
                <div className="choice-grid columns-2">
                    <div className="form-group">
                        <label className="form-label">{t?.yourName || 'Your Name (Optional)'}</label>
                        <input 
                            type="text" 
                            className="form-control" 
                            value={fbName}
                            onChange={(e) => setFbName(e.target.value)}
                            placeholder="Resident Name" 
                        />
                    </div>
                    <div className="form-group">
                        <label className="form-label">{t?.yourPhone || 'Phone Number (Optional)'}</label>
                        <input 
                            type="tel" 
                            className="form-control" 
                            value={fbPhone}
                            onChange={(e) => setFbPhone(e.target.value)}
                            placeholder="+91 98765 43210" 
                        />
                    </div>
                </div>

                <div className="form-group">
                    <Select
                        label={t?.feedbackCategory || 'Feedback Category'}
                        value={fbType}
                        onChange={setFbType}
                        options={[
                            { value: 'Correction', label: 'Phone Number / Information Correction' },
                            { value: 'New Listing Request', label: 'Request New Business / Artisan Listing' },
                            { value: 'Scheme Inquiry', label: 'Scheme Information Inquiry' },
                            { value: 'General', label: 'General Village Suggestion' }
                        ]}
                    />
                </div>

                <div className="form-group">
                    <label className="form-label">{t?.description || 'Details / Description *'}</label>
                    <textarea 
                        className="form-control" 
                        rows="4" 
                        value={fbMessage}
                        onChange={(e) => setFbMessage(e.target.value)}
                        placeholder="Please specify the business or facility name, updated phone number, or details..."
                        required
                    />
                </div>

                <Button 
                    type="submit" 
                    variant="primary" 
                    loading={fbStatus === 'submitting'}
                    style={{ minHeight: '44px' }}
                >
                    {t?.submitBtn || 'Submit Feedback & Information'}
                </Button>
            </form>
        </div>
    );
}

export default FeedbackForm;
