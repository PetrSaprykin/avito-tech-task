import { Card, Tag } from 'antd'
import { useState } from 'react'
import styles from './HotkeysHelp.module.css'

export const HotkeysHelp = () => {
  const [visible, setVisible] = useState(false)

  const hotkeys = [
    { key: 'A', description: 'Одобрить объявление' },
    { key: 'D', description: 'Отклонить объявление' },
    { key: '→', description: 'Следующее объявление' },
    { key: '←', description: 'Предыдущее объявление' },
    { key: '/', description: 'Фокус на поиск' },
  ]

  return (
    <div className={styles.container}>
      <div className={styles.trigger} onClick={() => setVisible(!visible)}>
        Горячие клавиши
      </div>

      {visible && (
        <Card className={styles.card}>
          <div className={styles.list}>
            {hotkeys.map((hotkey, idx) => (
              <div key={idx} className={styles.item}>
                <Tag className={styles.key}>{hotkey.key}</Tag>
                <span>{hotkey.description}</span>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  )
}
