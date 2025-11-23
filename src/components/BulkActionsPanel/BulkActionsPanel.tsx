import { Button } from 'antd'
import { CheckCircleOutlined, CloseCircleOutlined, CloseOutlined } from '@ant-design/icons'
import styles from './BulkActionsPanel.module.css'

interface BulkActionsPanelProps {
  selectedCount: number
  onApprove: () => void
  onReject: () => void
  onCancel: () => void
  loading: boolean
}

export const BulkActionsPanel = ({
  selectedCount,
  onApprove,
  onReject,
  onCancel,
  loading,
}: BulkActionsPanelProps) => {
  if (selectedCount === 0) return null

  return (
    <div className={styles.bulkActionsPanel}>
      <div className={styles.bulkActionsContent}>
        <span className={styles.selectedCount}>Выбрано: {selectedCount}</span>
        <div className={styles.bulkActionsButtons}>
          <Button
            type="primary"
            icon={<CheckCircleOutlined />}
            onClick={onApprove}
            loading={loading}
            size="middle"
            className={styles.approveButton}
          >
            Одобрить
          </Button>
          <Button
            danger
            icon={<CloseCircleOutlined />}
            onClick={onReject}
            loading={loading}
            size="middle"
            className={styles.rejectButton}
          >
            Отклонить
          </Button>
          <Button
            icon={<CloseOutlined />}
            onClick={onCancel}
            disabled={loading}
            size="middle"
            className={styles.cancelButton}
          >
            Отменить
          </Button>
        </div>
      </div>
    </div>
  )
}
