import { useState, useEffect, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Button, Spin, Space, message } from 'antd'
import { ArrowLeftOutlined, LeftOutlined, RightOutlined } from '@ant-design/icons'
import { getAdById, approveAd, rejectAd, requestChanges, getAds } from '@/api/ads'
import { Advertisement } from '@/types'
import { useHotkeys } from '@/hooks/useHotkeys'
import { ModerationModal } from '@/components/ModerationModal/ModerationModal'
import { AdDetailContent } from '@/components/AdDetailContent'
import { AdDetailSidebar } from '@/components/AdDetailSidebar'
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
          <AdDetailContent ad={ad} />
        </div>

        <div className={styles.sidebarSection}>
          <AdDetailSidebar
            ad={ad}
            onApprove={handleApprove}
            onReject={() => setRejectModalOpen(true)}
            onRequestChanges={() => setChangesModalOpen(true)}
            actionLoading={actionLoading}
          />
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
