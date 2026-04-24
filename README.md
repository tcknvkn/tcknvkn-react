# @tcknvkn/react

`@tcknvkn/react`, React projelerinde **TCKN (TC Kimlik No)** ve **VKN (Vergi Kimlik No)** doğrulama işlemleri için hook ve helper API sunar.

Bu paket yalnızca **algoritmik/format doğrulaması** yapar; resmi kurum sorgusu yapmaz.

## Kurulum

```bash
npm install @tcknvkn/react
```

## Özellikler

- `useTckn(...)` ve `useVkn(...)` hook'ları
- `validateTckn(...)` ve `validateVkn(...)` helper fonksiyonları
- `validateMultipleTckn(...)` ve `validateMultipleVkn(...)` toplu doğrulama
- Opsiyonel input normalize (`normalizeOnChange`)
- TypeScript tip desteği

## Hızlı kullanım

```tsx
import { useTckn } from '@tcknvkn/react';

export function TcknField() {
  const { value, onChange, result } = useTckn({ normalizeOnChange: true });

  return (
    <>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="TCKN"
      />
      {!result.valid && <small>{result.errors.join(' ')}</small>}
    </>
  );
}
```

## API

- `useTckn(options?: UseValidationOptions): UseValidationResult`
- `useVkn(options?: UseValidationOptions): UseValidationResult`
- `validateTckn(value: string): ValidationResult`
- `validateVkn(value: string): ValidationResult`
- `validateMultipleTckn(values: string[]): ValidationResult[]`
- `validateMultipleVkn(values: string[]): ValidationResult[]`

## Test ve build

```bash
npm install --include=dev
npm test
npm run build
```

## İlgili bağlantılar

- Kütüphaneler merkezi: https://www.tcknvkn.com/kutuphaneler
- React kütüphane sayfası: https://www.tcknvkn.com/kutuphaneler/react
- https://www.tcknvkn.com/tc-uret
- https://www.tcknvkn.com/tc-no-uret
- https://www.tcknvkn.com/tc-uretici
- https://tcknvkn.com/tckn-uret
- https://www.tcknvkn.com/vergi-no-uret
- https://www.tcknvkn.com/vergi-no-uretici
- https://tcknvkn.com/vkn-uret

## Lisans

MIT
