import { useEffect } from 'react';

import { Chart, ArcElement, Title, Legend, SubTitle, Tooltip } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import DateHelper from '@/utils/functions/date-helper';

export default function FinancesChart({ finances, format }) {
  useEffect(() => {
    Chart.register(ArcElement);
    Chart.register(Title);
    Chart.register(Legend);
    Chart.register(SubTitle);
    Chart.register(Tooltip);
  }, []);
  return (
    <Doughnut
      options={{
        maintainAspectRatio: false,
        plugins: {
          title: {
            display: true,
            text: `Keuangan ${
              format.format === 'daily'
                ? DateHelper.monthString(format.month) + ' ' + format.year
                : format.format === 'monthly'
                ? 'Tahun ' + format.year
                : 'Tahunan'
            }`,
            color: 'black',
            position: 'top',
            align: 'start',
            font: {
              size: '20px',
            },
          },
          legend: {
            display: finances.length > 0,
            position: 'bottom',
          },
          subtitle: {
            display: finances.length === 0,
            text: 'Data Kosong',
            position: 'top',
            align: 'center',
          },
        },
      }}
      data={{
        labels: ['Pemasukan', 'Pengeluaran'],
        datasets: [
          {
            label: 'Keuangan',
            backgroundColor: ['#66BB6A', '#E74C3C'],
            data: [
              finances.reduce((a, b) => {
                return a + (b.revenue || 0);
              }, 0) || 0,
              finances.reduce((a, b) => {
                return a + (b.expense || 0);
              }, 0) || 0,
            ],
          },
        ],
      }}
    />
  );
}
