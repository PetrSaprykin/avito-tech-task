import { Switch } from 'antd'
import { BulbOutlined } from '@ant-design/icons'
import { useTheme } from '@/contexts/ThemeContext'
import styles from './ThemeToggle.module.css'

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme()

  return (
    <div className={styles.toggle}>
      <BulbOutlined className={styles.icon} />
      <Switch
        checked={theme === 'dark'}
        onChange={toggleTheme}
        checkedChildren="🌙"
        unCheckedChildren="☀️"
      />
    </div>
  )
}

export default ThemeToggle
