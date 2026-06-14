import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { isLocaleCode, getDefaultLocale } from './index'

describe('isLocaleCode()', () => {
  it('returns true for "zh-TW"', () => {
    expect(isLocaleCode('zh-TW')).toBe(true)
  })

  it('returns false for "zh-tw" (case-sensitive)', () => {
    expect(isLocaleCode('zh-tw')).toBe(false)
  })

  it('returns false for "ja" (unsupported locale)', () => {
    expect(isLocaleCode('ja')).toBe(false)
  })

  it('returns true for "en"', () => {
    expect(isLocaleCode('en')).toBe(true)
  })

  it('returns true for "zh"', () => {
    expect(isLocaleCode('zh')).toBe(true)
  })
})

describe('getDefaultLocale()', () => {
  let navigatorLanguageSpy: ReturnType<typeof vi.spyOn>
  let localStorageGetSpy: ReturnType<typeof vi.spyOn>

  beforeEach(() => {
    localStorageGetSpy = vi.spyOn(Storage.prototype, 'getItem').mockReturnValue(null)
    navigatorLanguageSpy = vi.spyOn(navigator, 'language', 'get')
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('returns "zh-TW" when browser language is zh-TW', () => {
    navigatorLanguageSpy.mockReturnValue('zh-TW')
    expect(getDefaultLocale()).toBe('zh-TW')
  })

  it('returns "zh-TW" when browser language is zh-Hant', () => {
    navigatorLanguageSpy.mockReturnValue('zh-Hant')
    expect(getDefaultLocale()).toBe('zh-TW')
  })

  it('returns "zh-TW" when browser language is zh-Hant-TW', () => {
    navigatorLanguageSpy.mockReturnValue('zh-Hant-TW')
    expect(getDefaultLocale()).toBe('zh-TW')
  })

  it('returns "zh-TW" when browser language is zh-HK', () => {
    navigatorLanguageSpy.mockReturnValue('zh-HK')
    expect(getDefaultLocale()).toBe('zh-TW')
  })

  it('returns "zh-TW" when browser language is zh-MO', () => {
    navigatorLanguageSpy.mockReturnValue('zh-MO')
    expect(getDefaultLocale()).toBe('zh-TW')
  })

  it('returns "zh" when browser language is zh-CN', () => {
    navigatorLanguageSpy.mockReturnValue('zh-CN')
    expect(getDefaultLocale()).toBe('zh')
  })

  it('returns "zh" when browser language is zh-Hans', () => {
    navigatorLanguageSpy.mockReturnValue('zh-Hans')
    expect(getDefaultLocale()).toBe('zh')
  })

  it('returns "zh" when browser language is bare zh', () => {
    navigatorLanguageSpy.mockReturnValue('zh')
    expect(getDefaultLocale()).toBe('zh')
  })

  it('returns "en" when browser language is en-US', () => {
    navigatorLanguageSpy.mockReturnValue('en-US')
    expect(getDefaultLocale()).toBe('en')
  })

  it('returns localStorage saved value "zh-TW" over browser language', () => {
    localStorageGetSpy.mockReturnValue('zh-TW')
    navigatorLanguageSpy.mockReturnValue('en-US')
    expect(getDefaultLocale()).toBe('zh-TW')
  })
})

describe('translation file key structure consistency', () => {
  function getKeys(obj: Record<string, any>, prefix = ''): string[] {
    const keys: string[] = []
    for (const key of Object.keys(obj)) {
      const fullKey = prefix ? `${prefix}.${key}` : key
      if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
        keys.push(...getKeys(obj[key], fullKey))
      } else {
        keys.push(fullKey)
      }
    }
    return keys.sort()
  }

  it('zh-TW has the same nested key structure as zh', async () => {
    const zhTW = (await import('./locales/zh-TW')).default
    const zh = (await import('./locales/zh')).default

    const zhTWKeys = getKeys(zhTW)
    const zhKeys = getKeys(zh)

    expect(zhTWKeys).toEqual(zhKeys)
  })

  it('zh-TW has the same number of top-level keys as en', async () => {
    const zhTW = (await import('./locales/zh-TW')).default
    const en = (await import('./locales/en')).default

    const zhTWTopKeys = Object.keys(zhTW)
    const enTopKeys = Object.keys(en)

    expect(zhTWTopKeys.length).toBe(enTopKeys.length)
  })
})
