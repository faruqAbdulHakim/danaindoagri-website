import 'chart.js/auto';
import { Line } from 'react-chartjs-2';

import DateHelper from '@/utils/functions/date-helper';

export default function ProfitChart({ finances, format }) {
  return (
    <Line
      options={{
        maintainAspectRatio: false,
        plugins: {
          subtitle: {
            display: finances.length === 0,
            text: 'Data Kosong',
            position: 'top',
            align: 'center',
          },
          legend: {
            display: false,
          },
        },
      }}
      data={{
        labels: finances.map((finance) =>
          format.format === 'daily'
            ? DateHelper.dateSplitter(finance.date).date
            : format.format === 'monthly'
            ? DateHelper.monthString(finance.date)
            : finance.date
        ),
        datasets: [
          {
            data: finances.map(
              (finance) => (finance.revenue || 0) - (finance.expense || 0)
            ),
            label: 'Pendapatan',
            borderColor: 'rgba(155, 89, 182, .8)',
            fill: {
              target: 'origin',
              below: 'rgba(155, 89, 182, .3)',
              above: 'rgba(155, 89, 182, .3)',
            },
          },
        ],
      }}
    />
  );
}
