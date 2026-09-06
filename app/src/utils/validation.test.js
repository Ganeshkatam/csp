import test from 'node:test';
import assert from 'node:assert/strict';
import { isValidPhone, isValidEmail, isValidUrl, sanitizeText } from './validation.js';

test('isValidPhone validates emergency and full phone formats', () => {
    assert.strictEqual(isValidPhone('108'), true);
    assert.strictEqual(isValidPhone('1912'), true);
    assert.strictEqual(isValidPhone('9951871501'), true);
    assert.strictEqual(isValidPhone('08922-246100'), true);
    assert.strictEqual(isValidPhone('12'), false);
    assert.strictEqual(isValidPhone(''), false);
    assert.strictEqual(isValidPhone(null), false);
});

test('isValidEmail validates standard email format', () => {
    assert.strictEqual(isValidEmail('citizen@example.com'), true);
    assert.strictEqual(isValidEmail('test.user@ap.gov.in'), true);
    assert.strictEqual(isValidEmail('invalid-email'), false);
    assert.strictEqual(isValidEmail(''), false);
    assert.strictEqual(isValidEmail(null), false);
});

test('isValidUrl validates URLs safely', () => {
    assert.strictEqual(isValidUrl('https://vizianagaram.ap.gov.in'), true);
    assert.strictEqual(isValidUrl('http://localhost:5173'), true);
    assert.strictEqual(isValidUrl('not-a-url'), false);
    assert.strictEqual(isValidUrl(''), false);
    assert.strictEqual(isValidUrl(null), false);
});

test('sanitizeText trims string inputs and handles invalid types', () => {
    assert.strictEqual(sanitizeText('  Modavalasa  '), 'Modavalasa');
    assert.strictEqual(sanitizeText(123), '');
    assert.strictEqual(sanitizeText(null), '');
    assert.strictEqual(sanitizeText(undefined), '');
});
