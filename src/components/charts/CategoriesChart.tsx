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

interface CategoriesChartProps {
  data: Record<string, number>
}

const CategoriesChart = ({ data }: CategoriesChartProps) => {
  const chartData = {
    labels: Object.keys(data),
    datasets: [
      {
        label: 'Количество проверенных',
        data: Object.values(data),
        backgroundColor: '#1890ff',
      },
    ],
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    indexAxis: 'y' as const,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      x: {
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

export default CategoriesChart
