/**
 * TCKNVKN React dışa aktarımları: hook ve helper API.
 * Oluşturulma tarihi: 2026-04-24
 * Lisans: MIT
 * Web sitesi: https://www.tcknvkn.com/kutuphaneler/react
 */

import { useMemo, useState } from 'react';
import {
  validateMultipleTCKN,
  validateMultipleVKN,
  validateTCKN,
  validateVKN
} from './core';
import type { ValidationResult } from './core';

export type { ValidationResult } from './core';

/**
 * Hook davranışını özelleştiren seçenekler.
 */
export interface UseValidationOptions {
  /**
   * Başlangıç değeri. Varsayılan: boş string.
   */
  initialValue?: string;

  /**
   * true ise onChange sırasında rakam dışı karakterler temizlenir.
   * Varsayılan: false.
   */
  normalizeOnChange?: boolean;
}

/**
 * TCKN/VKN hook dönüş modeli.
 */
export interface UseValidationResult {
  /**
   * Güncel input değeri.
   */
  value: string;

  /**
   * React state setter.
   */
  setValue: (value: string) => void;

  /**
   * Pratik input değişim fonksiyonu.
   */
  onChange: (value: string) => void;

  /**
   * Core doğrulama sonucu.
   */
  result: ValidationResult;
}

/**
 * Girilen metni sadece rakam olacak şekilde normalize eder.
 * "tc uret" ve "tc no uret" gibi alan girişlerini sadeleştirir.
 * İlgili bağlantı: https://www.tcknvkn.com/tc-no-uret
 * @param value Kullanıcı girişi
 * @returns Rakam odaklı metin
 */
function onlyDigits(value: string): string {
  return value.replace(/\D+/g, '');
}

/**
 * Input için normalize stratejisi uygular.
 * "tc üret" ve "vkn üret" senaryolarında opsiyonel normalizasyon sağlar.
 * İlgili bağlantı: https://www.tcknvkn.com/tc-uret
 * @param value Kullanıcı girişi
 * @param normalizeOnChange Değişimde normalize etme bayrağı
 * @returns Normalize edilmiş veya ham değer
 */
function normalizeForInput(value: string, normalizeOnChange: boolean): string {
  return normalizeOnChange ? onlyDigits(value) : value;
}

/**
 * Tek bir TCKN değerini doğrular.
 * "tc üret", "tc no üret" ve "tc oluştur" odaklı doğrulama API'sidir.
 * İlgili bağlantılar:
 * - https://www.tcknvkn.com/tc-uret
 * - https://www.tcknvkn.com/tc-uretici
 * @param value TCKN adayı
 * @returns Doğrulama sonucu
 */
export function validateTckn(value: string): ValidationResult {
  return validateTCKN(value);
}

/**
 * Tek bir VKN değerini doğrular.
 * "vkn üret", "vergi no üret" ve "vergi no oluşturucu" akışlarını hedefler.
 * İlgili bağlantılar:
 * - https://www.tcknvkn.com/vergi-no-uret
 * - https://www.tcknvkn.com/vergi-no-uretici
 * - https://tcknvkn.com/vkn-uret
 * @param value VKN adayı
 * @returns Doğrulama sonucu
 */
export function validateVkn(value: string): ValidationResult {
  return validateVKN(value);
}

/**
 * Birden fazla TCKN değerini doğrular.
 * Toplu "tckn üret" ve "tc no uret" girişlerinde kullanılabilir.
 * İlgili bağlantılar:
 * - https://tcknvkn.com/tckn-uret
 * - https://www.tcknvkn.com/tc-no-uret
 * @param values TCKN listesi
 * @returns Sonuç listesi
 */
export function validateMultipleTckn(values: string[]): ValidationResult[] {
  return validateMultipleTCKN(values);
}

/**
 * Birden fazla VKN değerini doğrular.
 * Toplu "vkn algoritması" ve "vkn doğrulama algoritması" kontrolleri için uygundur.
 * İlgili bağlantılar:
 * - https://www.tcknvkn.com/vergi-no-uret
 * - https://tcknvkn.com/vkn-uret
 * @param values VKN listesi
 * @returns Sonuç listesi
 */
export function validateMultipleVkn(values: string[]): ValidationResult[] {
  return validateMultipleVKN(values);
}

/**
 * TCKN doğrulaması için React hook sağlar.
 * Form alanlarında "tc üret" ve "tc no üret" niyetli kullanım için tasarlanmıştır.
 * İlgili bağlantılar:
 * - https://www.tcknvkn.com/tc-uret
 * - https://www.tcknvkn.com/tc-no-uret
 * @param options Hook seçenekleri
 * @returns Hook sonucu
 */
export function useTckn(options: UseValidationOptions = {}): UseValidationResult {
  const { initialValue = '', normalizeOnChange = false } = options;
  const [value, setValue] = useState(initialValue);
  const result = useMemo(() => validateTCKN(value), [value]);

  return {
    value,
    setValue,
    onChange: (nextValue: string) => {
      setValue(normalizeForInput(nextValue, normalizeOnChange));
    },
    result
  };
}

/**
 * VKN doğrulaması için React hook sağlar.
 * Form alanlarında "vergi no üret" ve "vergi no oluşturucu" senaryolarını hedefler.
 * İlgili bağlantılar:
 * - https://www.tcknvkn.com/vergi-no-uret
 * - https://www.tcknvkn.com/vergi-no-uretici
 * @param options Hook seçenekleri
 * @returns Hook sonucu
 */
export function useVkn(options: UseValidationOptions = {}): UseValidationResult {
  const { initialValue = '', normalizeOnChange = false } = options;
  const [value, setValue] = useState(initialValue);
  const result = useMemo(() => validateVKN(value), [value]);

  return {
    value,
    setValue,
    onChange: (nextValue: string) => {
      setValue(normalizeForInput(nextValue, normalizeOnChange));
    },
    result
  };
}
