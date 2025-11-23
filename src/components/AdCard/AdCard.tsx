import { Card, Tag, Badge, Checkbox } from 'antd' // Добавь Checkbox
import { ClockCircleOutlined } from '@ant-design/icons'
import { Advertisement } from '@/types'
import { getStatusConfig } from '@/utils/statusConfig'
import { formatDate, formatPrice } from '@/utils/formatters'
import styles from './AdCard.module.css'

interface AdCardProps {
  ad: Advertisement
  onClick: () => void
  // Новые пропсы для bulk операций
  selectable?: boolean
  selected?: boolean
  onSelect?: (checked: boolean) => void
}

export const AdCard = ({
  ad,
  onClick,
  selectable = false,
  selected = false,
  onSelect,
}: AdCardProps) => {
  const statusConfig = getStatusConfig(ad.status)

  const handleCheckboxClick = (e: React.MouseEvent) => {
    e.stopPropagation() // Не открываем карточку при клике на чекбокс
  }

  const handleCheckboxChange = (e: any) => {
    onSelect?.(e.target.checked)
  }

  return (
    <Badge.Ribbon
      text={ad.priority === 'urgent' ? 'СРОЧНО' : null}
      color="red"
      className={styles.ribbon}
      style={{ display: ad.priority === 'urgent' ? 'block' : 'none' }}
    >
      <Card
        hoverable
        className={`${styles.card} ${selected ? styles.selected : ''}`}
        onClick={onClick}
        cover={
          <div className={styles.imageWrapper}>
            {selectable && (
              <div className={styles.checkboxWrapper} onClick={handleCheckboxClick}>
                <Checkbox
                  checked={selected}
                  onChange={handleCheckboxChange}
                  className={styles.checkbox}
                />
              </div>
            )}
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
