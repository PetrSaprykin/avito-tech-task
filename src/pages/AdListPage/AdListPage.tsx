import { useState, useEffect, useRef } from 'react'
import { Select, Pagination, Spin, InputRef, Button } from 'antd'
import { InboxOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import { useHotkeys } from '@/hooks/useHotkeys'
import { useDebounce } from '@/hooks/useDebounce'
import { useAdFilters } from '@/hooks/useAdFilters'
import { AdCard } from '@/components/AdCard'
import { AdFilters } from '@/components/AdFilters/AdFilters'
import { useBulkActions } from '@/hooks/useBulkActions'
import { ModerationModal } from '@/components/ModerationModal'
import { BulkActionsPanel } from '@/components/BulkActionsPanel'

import { useUrlFilters } from '@/hooks/useUrlFilters'
import { getAds } from '@/api/ads'
import { Advertisement, Pagination as PaginationType } from '@/types'
import styles from './AdListPage.module.css'

const SORT_OPTIONS = [
  { label: 'По дате создания', value: 'createdAt' },
  { label: 'По цене', value: 'price' },
  { label: 'По приоритету', value: 'priority' },
]

const SORT_ORDER_OPTIONS = [
  { label: 'По возрастанию', value: 'asc' },
  { label: 'По убыванию', value: 'desc' },
]

export const AdListPage = () => {
  const navigate = useNavigate()
  const searchInputRef = useRef<InputRef>(null)

  const [ads, setAds] = useState<Advertisement[]>([])
  const [pagination, setPagination] = useState<PaginationType | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)

  const {
    selectedStatuses,
    setSelectedStatuses,
    selectedCategory,
    setSelectedCategory,
    minPrice,
    setMinPrice,
    maxPrice,
    setMaxPrice,
    searchInput,
    setSearchInput,
    sortBy,
    setSortBy,
    sortOrder,
    setSortOrder,
    resetFilters,
    getFilterParams,
  } = useAdFilters()

  const debouncedSearch = useDebounce(searchInput, 500)

  useUrlFilters({
    selectedStatuses,
    setSelectedStatuses,
    selectedCategory,
    setSelectedCategory,
    minPrice,
    setMinPrice,
    maxPrice,
    setMaxPrice,
    searchInput,
    setSearchInput,
    sortBy,
    setSortBy,
    sortOrder,
    setSortOrder,
    currentPage,
    setCurrentPage,
  })

  useEffect(() => {
    const abortController = new AbortController()

    loadAds(abortController.signal)

    return () => {
      abortController.abort()
    }
  }, [
    currentPage,
    selectedStatuses,
    selectedCategory,
    minPrice,
    maxPrice,
    debouncedSearch,
    sortBy,
    sortOrder,
  ])

  const loadAds = async (signal?: AbortSignal) => {
    setLoading(true)
    setError(null)

    try {
      const params = {
        page: currentPage,
        limit: 10,
        ...getFilterParams(debouncedSearch),
      }
      const response = await getAds(params, signal)
      setAds(response.ads)
      setPagination(response.pagination)
    } catch (err: any) {
      if (err.name === 'CanceledError' || err.code === 'ERR_CANCELED') {
        return
      }
      const errorMessage = 'Не удалось загрузить объявления. Попробуйте позже'
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const {
    selectedIds,
    bulkActionLoading,
    rejectModalOpen,
    setRejectModalOpen,
    handleSelectAd,
    clearSelection,
    handleBulkApprove,
    openRejectModal,
    handleBulkReject,
  } = useBulkActions({
    onActionComplete: loadAds,
  })

  const handleResetFilters = () => {
    if (selectedCategory || selectedStatuses.length > 0 || minPrice || maxPrice) {
      resetFilters()
      setCurrentPage(1)
    }
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleCardClick = (id: number) => {
    navigate(`/item/${id}`)
  }

  useHotkeys({
    '/': () => {
      searchInputRef.current?.focus()
    },
  })

  if (error && !loading) {
    return (
      <div className={styles.errorContainer}>
        <div className={styles.error}>
          <p className={styles.errorText}>{error}</p>
          <Button onClick={() => loadAds()} className={styles.retryButton}>
            Попробовать снова
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Список объявлений</h1>
      </div>
      <AdFilters
        searchQuery={searchInput}
        onSearchChange={setSearchInput}
        onSearchSubmit={() => {}}
        selectedStatuses={selectedStatuses}
        onStatusesChange={setSelectedStatuses}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        minPrice={minPrice}
        onMinPriceChange={setMinPrice}
        maxPrice={maxPrice}
        onMaxPriceChange={setMaxPrice}
        onResetFilters={handleResetFilters}
        searchInputRef={searchInputRef}
      />
      <div className={styles.sortSection}>
        <div className={styles.totalCount}>
          {pagination && `Всего объявлений: ${pagination.totalItems}`}
        </div>
        <div className={styles.sortControls}>
          <Select
            value={sortBy}
            onChange={setSortBy}
            options={SORT_OPTIONS}
            style={{ width: 200 }}
          />
          <Select
            value={sortOrder}
            onChange={setSortOrder}
            options={SORT_ORDER_OPTIONS}
            style={{ width: 180 }}
          />
        </div>
      </div>
      {loading ? (
        <div className={styles.loading}>
          <Spin size="large" />
        </div>
      ) : ads.length > 0 ? (
        <>
          <div className={styles.adsList}>
            {ads.map((ad) => (
              <AdCard
                key={ad.id}
                ad={ad}
                onClick={() => handleCardClick(ad.id)}
                selectable={ad.status === 'pending'}
                selected={selectedIds.has(ad.id)}
                onSelect={(checked) => handleSelectAd(ad.id, checked)}
              />
            ))}
          </div>

          {pagination && pagination.totalPages > 1 && (
            <div className={styles.pagination}>
              <Pagination
                current={currentPage}
                total={pagination.totalItems}
                pageSize={pagination.itemsPerPage}
                onChange={handlePageChange}
                showSizeChanger={false}
                showTotal={(total) => `Всего ${total} объявлений`}
              />
            </div>
          )}
        </>
      ) : (
        <div className={styles.empty}>
          <InboxOutlined className={styles.emptyIcon} />
          <p className={styles.emptyText}>
            Объявления не найдены. Попробуйте изменить параметры фильтрации.
          </p>
        </div>
      )}

      {selectedIds.size > 0 && (
        <BulkActionsPanel
          selectedCount={selectedIds.size}
          onApprove={handleBulkApprove}
          onReject={openRejectModal}
          onCancel={clearSelection}
          loading={bulkActionLoading}
        />
      )}
      <ModerationModal
        visible={rejectModalOpen}
        title="Массовое отклонение"
        selectedCount={selectedIds.size}
        onOk={handleBulkReject}
        onCancel={() => setRejectModalOpen(false)}
        loading={bulkActionLoading}
        isDanger
      />
    </div>
  )
}
