import Router from 'next/router';
import Link from 'next/link';
import { useEffect, useState, useRef } from 'react';

import { IoWallet, IoCheckmarkCircle, IoStar } from 'react-icons/io5';
import { FaTruck, FaPlusCircle } from 'react-icons/fa';

import OrderFetcher from '@/utils/functions/order-fetcher';
import CommonErrorModal from '@/components/common/common-error-modal';

export default function OfflineOrderScreen({ isMarketing }) {
  const [fetching, setFetching] = useState(false);
  const [loadMore, setLoadMore] = useState(false);
  const [limit, setLimit] = useState(false);
  const [error, setError] = useState('');
  const [offlineOrder, setOfflineOrder] = useState([]);
  const [page, setPage] = useState(2);

  const loadMoreData = () => {
    setLoadMore(true);
    OrderFetcher.fetchOrders(page, '', 'offline').then(({ data, error, route }) => {
      if (data) {
        setOfflineOrder([...offlineOrder, ...data]);
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
    OrderFetcher.fetchOrders(1, '', 'offline').then(({ data, error, route }) => {
      if (data) setOfflineOrder(data);
      else if (error) setError(error);
      else if (route) Router.push(route);
    }).catch((e) => {
      setError(e.message);
    }).finally(() => {
      setFetching(false);
    })
  }, [])

  return <>
  <div className='p-6 bg-white/80 h-full backdrop-blur-md overflow-hidden'>
    <h1 className='text-xl font-semibold'>
      Data Pemesanan (Offline)
    </h1>
    <div className='mt-2 w-max'>
      {
        isMarketing &&
        <Link href='/org/orders/add-order'>
          <a className='bg-primary text-white px-4 py-2 rounded-md
          hover:opacity-70 active:opacity-40 transition-all flex items-center gap-2'>
            <FaPlusCircle /> Tambah
          </a>
        </Link>
      }
    </div>
    <div className={`mt-4 overflow-auto border rounded-lg p-4 bg-white/40 shadow-md
      ${isMarketing ? 'h-[calc(100vh-260px)]' : 'h-[calc(100vh-210px)]'}`}>
      {
        fetching ?
        <h2 className='text-primary text-lg font-semibold animate-bounce'>
          Loading...
        </h2>
        :
        offlineOrder.length === 0 ?
        <p>
          Data pemesanan kosong.
        </p>
        :
        <>
          {
            offlineOrder.map((Order) => {
              const { 
                productPrice,
                shipmentPrice,
                codePrice,
                status,
                qty,
                products: Product,
              } = Order.orderdetail;

              return <div key={Order.id} onClick={() => Router.push(`/org/orders/offline/${Order.id}`)}
                className='flex cursor-pointer items-center justify-between shadow-md px-4 py-4
                rounded-md bg-white/30 hover:bg-slate-100 active:opacity-40 mb-3 transition-all'>
                <div className='overflow-clip w-40'>
                  <p className='text-xs text-slate-400'>
                    Nama Produk
                  </p>
                  <p>
                    {Product.name}
                  </p>
                </div>
                <div className='overflow-clip w-20'>
                  <p className='text-xs text-slate-400'>
                    Kuantitas
                  </p>
                  <p>
                    {qty}
                  </p>
                </div>
                <div className='overflow-clip w-40'>
                  <p className='text-xs text-slate-400'>
                    Total Harga
                  </p>
                  <p>
                    Rp {productPrice + shipmentPrice + codePrice}
                  </p>
                </div>
                <div className='w-52'>
                  <div className='flex items-center gap-2'>
                    <IoWallet size={20} 
                      className={`${status === 'belum dibayar' && 'text-primary'}`}
                    />
                    <IoCheckmarkCircle size={20}
                      className={`${status === 'dikonfirmasi' && 'text-primary'}`}
                    />
                    <FaTruck size={20} 
                      className={`${status === 'dikirim' && 'text-primary'}`}
                    />
                    <IoStar size={20}
                      className={`${status === 'diterima' && 'text-primary'}`}
                    />
                  </div>
                </div>
                <div className='overflow-clip w-40'>
                  <button type='button'
                    className='bg-primary text-white px-4 py-2 rounded-full
                    hover:opacity-70 active:opacity-40 transition-all'
                    onClick={(event) => {
                      event.stopPropagation();
                      Router.push(`/org/orders/offline/${Order.id}/edit`)
                    }}>
                    Ubah
                  </button>
                </div>
              </div>
            })
          }
          {
            !limit ?
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
        </>
      }
    </div>
    <div className='mt-2 ml-2'>
      <Link href='/org/orders'>
        <a className='text-primary hover:underline active:opacity-40'>
          Cek pemesanan secara online
        </a>
      </Link>
    </div>
  </div>
    {
      error &&
      <CommonErrorModal text={error} onClick={() => setError('')}/>
    }
  </>
}