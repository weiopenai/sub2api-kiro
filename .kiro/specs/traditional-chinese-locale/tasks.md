# Implementation Plan: Traditional Chinese (zh-TW) Locale Support

## Overview

Add Traditional Chinese (zh-TW) locale support to the frontend i18n system. This involves modifying the i18n index module to register the new locale with proper BCP 47 browser detection, creating the full zh-TW translation file, and adding unit tests to verify correctness.

## Tasks

- [x] 1. Update i18n/index.ts to add zh-TW locale support
  - [x] 1.1 Extend `LocaleCode` type to include `'zh-TW'`
    - Change `type LocaleCode = 'en' | 'zh'` to `type LocaleCode = 'en' | 'zh' | 'zh-TW'`
    - _Requirements: 2.1_
  - [x] 1.2 Add `'zh-TW'` entry to `localeLoaders`
    - Add `'zh-TW': () => import('./locales/zh-TW')` to the loader record
    - _Requirements: 2.3_
  - [x] 1.3 Update `isLocaleCode()` type guard to include `'zh-TW'`
    - Add `|| value === 'zh-TW'` to the return expression
    - _Requirements: 2.2_
  - [x] 1.4 Improve `getDefaultLocale()` with BCP 47 subtag matching for Traditional Chinese regions
    - After `if (browserLang.startsWith('zh'))`, add branching logic:
      - `zh-tw`, `zh-hk`, `zh-mo`, `zh-hant*` → return `'zh-TW'`
      - All other `zh*` (including bare `zh`, `zh-cn`, `zh-hans*`) → return `'zh'`
    - Use `toLowerCase()` comparison as already done in current code
    - _Requirements: 3.1, 3.2, 3.3, 3.4_
  - [x] 1.5 Add zh-TW entry to `availableLocales` array
    - Append `{ code: 'zh-TW', name: '繁體中文', flag: '🇹🇼' }` to the array
    - _Requirements: 4.1_

- [x] 2. Create zh-TW.ts translation file
  - [x] 2.1 Create `frontend/src/i18n/locales/zh-TW.ts` with all translation keys
    - Copy the full structure from `zh.ts`
    - Convert all Simplified Chinese characters to Traditional Chinese equivalents
    - Apply Taiwan-specific terminology throughout (see design document terminology table):
      - 服务器 → 伺服器, 信息 → 訊息, 视频 → 影片, 文件 → 檔案
      - 软件 → 軟體, 网络 → 網路, 数据 → 資料, 默认 → 預設
      - 链接 → 連結, 注册 → 註冊, 账户 → 帳戶, 用户 → 使用者
      - 密钥 → 金鑰/密鑰, 仪表盘 → 儀表板, 渠道 → 頻道, 充值 → 加值/儲值
    - Preserve all English strings that serve as technical identifiers (API, Token, Claude Code, etc.)
    - Maintain exact same nested key structure as `zh.ts` — no added or missing keys
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 5.1, 5.3_

- [x] 3. Checkpoint - Verify locale registration and translation file
  - Ensure TypeScript compilation passes with no type errors
  - Verify `zh-TW.ts` exports a default object with the same top-level keys as `zh.ts`
  - Ensure all tests pass, ask the user if questions arise.

- [x] 4. Add unit tests for locale detection and type guard
  - [ ]* 4.1 Write unit tests for `isLocaleCode()` with zh-TW
    - Test that `isLocaleCode('zh-TW')` returns `true`
    - Test that `isLocaleCode('zh-tw')` returns `false` (case-sensitive)
    - Test that `isLocaleCode('ja')` returns `false`
    - Create test file at `frontend/src/i18n/index.test.ts`
    - _Requirements: 2.2_
  - [ ]* 4.2 Write unit tests for `getDefaultLocale()` browser detection
    - Mock `navigator.language` and `localStorage`
    - Test `zh-TW` → returns `'zh-TW'`
    - Test `zh-Hant` → returns `'zh-TW'`
    - Test `zh-Hant-TW` → returns `'zh-TW'`
    - Test `zh-HK` → returns `'zh-TW'`
    - Test `zh-MO` → returns `'zh-TW'`
    - Test `zh-CN` → returns `'zh'`
    - Test `zh-Hans` → returns `'zh'`
    - Test `zh` → returns `'zh'`
    - Test `en-US` → returns `'en'`
    - Test localStorage saved value `'zh-TW'` takes priority over browser language
    - _Requirements: 3.1, 3.2, 3.3, 3.4_
  - [ ]* 4.3 Write unit tests for translation file key structure consistency
    - Import `zh-TW` and `zh` locale objects
    - Recursively compare all nested keys to ensure exact structural match
    - Verify `zh-TW` has the same number of top-level keys as `en`
    - _Requirements: 5.1, 5.2_

- [x] 5. Final checkpoint - Ensure all tests pass
  - Run `vitest --run` in the frontend directory
  - Ensure all tests pass, ask the user if questions arise.

## Task Dependency Graph

```json
{
  "waves": [
    { "tasks": ["1"] },
    { "tasks": ["2"] },
    { "tasks": ["3"] },
    { "tasks": ["4"] },
    { "tasks": ["5"] }
  ]
}
```

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- The design document explicitly states property-based testing is not applicable for this feature (static translations and small finite input sets for locale detection)
- The existing `LocaleSwitcher` component dynamically reads `availableLocales`, so no UI component changes are needed
- Task 2 depends on Task 1 (TypeScript type must exist before the file can satisfy the loader type)
- Task 4 depends on Tasks 1 and 2 (tests verify both detection logic and translation file structure)
