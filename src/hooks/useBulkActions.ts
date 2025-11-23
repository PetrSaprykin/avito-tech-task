import { useState } from 'react'
import { message } from 'antd'
import { approveAd, rejectAd } from '@/api/ads'

/**
 * Параметры для хука useBulkActions
 */
interface UseBulkActionsProps {
  /** колбэк вызываемый после успешного выполнения массового действия */
  onActionComplete: () => void
}

/**
 * Хук для управления массовыми операциями над объявлениями
 *
 *
 * @param {UseBulkActionsProps} props - Параметры хука
 * @returns Объект с состоянием и методами для управления bulk-операциями
 *
 * @example
 * const {
 *   selectedIds,
 *   handleSelectAd,
 *   handleBulkApprove,
 *   clearSelection
 * } = useBulkActions({
 *   onActionComplete: () => loadAds()
 * })
 */
export const useBulkActions = ({ onActionComplete }: UseBulkActionsProps) => {
  /** Множество ID выбранных объявлений */
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set())

  /** Флаг загрузки при выполнении массовых операций */
  const [bulkActionLoading, setBulkActionLoading] = useState(false)

  /** Флаг открытия модального окна отклонения */
  const [rejectModalOpen, setRejectModalOpen] = useState(false)

  /**
   * Добавляет или удаляет объявление из списка выбранных
   *
   * @param {number} id - ID объявления
   * @param {boolean} checked - true для добавления, false для удаления
   */
  const handleSelectAd = (id: number, checked: boolean) => {
    setSelectedIds((prev) => {
      const newSet = new Set(prev)
      if (checked) {
        newSet.add(id)
      } else {
        newSet.delete(id)
      }
      return newSet
    })
  }

  /**
   * Очищает список выбранных объявлений
   */
  const clearSelection = () => {
    setSelectedIds(new Set())
  }

  /**
   * Выполняет массовое одобрение выбранных объявлений
   *
   * Процесс:
   * 1. Выполняет параллельные запросы на одобрение
   * 2. Подсчитывает успешные и неудачные операции
   * 3. Показывает уведомления о результатах
   * 4. Очищает выбор и вызывает callback обновления данных
   *
   * @async
   * @returns {Promise<void>}
   */
  const handleBulkApprove = async () => {
    if (selectedIds.size === 0) return

    setBulkActionLoading(true)
    const ids = Array.from(selectedIds)

    try {
      // Выполняем запросы параллельно для оптимизации
      const results = await Promise.allSettled(ids.map((id) => approveAd(id)))

      const successful = results.filter((r) => r.status === 'fulfilled').length
      const failed = results.filter((r) => r.status === 'rejected').length

      if (successful > 0) {
        message.success(`Одобрено объявлений: ${successful}`)
      }
      if (failed > 0) {
        message.error(`Ошибка при одобрении: ${failed}`)
      }

      clearSelection()
      onActionComplete()
    } catch (err) {
      message.error('Ошибка при выполнении операции')
    } finally {
      setBulkActionLoading(false)
    }
  }

  /**
   * Открывает модальное окно для массового отклонения объявлений
   */
  const openRejectModal = () => {
    setRejectModalOpen(true)
  }

  /**
   * Выполняет массовое отклонение выбранных объявлений с указанием причины
   *
   * Процесс:
   * 1. Выполняет параллельные запросы на отклонение с одинаковой причиной
   * 2. Подсчитывает успешные и неудачные операции
   * 3. Показывает уведомления о результатах
   * 4. Закрывает модальное окно, очищает выбор и обновляет данные
   *
   * @async
   * @param {string} reason - Причина отклонения из предустановленного списка
   * @param {string} comment - Дополнительный комментарий модератора
   * @returns {Promise<void>}
   */
  const handleBulkReject = async (reason: string, comment: string) => {
    if (selectedIds.size === 0) return

    setBulkActionLoading(true)
    const ids = Array.from(selectedIds)

    try {
      // Применяем одну и ту же причину ко всем выбранным объявлениям
      const results = await Promise.allSettled(ids.map((id) => rejectAd(id, reason, comment)))

      const successful = results.filter((r) => r.status === 'fulfilled').length
      const failed = results.filter((r) => r.status === 'rejected').length

      if (successful > 0) {
        message.success(`Отклонено объявлений: ${successful}`)
      }
      if (failed > 0) {
        message.error(`Ошибка при отклонении: ${failed}`)
      }

      clearSelection()
      setRejectModalOpen(false)
      onActionComplete()
    } catch (err) {
      message.error('Ошибка при выполнении операции')
    } finally {
      setBulkActionLoading(false)
    }
  }

  return {
    selectedIds,
    bulkActionLoading,
    rejectModalOpen,
    setRejectModalOpen,
    handleSelectAd,
    clearSelection,
    handleBulkApprove,
    openRejectModal,
    handleBulkReject,
  }
}
