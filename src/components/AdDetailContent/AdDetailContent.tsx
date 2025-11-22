import { Card, Tag, Image, Descriptions } from 'antd'
import { UserOutlined, StarOutlined, ShopOutlined, CalendarOutlined } from '@ant-design/icons'
import { Advertisement } from '@/types'
import { formatDate, formatDescription, formatPrice, formatTitle } from '@/utils/formatters'
import { getStatusConfig } from '@/utils/statusConfig'
import styles from './AdDetailContent.module.css'

interface AdDetailContentProps {
  ad: Advertisement
}

export const AdDetailContent = ({ ad }: AdDetailContentProps) => {
  const statusConfig = getStatusConfig(ad.status)

  return (
    <Card className={styles.card}>
      <div className={styles.header}>
        <h1 className={styles.title}>{formatTitle(ad.title)}</h1>
        <div className={styles.tags}>
          <Tag color={statusConfig.color} icon={statusConfig.icon}>
            {statusConfig.text}
          </Tag>
          {ad.priority === 'urgent' && <Tag color="red">СРОЧНО</Tag>}
        </div>
      </div>

      <div className={styles.imageGallery}>
        <Image.PreviewGroup>
          {ad.images.map((img, idx) => (
            <Image
              key={idx}
              src={img}
              alt={`${ad.title} - ${idx + 1}`}
              className={styles.galleryImage}
              fallback="@/../public/ad-image-placeholder.svg"
            />
          ))}
        </Image.PreviewGroup>
      </div>

      <div className={styles.priceSection}>
        <span className={styles.price}>{formatPrice(ad.price)} ₽</span>
        <Tag className={styles.categoryTag}>{ad.category}</Tag>
      </div>

      <div className={styles.section}>
        <h3>Описание</h3>
        <p className={styles.description}>{formatDescription(ad.description)}</p>
      </div>

      <div className={styles.section}>
        <h3>Характеристики</h3>
        <Descriptions bordered column={1} size="small">
          {Object.entries(ad.characteristics).map(([key, value]) => (
            <Descriptions.Item key={key} label={key}>
              {value}
            </Descriptions.Item>
          ))}
        </Descriptions>
      </div>

      <div className={styles.section}>
        <h3>Информация о продавце</h3>
        <div className={styles.seller}>
          <UserOutlined className={styles.sellerIcon} />
          <div className={styles.sellerDetails}>
            <div className={styles.sellerName}>{ad.seller.name}</div>
            <div className={styles.sellerInfo}>
              <StarOutlined /> Рейтинг: {ad.seller.rating}
            </div>
            <div className={styles.sellerInfo}>
              <ShopOutlined /> Объявлений: {ad.seller.totalAds}
            </div>
            <div className={styles.sellerInfo}>
              <CalendarOutlined /> На сайте с {formatDate(ad.seller.registeredAt)}
            </div>
          </div>
        </div>
      </div>
    </Card>
  )
}
