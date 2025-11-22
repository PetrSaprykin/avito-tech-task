export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleString('ru-RU', {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
  })
}

export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('ru-RU').format(price)
}

export const formatTitle = (title: string): string => {
  return title.split(':')[1].trim()
}

export const formatDescription = (description: string): string => {
  return description.split('. ').slice(1).join('. ')
}
