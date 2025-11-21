import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons'

interface StatusConfig {
  color: string
  text: string
  icon?: React.ReactNode
}

export const getStatusConfig = (status: string): StatusConfig => {
  const configs: Record<string, StatusConfig> = {
    pending: {
      color: 'orange',
      text: 'На модерации',
      icon: <ExclamationCircleOutlined />,
    },
    approved: {
      color: 'green',
      text: 'Одобрено',
      icon: <CheckCircleOutlined />,
    },
    rejected: {
      color: 'red',
      text: 'Отклонено',
      icon: <CloseCircleOutlined />,
    },
    draft: {
      color: 'default',
      text: 'Черновик',
    },
  }

  return configs[status] || configs.draft
}
