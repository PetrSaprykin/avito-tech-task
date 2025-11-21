export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleString('ru-RU', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('ru-RU').format(price)
}
