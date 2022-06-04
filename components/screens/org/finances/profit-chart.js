import { useEffect } from 'react';

import {
  Chart,
  Title,
  Legend,
  SubTitle,
  Tooltip,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

import DateHelper from '@/utils/functions/date-helper';

export default function ProfitChart({ finances, format }) {
  useEffect(() => {
    Chart.register(Title);
    Chart.register(Legend);
    Chart.register(SubTitle);
    Chart.register(Tooltip);
    Chart.register(CategoryScale);
    Chart.register(LinearScale);
    Chart.register(PointElement);
    Chart.register(LineElement);
    Chart.register(Filler);
  }, []);

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
          title: {
            display: true,
            padding: {
              bottom: 20,
            },
            text:
              format.format === 'daily'
                ? `Pendapatan ${DateHelper.monthString(format.month)} ${
                    format.year
                  }`
                : format.format === 'monthly'
                ? `Pendapatan Tahun ${format.year}`
                : 'Pendapatan Tahunan',
            position: 'top',
            align: 'start',
            color: 'black',
            font: {
              size: '18px',
            },
          },
          legend: {
            display: true,
            position: 'bottom',
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
