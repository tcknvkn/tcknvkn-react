/**
 * TCKNVKN React birim testleri.
 * Oluşturulma tarihi: 2026-04-24
 * Lisans: MIT
 * Web sitesi: https://www.tcknvkn.com/kutuphaneler/react
 */

import test from 'node:test';
import assert from 'node:assert/strict';
import {
  validateMultipleTckn,
  validateMultipleVkn,
  validateTckn,
  validateVkn,
  useTckn,
  useVkn
} from '../src/index';

test('validateTckn geçerli değerde valid döner', () => {
  const result = validateTckn('10000000146');
  assert.equal(result.valid, true);
  assert.deepEqual(result.errors, []);
});

test('validateTckn normalize edilmiş değeri döner', () => {
  const result = validateTckn('100 000 001-46');
  assert.equal(result.valid, true);
  assert.equal(result.value, '10000000146');
});

test('validateTckn uzunluk hatasını yakalar', () => {
  const result = validateTckn('123');
  assert.equal(result.valid, false);
  assert.ok(result.errors.includes('11 haneli olmalıdır.'));
});

test('validateTckn ilk hane 0 olamaz kuralını uygular', () => {
  const result = validateTckn('01234567890');
  assert.equal(result.valid, false);
  assert.ok(result.errors.includes('İlk hane 0 olamaz.'));
});

test('validateTckn checksum hatalarını yakalar', () => {
  const result10 = validateTckn('10000000156');
  const result11 = validateTckn('10000000145');

  assert.equal(result10.valid, false);
  assert.ok(result10.errors.includes('10. hane kontrolü geçersiz.'));
  assert.equal(result11.valid, false);
  assert.ok(result11.errors.includes('11. hane kontrolü geçersiz.'));
});

test('validateTckn tüm haneler aynı olduğunda hata döner', () => {
  const result = validateTckn('11111111111');
  assert.equal(result.valid, false);
  assert.ok(result.errors.includes('Tüm haneler aynı olamaz.'));
});

test('validateVkn geçerli değerde valid döner', () => {
  const result = validateVkn('1000036109');
  assert.equal(result.valid, true);
  assert.deepEqual(result.errors, []);
});

test('validateVkn normalize edilmiş değeri döner', () => {
  const result = validateVkn('100-003-6109');
  assert.equal(result.valid, true);
  assert.equal(result.value, '1000036109');
});

test('validateVkn uzunluk hatasını yakalar', () => {
  const result = validateVkn('12345');
  assert.equal(result.valid, false);
  assert.ok(result.errors.includes('10 haneli olmalıdır.'));
});

test('validateVkn checksum hatasını yakalar', () => {
  const result = validateVkn('1000036108');
  assert.equal(result.valid, false);
  assert.ok(result.errors.includes('Son hane kontrolü geçersiz.'));
});

test('validateVkn tüm haneler aynı olduğunda hata döner', () => {
  const result = validateVkn('1111111111');
  assert.equal(result.valid, false);
  assert.ok(result.errors.includes('Tüm haneler aynı olamaz.'));
});

test('validateMultipleTckn sırayı korur', () => {
  const result = validateMultipleTckn(['10000000146', '10000000145', '11111111111']);
  assert.equal(result.length, 3);
  assert.equal(result[0].valid, true);
  assert.equal(result[1].valid, false);
  assert.equal(result[2].valid, false);
});

test('validateMultipleTckn dizi dışı girdide boş dizi döner', () => {
  const result = validateMultipleTckn(undefined as unknown as string[]);
  assert.deepEqual(result, []);
});

test('validateMultipleVkn sırayı korur', () => {
  const result = validateMultipleVkn(['1000036109', '1000036108', '1111111111']);
  assert.equal(result.length, 3);
  assert.equal(result[0].valid, true);
  assert.equal(result[1].valid, false);
  assert.equal(result[2].valid, false);
});

test('validateMultipleVkn dizi dışı girdide boş dizi döner', () => {
  const result = validateMultipleVkn(null as unknown as string[]);
  assert.deepEqual(result, []);
});

test('hook fonksiyonları dışa aktarılır', () => {
  assert.equal(typeof useTckn, 'function');
  assert.equal(typeof useVkn, 'function');
});
