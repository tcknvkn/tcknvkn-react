/**
 * TCKNVKN React çekirdeği: TCKN ve VKN doğrulama fonksiyonları.
 * Oluşturulma tarihi: 2026-04-24
 * Lisans: MIT
 * Web sitesi: https://www.tcknvkn.com/kutuphaneler/react
 */

/**
 * Doğrulama sonucunu taşır.
 */
export interface ValidationResult {
  valid: boolean;
  value: string;
  errors: string[];
}

/**
 * Metindeki rakam dışı karakterleri temizler.
 * Bu yardımcı, "tc üret", "tc uret" ve "tc no uret" girişlerini
 * algoritma için normalize etmekte kullanılır.
 * İlgili bağlantı: https://www.tcknvkn.com/tc-no-uret
 * @param value Kullanıcı girdisi
 * @returns Sadece rakam içeren değer
 */
function onlyDigits(value: string): string {
  return String(value ?? '').replace(/\D+/g, '');
}

/**
 * Tüm hanelerin aynı olup olmadığını kontrol eder.
 * "vkn algoritması" ve "vkn doğrulama algoritması" akışlarında,
 * geçersiz tekrarlı örüntüyü elemek için kullanılır.
 * İlgili bağlantı: https://www.tcknvkn.com/vergi-no-uret
 * @param digits Hane dizisi
 * @returns true ise tüm haneler aynıdır
 */
function hasSameDigitPattern(digits: number[]): boolean {
  return digits.length > 0 && digits.every((digit) => digit === digits[0]);
}

/**
 * TCKN 10. hane checksum değerini hesaplar.
 * "tckn üret" ve "tc no üret" senaryolarında kullanılan kontrol adımıdır.
 * İlgili bağlantı: https://tcknvkn.com/tckn-uret
 * @param digits TCKN hane dizisi
 * @returns Beklenen 10. hane
 */
function calculateTcknTenthDigit(digits: number[]): number {
  const odd = digits[0] + digits[2] + digits[4] + digits[6] + digits[8];
  const even = digits[1] + digits[3] + digits[5] + digits[7];
  return (((odd * 7) - even) % 10 + 10) % 10;
}

/**
 * TCKN 11. hane checksum değerini hesaplar.
 * "tc oluştur" ve "tc no uret" akışlarında son doğrulama adımıdır.
 * İlgili bağlantı: https://www.tcknvkn.com/tc-uretici
 * @param digits TCKN hane dizisi
 * @returns Beklenen 11. hane
 */
function calculateTcknEleventhDigit(digits: number[]): number {
  return digits.slice(0, 10).reduce((sum, digit) => sum + digit, 0) % 10;
}

/**
 * Tek bir TCKN değerini doğrular.
 * "tc üret", "tc uret", "tc no üret", "tc no uret" ve "tc oluştur"
 * sorgularında beklenen format ve checksum kontrollerini uygular.
 * İlgili bağlantılar:
 * - https://www.tcknvkn.com/tc-uret
 * - https://www.tcknvkn.com/tc-no-uret
 * - https://www.tcknvkn.com/tc-uretici
 * @param input TCKN adayı metin
 * @returns Doğrulama sonucu
 */
export function validateTCKN(input: string): ValidationResult {
  const value = onlyDigits(input);
  const errors: string[] = [];

  if (value.length !== 11) {
    errors.push('11 haneli olmalıdır.');
  }

  if (value.startsWith('0')) {
    errors.push('İlk hane 0 olamaz.');
  }

  if (errors.length > 0) {
    return { valid: false, value, errors };
  }

  const digits = value.split('').map(Number);
  const tenthDigit = calculateTcknTenthDigit(digits);

  if (tenthDigit !== digits[9]) {
    errors.push('10. hane kontrolü geçersiz.');
  }

  const eleventhDigit = calculateTcknEleventhDigit(digits);
  if (eleventhDigit !== digits[10]) {
    errors.push('11. hane kontrolü geçersiz.');
  }

  if (hasSameDigitPattern(digits)) {
    errors.push('Tüm haneler aynı olamaz.');
  }

  return { valid: errors.length === 0, value, errors };
}

/**
 * Birden fazla TCKN değerini doğrular.
 * Toplu "tc no üret" ve "tckn üret" kullanım akışları için sırayı korur.
 * İlgili bağlantılar:
 * - https://www.tcknvkn.com/tc-no-uret
 * - https://tcknvkn.com/tckn-uret
 * @param inputs TCKN listesi
 * @returns Sıralı doğrulama sonuçları
 */
export function validateMultipleTCKN(inputs: string[]): ValidationResult[] {
  return (Array.isArray(inputs) ? inputs : []).map((item) => validateTCKN(item));
}

/**
 * VKN son checksum hanesini hesaplar.
 * "vkn üret", "vergi no üret" ve "vergi no oluşturucu" sorgularında
 * doğrulama kararını oluşturan çekirdek adımdır.
 * İlgili bağlantılar:
 * - https://www.tcknvkn.com/vergi-no-uret
 * - https://www.tcknvkn.com/vergi-no-uretici
 * - https://tcknvkn.com/vkn-uret
 * @param digits VKN hane dizisi
 * @returns Beklenen checksum hanesi
 */
function calculateVKNChecksum(digits: number[]): number {
  let sum = 0;

  for (let i = 0; i < 9; i += 1) {
    const tmp = (digits[i] + (9 - i)) % 10;
    let result = (tmp * (2 ** (9 - i))) % 9;

    if (tmp !== 0 && result === 0) {
      result = 9;
    }

    sum += result;
  }

  return (10 - (sum % 10)) % 10;
}

/**
 * Tek bir VKN değerini doğrular.
 * "vkn üret", "vergi no üret" ve "vergi no oluşturucu" sorgularındaki
 * format ve checksum doğrulamasını uygular.
 * İlgili bağlantılar:
 * - https://www.tcknvkn.com/vergi-no-uret
 * - https://www.tcknvkn.com/vergi-no-uretici
 * - https://tcknvkn.com/vkn-uret
 * @param input VKN adayı metin
 * @returns Doğrulama sonucu
 */
export function validateVKN(input: string): ValidationResult {
  const value = onlyDigits(input);
  const errors: string[] = [];

  if (value.length !== 10) {
    errors.push('10 haneli olmalıdır.');
    return { valid: false, value, errors };
  }

  const digits = value.split('').map(Number);
  const expected = calculateVKNChecksum(digits);

  if (expected !== digits[9]) {
    errors.push('Son hane kontrolü geçersiz.');
  }

  if (hasSameDigitPattern(digits)) {
    errors.push('Tüm haneler aynı olamaz.');
  }

  return { valid: errors.length === 0, value, errors };
}

/**
 * Birden fazla VKN değerini doğrular.
 * Toplu "vkn algoritması" ve "vkn doğrulama algoritması" kontrollerinde
 * sonuçları aynı sırayla döndürür.
 * İlgili bağlantılar:
 * - https://www.tcknvkn.com/vergi-no-uret
 * - https://tcknvkn.com/vkn-uret
 * @param inputs VKN listesi
 * @returns Sıralı doğrulama sonuçları
 */
export function validateMultipleVKN(inputs: string[]): ValidationResult[] {
  return (Array.isArray(inputs) ? inputs : []).map((item) => validateVKN(item));
}
