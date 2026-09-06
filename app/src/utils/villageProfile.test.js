import test from 'node:test';
import assert from 'node:assert/strict';
import {
    CENSUS_2011_BASELINE,
    ADMINISTRATIVE_JURISDICTION,
    CIVIC_INFRASTRUCTURE
} from '../features/village/data/villageProfile.js';

test('villageProfile reflects verified postal PIN 531162 and Chittivalasa S.O.', () => {
    assert.strictEqual(CENSUS_2011_BASELINE.pin, '531162');
    assert.strictEqual(CENSUS_2011_BASELINE.postalNetwork.pincode, '531162');
    assert.strictEqual(CENSUS_2011_BASELINE.postalNetwork.subPostOffice, 'Chittivalasa S.O.');
    assert.strictEqual(CENSUS_2011_BASELINE.postalNetwork.branchPostOffice, 'Modavalasa B.O.');
});

test('villageProfile reflects verified APEPDCL electricity infrastructure', () => {
    assert.ok(CIVIC_INFRASTRUCTURE.electricity.title.includes('APEPDCL'));
    assert.ok(CIVIC_INFRASTRUCTURE.electricity.desc.includes('1912'));
});

test('villageProfile administrative jurisdictions are properly set', () => {
    assert.strictEqual(ADMINISTRATIVE_JURISDICTION.gramPanchayat, 'Modavalasa');
    assert.strictEqual(ADMINISTRATIVE_JURISDICTION.mandal, 'Denkada');
    assert.strictEqual(ADMINISTRATIVE_JURISDICTION.district, 'Vizianagaram');
    assert.strictEqual(ADMINISTRATIVE_JURISDICTION.state, 'Andhra Pradesh');
});

test('villageProfile data adheres strictly to zero-emoji rule', () => {
    const emojiRegex = /[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/u;
    const jsonString = JSON.stringify({
        CENSUS_2011_BASELINE,
        ADMINISTRATIVE_JURISDICTION,
        CIVIC_INFRASTRUCTURE
    });
    assert.strictEqual(emojiRegex.test(jsonString), false, 'Village profile data contains emojis');
});
