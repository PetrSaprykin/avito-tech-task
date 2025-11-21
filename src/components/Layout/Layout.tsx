import { ReactNode } from 'react'
import { Layout as AntLayout, Menu } from 'antd'
import { useNavigate, useLocation } from 'react-router-dom'
import { ThemeToggle } from '@/components/ThemeToggle'
import { HotkeysHelp } from '@/components/HotkeysHelp'
import styles from './Layout.module.css'

const { Header, Content } = AntLayout

interface LayoutProps {
  children: ReactNode
}

const Layout = ({ children }: LayoutProps) => {
  const navigate = useNavigate()
  const location = useLocation()

  const menuItems = [
    { key: '/list', label: 'Объявления' },
    { key: '/stats', label: 'Статистика' },
  ]

  return (
    <AntLayout className={styles.layout}>
      <Header className={styles.header}>
        <div className={styles.logo}>Модерация Авито</div>
        <Menu
          theme="dark"
          mode="horizontal"
          selectedKeys={[location.pathname]}
          items={menuItems}
          onClick={({ key }) => navigate(key)}
          className={styles.menu}
        />
        <ThemeToggle />
      </Header>
      <Content className={styles.content}>{children}</Content>
      <HotkeysHelp />
    </AntLayout>
  )
}

export default Layout
