import { useState, useEffect, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Button, Spin, Tag, Card, Descriptions, Space, message, Image } from 'antd'
import {
  ArrowLeftOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  ExclamationCircleOutlined,
  LeftOutlined,
  RightOutlined,
  UserOutlined,
  StarOutlined,
  ShopOutlined,
  CalendarOutlined,
} from '@ant-design/icons'
import { getAdById, approveAd, rejectAd, requestChanges, getAds } from '@/api/ads'
import { Advertisement } from '@/types'
import { useHotkeys } from '@/hooks/useHotkeys'
import { ModerationModal } from '@/components/ModerationModal/ModerationModal'
import { ModerationHistory } from '@/components/ModerationHistory/ModerationHistory'
import { formatDate, formatPrice } from '@/utils/formatters'
import { getStatusConfig } from '@/utils/statusConfig'
import styles from './AdDetailPage.module.css'

export const AdDetailPage = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const [ad, setAd] = useState<Advertisement | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [actionLoading, setActionLoading] = useState(false)
  const [rejectModalOpen, setRejectModalOpen] = useState(false)
  const [changesModalOpen, setChangesModalOpen] = useState(false)
  const [allAdsIds, setAllAdsIds] = useState<number[]>([])

  useEffect(() => {
    loadAllAdsIds()
  }, [])

  useEffect(() => {
    if (id) {
      const numericId = parseInt(id, 10)
      if (!isNaN(numericId)) {
        loadAd(numericId)
      } else {
        setError('Некорректный ID объявления')
        setLoading(false)
      }
    }
  }, [id])

  const loadAllAdsIds = async () => {
    try {
      const response = await getAds({ limit: 100, page: 1 })
      const ids = response.ads.map((ad) => ad.id)
      setAllAdsIds(ids)
    } catch (err) {
      setAllAdsIds([])
    }
  }

  const loadAd = async (adId: number) => {
    setLoading(true)
    setError(null)

    try {
      const data = await getAdById(adId)
      setAd(data)
    } catch (err) {
      const errorMessage = 'Не удалось загрузить объявление'
      setError(errorMessage)
      message.error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const handleModerationAction = useCallback(
    async (
      action: (id: number, ...args: any[]) => Promise<any>,
      successMessage: string,
      errorMessage: string,
      closeModal?: () => void,
      ...args: any[]
    ) => {
      if (!ad) return

      setActionLoading(true)
      try {
        await action(ad.id, ...args)
        message.success(successMessage)
        if (closeModal) closeModal()
        loadAd(ad.id)
      } catch (err) {
        message.error(errorMessage)
      } finally {
        setActionLoading(false)
      }
    },
    [ad]
  )

  const handleApprove = useCallback(() => {
    handleModerationAction(approveAd, 'Объявление одобрено', 'Ошибка при одобрении')
  }, [handleModerationAction])

  const handleReject = useCallback(
    (reason: string, comment: string) => {
      handleModerationAction(
        rejectAd,
        'Объявление отклонено',
        'Ошибка при отклонении',
        () => setRejectModalOpen(false),
        reason,
        comment
      )
    },
    [handleModerationAction]
  )

  const handleRequestChanges = useCallback(
    (reason: string, comment: string) => {
      handleModerationAction(
        requestChanges,
        'Запрос на доработку отправлен',
        'Ошибка при отправке запроса',
        () => setChangesModalOpen(false),
        reason,
        comment
      )
    },
    [handleModerationAction]
  )

  const goToPrevious = useCallback(() => {
    if (!ad || allAdsIds.length === 0) return
    const currentIndex = allAdsIds.indexOf(ad.id)
    if (currentIndex > 0) {
      const prevId = allAdsIds[currentIndex - 1]
      navigate(`/item/${prevId}`)
    } else {
      message.info('Это первое объявление')
    }
  }, [ad, allAdsIds, navigate])

  const goToNext = useCallback(() => {
    if (!ad || allAdsIds.length === 0) return
    const currentIndex = allAdsIds.indexOf(ad.id)
    if (currentIndex < allAdsIds.length - 1) {
      const nextId = allAdsIds[currentIndex + 1]
      navigate(`/item/${nextId}`)
    } else {
      message.info('Это последнее объявление')
    }
  }, [ad, allAdsIds, navigate])

  useHotkeys(
    {
      a: handleApprove,
      d: () => setRejectModalOpen(true),
      arrowright: goToNext,
      arrowleft: goToPrevious,
    },
    !loading && !!ad
  )

  if (loading) {
    return (
      <div className={styles.loading}>
        <Spin size="large" />
      </div>
    )
  }

  if (error || !ad) {
    return (
      <div className={styles.error}>
        <h2>{error || 'Объявление не найдено'}</h2>
        <Space>
          <Button onClick={() => navigate('/list')}>Вернуться к списку</Button>
          {id && (
            <Button type="primary" onClick={() => loadAd(parseInt(id, 10))}>
              Попробовать снова
            </Button>
          )}
        </Space>
      </div>
    )
  }

  const statusConfig = getStatusConfig(ad.status)
  const currentIndex = allAdsIds.indexOf(ad.id)
  const hasPrevious = currentIndex > 0
  const hasNext = currentIndex < allAdsIds.length - 1

  return (
    <div className={styles.container}>
      <div className={styles.navigation}>
        <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/list')}>
          К списку
        </Button>
        <div className={styles.navButtons}>
          <Button icon={<LeftOutlined />} onClick={goToPrevious} disabled={!hasPrevious}>
            Предыдущее (←)
          </Button>
          <Button icon={<RightOutlined />} onClick={goToNext} disabled={!hasNext}>
            Следующее (→)
          </Button>
        </div>
      </div>

      <div className={styles.content}>
        <div className={styles.mainSection}>
          <Card className={styles.card}>
            <div className={styles.header}>
              <h1 className={styles.title}>{ad.title}</h1>
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
                    fallback="https://via.placeholder.com/400x300?text=Нет+фото"
                  />
                ))}
              </Image.PreviewGroup>
            </div>

            <div className={styles.priceSection}>
              <span className={styles.price}>{formatPrice(ad.price)} ₽</span>
              <Tag>{ad.category}</Tag>
            </div>

            <div className={styles.section}>
              <h3>Описание</h3>
              <p className={styles.description}>{ad.description}</p>
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
        </div>

        <div className={styles.sidebar}>
          <Card title="Панель модератора" className={styles.moderatorPanel}>
            <Space direction="vertical" size="middle" style={{ width: '100%' }}>
              <Button
                type="primary"
                icon={<CheckCircleOutlined />}
                onClick={handleApprove}
                loading={actionLoading}
                disabled={ad.status === 'approved'}
                block
                size="large"
                className={styles.approveButton}
              >
                {ad.status === 'approved' ? 'Уже одобрено' : 'Одобрить (A)'}
              </Button>
              <Button
                danger
                icon={<CloseCircleOutlined />}
                onClick={() => setRejectModalOpen(true)}
                disabled={ad.status === 'rejected'}
                block
                size="large"
              >
                {ad.status === 'rejected' ? 'Уже отклонено' : 'Отклонить (D)'}
              </Button>
              <Button
                icon={<ExclamationCircleOutlined />}
                onClick={() => setChangesModalOpen(true)}
                block
                size="large"
                className={styles.changesButton}
              >
                Вернуть на доработку
              </Button>
            </Space>
          </Card>

          <ModerationHistory history={ad.moderationHistory} />
        </div>
      </div>

      <ModerationModal
        visible={rejectModalOpen}
        title="Отклонение объявления"
        onOk={handleReject}
        onCancel={() => setRejectModalOpen(false)}
        loading={actionLoading}
        isDanger
      />

      <ModerationModal
        visible={changesModalOpen}
        title="Запрос на доработку"
        onOk={handleRequestChanges}
        onCancel={() => setChangesModalOpen(false)}
        loading={actionLoading}
      />
    </div>
  )
}
