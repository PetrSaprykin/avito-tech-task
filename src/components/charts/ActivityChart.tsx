import { Bar } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

interface ActivityChartProps {
  data: any[]
}

const ActivityChart = ({ data }: ActivityChartProps) => {
  const chartData = {
    labels: data.map((item) => {
      const date = new Date(item.date)
      return date.toLocaleDateString('ru-RU', {
        day: '2-digit',
        month: '2-digit',
      })
    }),
    datasets: [
      {
        label: 'Одобрено',
        data: data.map((item) => item.approved),
        backgroundColor: '#069242',
      },
      {
        label: 'Отклонено',
        data: data.map((item) => item.rejected),
        backgroundColor: '#bd0d10',
      },
      {
        label: 'На доработку',
        data: data.map((item) => item.requestChanges),
        backgroundColor: '#c5880f',
      },
    ],
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
      },
    },
    scales: {
      x: {
        stacked: true,
      },
      y: {
        stacked: true,
        beginAtZero: true,
      },
    },
  }

  return (
    <div style={{ height: '300px' }}>
      <Bar data={chartData} options={options} />
    </div>
  )
}

export default ActivityChart
