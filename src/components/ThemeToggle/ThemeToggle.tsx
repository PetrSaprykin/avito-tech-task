import { Switch } from 'antd'
import { SunOutlined } from '@ant-design/icons'
import { useTheme } from '@/contexts/ThemeContext'
import styles from './ThemeToggle.module.css'

export const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme()

  return (
    <div className={styles.toggle}>
      <SunOutlined className={styles.icon} />
      <Switch checked={theme === 'dark'} onChange={toggleTheme} />
    </div>
  )
}
