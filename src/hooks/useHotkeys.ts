import { useEffect, useRef } from 'react'

type HotkeyHandler = (event: KeyboardEvent) => void

interface HotkeyConfig {
  [key: string]: HotkeyHandler
}

// Теги, в которых горячие клавиши не должны работать
const IGNORED_TAGS = ['INPUT', 'TEXTAREA', 'SELECT']

/**
 * Нормализует клавишу к нижнему регистру для упрощения сравнения.
 * Специальные клавиши (стрелки) приводятся к единому формату.
 */
const normalizeKey = (key: string): string => {
  const keyMap: Record<string, string> = {
    ArrowLeft: 'arrowleft',
    ArrowRight: 'arrowright',
    ArrowUp: 'arrowup',
    ArrowDown: 'arrowdown',
  }

  return keyMap[key] || key.toLowerCase()
}

/**
 * Хук для регистрации глобальных горячих клавиш.
 * Игнорирует нажатия в полях ввода.
 *
 * @param hotkeys - Объект с парами "клавиша: обработчик"
 * @param enabled - Флаг активности горячих клавиш (по умолчанию true)
 *
 * @example
 * useHotkeys({
 *   'a': () => approveAd(),
 *   'd': () => openRejectModal(),
 *   'arrowright': () => goToNext()
 * }, isAdLoaded)
 */
export const useHotkeys = (hotkeys: HotkeyConfig, enabled: boolean = true) => {
  const hotkeysRef = useRef<HotkeyConfig>(hotkeys)

  // Обновляем ref при изменении hotkeys
  useEffect(() => {
    hotkeysRef.current = hotkeys
  }, [hotkeys])

  useEffect(() => {
    if (!enabled) return

    const handleKeyPress = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement

      // Игнорируем нажатия в полях ввода и contentEditable элементах
      if (IGNORED_TAGS.includes(target.tagName) || target.isContentEditable) {
        return
      }

      const normalizedKey = normalizeKey(event.key)
      const handler = hotkeysRef.current[normalizedKey]

      if (handler) {
        event.preventDefault()
        handler(event)
      }
    }

    window.addEventListener('keydown', handleKeyPress)

    return () => {
      window.removeEventListener('keydown', handleKeyPress)
    }
  }, [enabled])
}
