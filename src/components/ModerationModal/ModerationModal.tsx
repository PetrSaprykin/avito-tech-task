import { Modal, Radio, Input, Space } from 'antd'
import { useState } from 'react'
import styles from './ModerationModal.module.css'

const { TextArea } = Input

interface ModerationModalProps {
  visible: boolean
  title: string
  onOk: (reason: string, comment: string) => void
  onCancel: () => void
  loading: boolean
  isDanger?: boolean
  selectedCount?: number // для bulk-операций
}

const reasonOptions = [
  'Запрещенный товар',
  'Неверная категория',
  'Некорректное описание',
  'Проблемы с фото',
  'Подозрение на мошенничество',
  'Другое',
]

export const ModerationModal = ({
  visible,
  title,
  onOk,
  onCancel,
  loading,
  isDanger,
  selectedCount,
}: ModerationModalProps) => {
  const [reason, setReason] = useState('')
  const [comment, setComment] = useState('')

  const handleOk = () => {
    onOk(reason, comment)
    setReason('')
    setComment('')
  }

  const handleCancel = () => {
    onCancel()
    setReason('')
    setComment('')
  }

  const modalTitle = selectedCount ? `${title} (объявлений: ${selectedCount})` : title

  return (
    <Modal
      title={modalTitle}
      open={visible}
      onOk={handleOk}
      onCancel={handleCancel}
      okText={isDanger ? 'Отклонить' : 'Отправить'}
      cancelText="Отмена"
      okButtonProps={{ danger: isDanger, disabled: !reason, className: styles.rejectButton }}
      confirmLoading={loading}
    >
      <Space direction="vertical" size="middle" style={{ width: '100%' }}>
        <div>
          <label>Причина: *</label>
          <Radio.Group
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            style={{
              marginTop: 8,
              display: 'flex',
              flexDirection: 'column',
              gap: 8,
            }}
          >
            {reasonOptions.map((r) => (
              <Radio key={r} value={r}>
                {r}
              </Radio>
            ))}
          </Radio.Group>
        </div>

        {(reason === 'Другое' || !isDanger) && (
          <div>
            <label>Комментарий:</label>
            <TextArea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Дополнительная информация"
              rows={4}
              style={{ marginTop: 8 }}
            />
          </div>
        )}
      </Space>
    </Modal>
  )
}
