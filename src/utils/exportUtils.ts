import Papa from 'papaparse'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import { StatsSummary } from '@/types'

/**
 * Экспорт статистики в CSV
 * Генерирует файл с общей сводкой, активностью по дням и распределением решений
 */
export const exportToCSV = (
  summary: StatsSummary,
  activityData: any[],
  decisionsData: any[],
  period: string
) => {
  // Собираем все данные в один массив для CSV
  const csvData = [
    ['Moderator Statistics'],
    ['Period:', getPeriodLabel(period)],
    ['Export date:', new Date().toLocaleString('ru-RU')],
    [],

    ['Overall Statistics'],
    ['Metric', 'Value'],
    ['Total reviewed', summary.totalReviewed],
    ['Approved', Math.trunc(summary.approvedPercentage * summary.totalReviewed)],
    ['Rejected', Math.trunc(summary.rejectedPercentage * summary.totalReviewed)],
    ['Changes requested', Math.trunc(summary.requestChangesPercentage * summary.totalReviewed)],
    ['Approval rate', `${summary.approvedPercentage}%`],
    ['Average review time', `${Math.round(summary.averageReviewTime / 60_000)} min`],
    [],

    ['Daily Activity'],
    ['Date', 'Reviewed'],
    ...activityData.map((item) => [item.date, item.count]),
    [],

    ['Decisions Distribution'],
    ['Decision', 'Percentage'],
    Object.entries(decisionsData).map(([key, value]) => [key, `${value}%`]),
  ]

  const csv = Papa.unparse(csvData)

  // BOM для корректного отображения кириллицы в Excel
  const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  const url = URL.createObjectURL(blob)

  link.setAttribute('href', url)
  link.setAttribute('download', `moderator_stats_${period}_${Date.now()}.csv`)
  link.style.visibility = 'hidden'

  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

/**
 * Экспорт в PDF с таблицами
 * Использует jspdf-autotable для красивого форматирования
 */
export const exportToPDF = (
  summary: StatsSummary,
  activityData: any[],
  decisionsData: any[],
  period: string
) => {
  const doc = new jsPDF()
  let yPosition = 20

  // Шапка документа
  doc.setFontSize(18)
  doc.text('Moderator Statistics', 14, yPosition)
  yPosition += 10

  doc.setFontSize(11)
  doc.text(`Period: ${getPeriodLabel(period)}`, 14, yPosition)
  yPosition += 6
  doc.text(`Export date: ${new Date().toLocaleString('ru-RU')}`, 14, yPosition)
  yPosition += 15

  // Общая статистика
  doc.setFontSize(14)
  doc.text('Overall Statistics', 14, yPosition)
  yPosition += 7

  autoTable(doc, {
    startY: yPosition,
    head: [['Metric', 'Value']],
    body: [
      ['Total reviewed', summary.totalReviewed],
      ['Approved', Math.trunc(summary.approvedPercentage * summary.totalReviewed).toString()],
      ['Rejected', Math.trunc(summary.rejectedPercentage * summary.totalReviewed).toString()],
      [
        'Changes requested',
        Math.trunc(summary.requestChangesPercentage * summary.totalReviewed).toString(),
      ],
      ['Approval rate', `${summary.approvedPercentage}%`],
      ['Average review time', `${summary.averageReviewTime} min`],
    ],
    theme: 'grid',
    headStyles: { fillColor: [24, 144, 255] },
  })

  yPosition = (doc as any).lastAutoTable.finalY + 15

  // График активности
  doc.setFontSize(14)
  doc.text('Daily Activity', 14, yPosition)
  yPosition += 7

  autoTable(doc, {
    startY: yPosition,
    head: [['Date', 'Reviewed']],
    body: activityData.map((item) => [
      item.date,
      (item.approved + item.rejected + item.requestChanges).toString(),
    ]),
    theme: 'grid',
    headStyles: { fillColor: [24, 144, 255] },
  })

  yPosition = (doc as any).lastAutoTable.finalY + 15

  // Переходим на новую страницу если места не хватает
  if (yPosition > 250) {
    doc.addPage()
    yPosition = 20
  }

  doc.setFontSize(14)
  doc.text('Decisions Distribution', 14, yPosition)
  yPosition += 7

  autoTable(doc, {
    startY: yPosition,
    head: [['Decision', 'Count']],
    body: Object.entries(decisionsData).map(([key, value]) => [key, `${value}%`]),
    theme: 'grid',
    headStyles: { fillColor: [24, 144, 255] },
  })

  doc.save(`moderator_stats_${period}_${Date.now()}.pdf`)
}

// Вспомогательная функция для лейблов
function getPeriodLabel(period: string): string {
  switch (period) {
    case 'today':
      return 'Today'
    case 'week':
      return 'Last 7 days'
    case 'month':
      return 'Last 30 days'
    default:
      return period
  }
}
