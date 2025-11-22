import { Switch } from 'antd'
import { MoonOutlined, SunOutlined } from '@ant-design/icons'
import { useTheme } from '@/contexts/ThemeContext'
import styles from './ThemeToggle.module.css'

export const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme()

  return (
    <div className={styles.toggle}>
      <SunOutlined className={styles.lightModeIcon} />
      <Switch checked={theme === 'dark'} onChange={toggleTheme} />
      <MoonOutlined className={styles.darkModeIcon} />
    </div>
  )
}
