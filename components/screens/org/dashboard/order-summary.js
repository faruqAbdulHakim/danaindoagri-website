import Router from 'next/router';
import { useState, useEffect } from 'react';

import { IoWallet, IoCheckmarkCircle, IoStar } from 'react-icons/io5';
import { FaTruck } from 'react-icons/fa';

export default function OrderSummary({ setError }) {
  const [fetching, setFetching] = useState(false);
  const [order, setOrder] = useState({});

  useEffect(() => {
    setFetching(true);
    fetch('/api/dashboard/order-summary')
      .then((res) => res.json())
      .then((resJson) => {
        if (resJson.status === 200) setOrder(resJson.data);
        else if (resJson.status === 300) Router.push(resJson.location);
        else throw new Error(resJson.message);
      })
      .catch((e) => setError(e.message))
      .finally(() => setFetching(false));
  }, [setError]);

  return (
    <div>
      <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white/70 rounded-lg shadow-md p-3 flex gap-2">
          <div className="bg-[#4791FF]/20 p-2 rounded-md flex items-center justify-center">
            <IoWallet size={22} />
          </div>
          {fetching ? (
            <p className="text-primary animate-bounce">Loading</p>
          ) : (
            <div>
              <p className="text-sm text-slate-400">Pesanan Masuk</p>
              <p className="font-semibold">{order['belum dibayar']}</p>
            </div>
          )}
        </div>
        <div className="bg-white/70 rounded-lg shadow-md p-3 flex gap-2">
          <div className="bg-[#FFD950]/20 p-2 rounded-md flex items-center justify-center">
            <IoCheckmarkCircle size={22} />
          </div>
          {fetching ? (
            <p className="text-primary animate-bounce">Loading</p>
          ) : (
            <div>
              <p className="text-sm text-slate-400">Pesanan Diproses</p>
              <p className="font-semibold">{order.dikonfirmasi}</p>
            </div>
          )}
        </div>
        <div className="bg-white/70 rounded-lg shadow-md p-3 flex gap-2">
          <div className="bg-[#FF2366]/20 p-2 rounded-md flex items-center justify-center">
            <FaTruck size={22} />
          </div>
          {fetching ? (
            <p className="text-primary animate-bounce">Loading</p>
          ) : (
            <div>
              <p className="text-sm text-slate-400">Pesanan Dikirim</p>
              <p className="font-semibold">{order.dikirim}</p>
            </div>
          )}
        </div>
        <div className="bg-white/70 rounded-lg shadow-md p-3 flex gap-2">
          <div className="bg-[#02BC77]/20 p-2 rounded-md flex items-center justify-center">
            <IoStar size={22} />
          </div>
          {fetching ? (
            <p className="text-primary animate-bounce">Loading</p>
          ) : (
            <div>
              <p className="text-sm text-slate-400">Pesanan Selesai</p>
              <p className="font-semibold">{order.diterima}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
