import { Pie } from 'react-chartjs-2'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'

ChartJS.register(ArcElement, Tooltip, Legend)

interface DecisionsChartProps {
  data: any
}

const DecisionsChart = ({ data }: DecisionsChartProps) => {
  if (!data) return null

  const chartData = {
    labels: ['Одобрено', 'Отклонено', 'На доработку'],
    datasets: [
      {
        data: [data.approved, data.rejected, data.requestChanges],
        backgroundColor: ['#52c41a', '#ff4d4f', '#faad14'],
        borderWidth: 2,
        borderColor: '#fff',
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
  }

  return (
    <div style={{ height: '300px' }}>
      <Pie data={chartData} options={options} />
    </div>
  )
}

export default DecisionsChart
