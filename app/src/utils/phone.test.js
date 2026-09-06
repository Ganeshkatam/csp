import test from 'node:test';
import assert from 'node:assert/strict';
import { formatPhoneDisplay, createTelLink } from './phone.js';

test('formatPhoneDisplay formats 10-digit mobile numbers', () => {
    assert.strictEqual(formatPhoneDisplay('9951871501'), '99518-71501');
    assert.strictEqual(formatPhoneDisplay('9876543210'), '98765-43210');
});

test('formatPhoneDisplay leaves emergency short codes intact', () => {
    assert.strictEqual(formatPhoneDisplay('108'), '108');
    assert.strictEqual(formatPhoneDisplay('104'), '104');
    assert.strictEqual(formatPhoneDisplay('100'), '100');
    assert.strictEqual(formatPhoneDisplay('1912'), '1912');
});

test('formatPhoneDisplay formats 11-digit landline with 08922 prefix', () => {
    assert.strictEqual(formatPhoneDisplay('08922246100'), '08922-246100');
});

test('formatPhoneDisplay handles empty and null inputs', () => {
    assert.strictEqual(formatPhoneDisplay(''), '');
    assert.strictEqual(formatPhoneDisplay(null), '');
    assert.strictEqual(formatPhoneDisplay(undefined), '');
});

test('createTelLink formats telephone protocol links cleanly', () => {
    assert.strictEqual(createTelLink('9951871501'), 'tel:9951871501');
    assert.strictEqual(createTelLink('108'), 'tel:108');
    assert.strictEqual(createTelLink('1912'), 'tel:1912');
    assert.strictEqual(createTelLink(''), '#');
    assert.strictEqual(createTelLink(null), '#');
});
