import Router from 'next/router';
import { useEffect, useState } from 'react';

import 'chart.js/auto';
import { Line } from 'react-chartjs-2';

import DateHelper from '@/utils/functions/date-helper';

export default function OrderStats({ format, setError }) {
  const [fetching, setFetching] = useState(false);
  const [order, setOrder] = useState([]);
  const [preparedData, setPreparedData] = useState([]);

  useEffect(() => {
    setFetching(true);
    fetch('/api/dashboard/order-stats')
      .then((res) => res.json())
      .then((resJson) => {
        if (resJson.status === 200) setOrder(resJson.data);
        else if (resJson.status === 300) Router.push(resJson.location);
        else throw new Error(resJson.message);
      })
      .catch((e) => setError(e.message))
      .finally(() => setFetching(false));
  }, [setError]);

  useEffect(() => {
    let obj = {};

    switch (format.format) {
      case 'daily':
        order.forEach((X) => {
          const splitedDate = DateHelper.dateSplitter(X.date);
          if (
            splitedDate.month !== format.month ||
            splitedDate.year !== format.year
          )
            return;
          obj[splitedDate.date] = (obj[splitedDate.date] || 0) + 1;
        });
        break;
      case 'monthly':
        order.forEach((X) => {
          const splitedDate = DateHelper.dateSplitter(X.date);
          if (splitedDate.year !== format.year) return;
          obj[splitedDate.month] = (obj[splitedDate.month] || 0) + 1;
        });
        break;
      case 'yearly':
        order.forEach((X) => {
          const splitedDate = DateHelper.dateSplitter(X.date);
          obj[splitedDate.year] = (obj[splitedDate.year] || 0) + 1;
        });
        break;
    }
    setPreparedData(
      Object.entries(obj).map(([key, val]) => {
        return { date: key, totalOrder: val };
      })
    );
  }, [format, order]);

  return (
    <div className="p-3">
      <h2 className="text-lg font-semibold">Statistik Pemesanan</h2>
      <hr className="my-3" />
      <div className="h-[200px]">
        {fetching ? (
          <p className="text-primary animate-bounce">Loading</p>
        ) : (
          <OrderStatsChart orderList={preparedData} format={format} />
        )}
      </div>
    </div>
  );
}

function OrderStatsChart({ orderList, format }) {
  return (
    <Line
      options={{
        maintainAspectRatio: false,
        plugins: {
          subtitle: {
            display: orderList.length === 0,
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
        labels: orderList.map((order) =>
          format.format === 'daily'
            ? order.date
            : format.format === 'monthly'
            ? DateHelper.monthString(order.date)
            : order.date
        ),
        datasets: [
          {
            data: orderList.map((order) => order.totalOrder),
            label: 'Pemesanan',
            borderColor: 'rgba(52, 152, 219, 1)',
            fill: {
              target: 'origin',
              below: 'rgba(52, 152, 219, .3)',
              above: 'rgba(52, 152, 219, .3)',
            },
          },
        ],
      }}
    />
  );
}
