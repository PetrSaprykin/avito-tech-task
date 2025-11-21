// hooks/useHotkeys.ts
import { useEffect, useRef } from 'react'

type HotkeyHandler = (event: KeyboardEvent) => void

interface HotkeyConfig {
  [key: string]: HotkeyHandler
}

const IGNORED_TAGS = ['INPUT', 'TEXTAREA', 'SELECT']

const normalizeKey = (key: string): string => {
  // Нормализуем специальные клавиши
  const keyMap: Record<string, string> = {
    ArrowLeft: 'arrowleft',
    ArrowRight: 'arrowright',
    ArrowUp: 'arrowup',
    ArrowDown: 'arrowdown',
  }

  return keyMap[key] || key.toLowerCase()
}

export const useHotkeys = (hotkeys: HotkeyConfig, enabled: boolean = true) => {
  // Используем ref чтобы всегда иметь актуальные обработчики
  // без пересоздания слушателя событий
  const hotkeysRef = useRef<HotkeyConfig>(hotkeys)

  // Обновляем ref при изменении hotkeys
  useEffect(() => {
    hotkeysRef.current = hotkeys
  }, [hotkeys])

  useEffect(() => {
    if (!enabled) return

    const handleKeyPress = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement

      // Игнорируем если фокус на поле ввода
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
  }, [enabled]) // Теперь зависимость только от enabled
}
