import { describe, it, expect } from 'vitest'
import { formatPrice, formatDate, formatTitle, formatDescription } from '@/utils/formatters'

describe('formatPrice', () => {
  it('должен форматировать цену с разделителями тысяч', () => {
    expect(formatPrice(1000)).toBe('1\u00A0000')
    expect(formatPrice(1500000)).toBe('1\u00A0500\u00A0000')
  })

  it('должен корректно обрабатывать малые числа', () => {
    expect(formatPrice(50)).toBe('50')
    expect(formatPrice(0)).toBe('0')
  })
})

describe('formatDate', () => {
  it('должен форматировать ISO дату в локальный формат', () => {
    const result = formatDate('2024-01-15T14:30:00')
    expect(result).toBe('15.01.2024')
  })

  it('должен корректно обрабатывать другие даты', () => {
    const result = formatDate('2024-12-31T23:59:59')
    expect(result).toBe('31.12.2024')
  })
})

describe('formatTitle', () => {
  it('должен извлекать текст после двоеточия', () => {
    const result = formatTitle('Категория: Название товара')
    expect(result).toBe('Название товара')
  })

  it('должен корректно обрабатывать заголовки с пробелами', () => {
    const result = formatTitle('Тип:   Текст с пробелами  ')
    expect(result).toBe('Текст с пробелами')
  })
})

describe('formatDescription', () => {
  it('должен удалять первое предложение', () => {
    const input = 'Первое предложение. Второе предложение. Третье предложение.'
    const result = formatDescription(input)
    expect(result).toBe('Второе предложение. Третье предложение.')
  })

  it('должен вернуть пустую строку если одно предложение', () => {
    const result = formatDescription('Только одно предложение.')
    expect(result).toBe('')
  })
})
