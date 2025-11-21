import { Card, Tag, Badge } from 'antd'
import { ClockCircleOutlined } from '@ant-design/icons'
import { Advertisement } from '@/types'
import styles from './AdCard.module.css'

interface AdCardProps {
  ad: Advertisement
  onClick: () => void
}

export const AdCard = ({ ad, onClick }: AdCardProps) => {
  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'pending':
        return { color: 'orange', text: 'На модерации' }
      case 'approved':
        return { color: 'green', text: 'Одобрено' }
      case 'rejected':
        return { color: 'red', text: 'Отклонено' }
      case 'draft':
        return { color: 'default', text: 'Черновик' }
      default:
        return { color: 'default', text: status }
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    })
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ru-RU').format(price)
  }

  const statusConfig = getStatusConfig(ad.status)

  return (
    <Badge.Ribbon
      text={ad.priority === 'urgent' ? 'СРОЧНО' : null}
      color="red"
      style={{ display: ad.priority === 'urgent' ? 'block' : 'none' }}
    >
      <Card
        hoverable
        className={styles.card}
        onClick={onClick}
        cover={
          <div className={styles.imageWrapper}>
            <img
              alt={ad.title}
              src={ad.images[0] || 'https://via.placeholder.com/300x200?text=Нет+фото'}
              className={styles.image}
            />
          </div>
        }
      >
        <div className={styles.content}>
          <div className={styles.header}>
            <Tag color={statusConfig.color} className={styles.statusTag}>
              {statusConfig.text}
            </Tag>
            {ad.priority === 'urgent' && (
              <Tag color="red" className={styles.priorityTag}>
                Срочный
              </Tag>
            )}
          </div>

          <h3 className={styles.title}>{ad.title}</h3>

          <div className={styles.price}>
            <span className={styles.priceValue}>{formatPrice(ad.price)} ₽</span>
          </div>

          <div className={styles.meta}>
            <div className={styles.category}>
              <Tag>{ad.category}</Tag>
            </div>
            <div className={styles.date}>
              <ClockCircleOutlined className={styles.dateIcon} />
              <span>{formatDate(ad.createdAt)}</span>
            </div>
          </div>
        </div>
      </Card>
    </Badge.Ribbon>
  )
}
