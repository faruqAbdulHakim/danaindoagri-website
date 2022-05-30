import Router from 'next/router';
import { useState, useEffect } from 'react';

import OrderFetcher from '@/utils/functions/order-fetcher';
import CommonErrorModal from '@/components/common/common-error-modal';

export default function RevenueListScreen() {
  const [fetching, setFetching] = useState(false);
  const [loadMore, setLoadMore] = useState(false);
  const [limit, setLimit] = useState(false);
  const [error, setError] = useState('');
  const [revenueList, setRevenueList] = useState([]);
  const [page, setPage] = useState(2);

  const loadMoreData = () => {
    setLoadMore(true);
    OrderFetcher.fetchOrders(page, '', 'all').then(({ data, error, route }) => {
      if (data) {
        setRevenueList([...revenueList, ...data]);
        if (data.length === 0) setLimit(true);
      }
      else if (error) setError(error);
      else if (route) Router.push(route);
    }).catch((e) => {
      setError(e.message);
    }).finally(() => {
      setLoadMore(false);
      setPage(page + 1);
    })
  }

  useEffect(() => {
    setFetching(true);
    OrderFetcher.fetchOrders(1, '', 'all').then(({ data, error, route }) => {
      if (data) setRevenueList(data);
      else if (error) setError(error);
      else if (route) Router.push(route);
    }).catch((e) => {
      setError(e.message);
    }).finally(() => {
      setFetching(false);
    })
  }, [])

  return <>
  <div className='bg-white/80 backdrop-blur-md h-full p-6'>
    <h1 className='text-lg font-semibold'>
      Data Pendapatan
    </h1>
    <div className='mt-4 border rounded-md shadow-md h-[calc(100vh-180px)] overflow-y-scroll 
      p-4 flex flex-col gap-4'>
      {
        fetching &&
        <p className='text-primary'>
          Loading...
        </p>
      }
      {
        revenueList.map((OrderDetail) => {
          return <div key={OrderDetail.id} className='flex justify-between gap-2 border rounded-md 
            p-4 bg-white/30 shadow-md hover:bg-slate-100 active:opacity-40 transition-all cursor-pointer'
            onClick={() => Router.push(`/org/revenue/${OrderDetail.id}`)}>
            <div className='w-44 overflow-clip'>
              <p className='text-xs text-slate-400'>
                Produk
              </p>
              <p>
                {OrderDetail.products.name}
              </p>
            </div>
            <div className='w-36 overflow-clip'>
              <p className='text-xs text-slate-400'>
                Tanggal
              </p>
              <p>
                {new Date(OrderDetail.createdAt).toLocaleString('in-ID', {timeZone: 'Asia/Jakarta', dateStyle: 'short'})}
              </p>
            </div>
            <div className='w-36 overflow-clip'>
              <p className='text-xs text-slate-400'>
                Jumlah Pesanan
              </p>
              <p>
                {OrderDetail.qty}
              </p>
            </div>
            <div className='w-44 overflow-clip'>
              <p className='text-xs text-slate-400'>
                Total Harga
              </p>
              <p className='text-primary'>
                Rp {OrderDetail.productPrice + OrderDetail.shipmentPrice + OrderDetail.codePrice}
              </p>
            </div>
          </div>
        })
      }
      {
        !limit ?
        !fetching &&
        <button type='button'
          className='block mt-4 ml-auto bg-primary disabled:bg-slate-600 hover:opacity-70 active:opacity-40
            px-4 py-2 rounded-md text-white transition-all'
          onClick={loadMoreData}
          disabled={loadMore}
        >
          Muat lebih banyak
        </button>
        :
        <p className='text-sm text-center text-slate-600'>
          Telah menampilkan seluruh data
        </p>
      }
    </div>
  </div>
  {
    error &&
    <CommonErrorModal text={error} onClick={() => setError('')}/>
  }
  </>
}