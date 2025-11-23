import { useState, useEffect } from 'react'
import { Card, Select, Row, Col, Spin, Button, message, Space } from 'antd'
import { CheckCircleOutlined, CloseCircleOutlined, ClockCircleOutlined } from '@ant-design/icons'
import {
  getStatsSummary,
  getActivityChart,
  getDecisionsChart,
  getCategoriesChart,
} from '@/api/stats'
import { StatsSummary } from '@/types'
import { DownloadOutlined, FilePdfOutlined } from '@ant-design/icons'
import { exportToCSV, exportToPDF } from '@/utils/exportUtils'
import { StatCard } from '@/components/StatCard/StatCard'
import ActivityChart from '@/components/charts/ActivityChart'
import DecisionsChart from '@/components/charts/DecisionsChart'
import CategoriesChart from '@/components/charts/CategoriesChart'
import styles from './StatsPage.module.css'

export const StatsPage = () => {
  const [period, setPeriod] = useState('week')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [stats, setStats] = useState<StatsSummary | null>(null)
  const [activityData, setActivityData] = useState([])
  const [decisionsData, setDecisionsData] = useState(null)
  const [categoriesData, setCategoriesData] = useState({})

  useEffect(() => {
    const controller = new AbortController()

    loadAllStats(controller.signal)

    return () => {
      controller.abort()
    }
  }, [period])

  const loadAllStats = async (signal?: AbortSignal) => {
    setLoading(true)
    setError(null)
    try {
      const [summary, activity, decisions, categories] = await Promise.all([
        getStatsSummary(period, signal),
        getActivityChart(period, signal),
        getDecisionsChart(period, signal),
        getCategoriesChart(period, signal),
      ])

      setStats(summary)
      setActivityData(activity)
      setDecisionsData(decisions)
      setCategoriesData(categories)
    } catch (err: any) {
      if (err.name === 'CanceledError' || err.code === 'ERR_CANCELED') {
        return
      }
      setError('Не удалось загрузить статистику. Попробуйте позже')
    } finally {
      setLoading(false)
    }
  }

  const PERIOD_OPTIONS = [
    { label: 'Сегодня', value: 'today' },
    { label: 'Последние 7 дней', value: 'week' },
    { label: 'Последние 30 дней', value: 'month' },
  ]

  const handleExportCSV = () => {
    if (!stats || !activityData || !decisionsData) {
      message.warning('Нет данных для экспорта')
      return
    }

    try {
      exportToCSV(stats, activityData, decisionsData, period)
      message.success('CSV файл успешно экспортирован')
    } catch (error) {
      message.error('Ошибка при экспорте CSV')
      console.error(error)
    }
  }

  const handleExportPDF = () => {
    if (!stats || !activityData || !decisionsData) {
      message.warning('Нет данных для экспорта')
      return
    }

    try {
      exportToPDF(stats, activityData, decisionsData, period)
      message.success('PDF файл успешно экспортирован')
    } catch (error) {
      message.error('Ошибка при экспорте PDF')
      console.error(error)
    }
  }

  if (loading) {
    return (
      <div className={styles.loading}>
        <Spin size="large" />
      </div>
    )
  }

  if (error) {
    return (
      <div className={styles.errorContainer}>
        <div className={styles.error}>
          <p className={styles.errorText}>{error}</p>
          <Button onClick={() => loadAllStats()} className={styles.retryButton}>
            Попробовать снова
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Статистика модератора</h1>

        <div className={styles.headerActions}>
          <Space className={styles.exportButtons}>
            <Button
              type="default"
              icon={<DownloadOutlined />}
              onClick={handleExportCSV}
              disabled={loading || !stats}
            >
              Экспорт CSV
            </Button>
            <Button
              type="default"
              icon={<FilePdfOutlined />}
              onClick={handleExportPDF}
              disabled={loading || !stats}
            >
              Экспорт PDF
            </Button>
          </Space>

          <Select
            value={period}
            onChange={setPeriod}
            options={PERIOD_OPTIONS}
            style={{ width: 200 }}
          />
        </div>
      </div>

      {stats && (
        <>
          <Row gutter={[16, 16]} className={styles.statsCards}>
            <Col xs={24} sm={12} lg={6}>
              <StatCard
                title="Проверено"
                value={stats.totalReviewed}
                icon={<CheckCircleOutlined />}
                color="rgb(0, 170, 255)"
              />
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <StatCard
                title="Одобрено"
                value={`${stats.approvedPercentage.toFixed(2)}%`}
                icon={<CheckCircleOutlined />}
                color="rgb(2, 209, 92)"
              />
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <StatCard
                title="Отклонено"
                value={`${stats.rejectedPercentage.toFixed(2)}%`}
                icon={<CloseCircleOutlined />}
                color="#ff4d4f"
              />
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <StatCard
                title="Ср. время"
                value={`${Math.round(stats.averageReviewTime / 60_000)} мин`}
                icon={<ClockCircleOutlined />}
                color="#faad14"
              />
            </Col>
          </Row>

          <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
            <Col xs={24} lg={16}>
              <Card title="График активности" className={styles.chartCard}>
                <ActivityChart data={activityData} />
              </Card>
            </Col>
            <Col xs={24} lg={8}>
              <Card title="Распределение решений" className={styles.chartCard}>
                <DecisionsChart data={decisionsData} />
              </Card>
            </Col>
          </Row>

          <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
            <Col xs={24}>
              <Card title="Категории объявлений" className={styles.chartCard}>
                <CategoriesChart data={categoriesData} />
              </Card>
            </Col>
          </Row>
        </>
      )}
    </div>
  )
}
