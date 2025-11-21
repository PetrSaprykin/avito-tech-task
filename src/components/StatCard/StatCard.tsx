import { Card } from 'antd'
import { ReactNode } from 'react'
import styles from './StatCard.module.css'

interface StatCardProps {
  title: string
  value: string | number
  icon: ReactNode
  color: string
}

export const StatCard = ({ title, value, icon, color }: StatCardProps) => {
  return (
    <Card className={styles.card}>
      <div className={styles.content}>
        <div className={styles.icon} style={{ color }}>
          {icon}
        </div>
        <div className={styles.info}>
          <div className={styles.title}>{title}</div>
          <div className={styles.value}>{value}</div>
        </div>
      </div>
    </Card>
  )
}
