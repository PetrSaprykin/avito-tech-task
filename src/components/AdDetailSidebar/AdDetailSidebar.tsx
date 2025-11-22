import { Card, Button, Space } from 'antd'
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons'
import { Advertisement } from '@/types'
import { ModerationHistory } from '@/components/ModerationHistory'
import styles from './AdDetailSidebar.module.css'

interface AdDetailSidebarProps {
  ad: Advertisement
  onApprove: () => void
  onReject: () => void
  onRequestChanges: () => void
  actionLoading: boolean
}

export const AdDetailSidebar = ({
  ad,
  onApprove,
  onReject,
  onRequestChanges,
  actionLoading,
}: AdDetailSidebarProps) => {
  return (
    <div className={styles.sidebar}>
      <Card title="Панель модератора" className={styles.moderatorPanel}>
        <Space direction="vertical" size="middle" style={{ width: '100%' }}>
          <Button
            type="primary"
            icon={<CheckCircleOutlined />}
            onClick={onApprove}
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
            onClick={onReject}
            disabled={ad.status === 'rejected'}
            className={styles.rejectButton}
            block
            size="large"
          >
            {ad.status === 'rejected' ? 'Уже отклонено' : 'Отклонить (D)'}
          </Button>
          <Button
            icon={<ExclamationCircleOutlined />}
            onClick={onRequestChanges}
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
  )
}
