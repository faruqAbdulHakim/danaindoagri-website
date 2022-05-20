import Router from 'next/router';
import Link from 'next/link';
import { useEffect, useState, useRef } from 'react';

import { IoWallet, IoCheckmarkCircle, IoStar } from 'react-icons/io5';
import { FaTruck } from 'react-icons/fa';

import OrderFetcher from '@/utils/functions/order-fetcher';
import CommonErrorModal from '@/components/common/common-error-modal';

export default function OnlineOrderScreen() {
  const [fetching, setFetching] = useState(false);
  const [loadMore, setLoadMore] = useState(false);
  const [limit, setLimit] = useState(false);
  const [error, setError] = useState('');
  const [onlineOrder, setOnlineOrder] = useState([]);
  const [page, setPage] = useState(2);

  const searchInputRef = useRef(null);

  const searchHandler = (event) => {
    event.preventDefault();
    setFetching(true);
    const searchText = searchInputRef.current.value;
    OrderFetcher.fetchOnlineOrders(1, searchText).then(({ data, error, route }) => {
      if (data) setOnlineOrder(data);
      else if (error) setError(error);
      else if (route) Router.push(route);
    }).catch((e) => {
      setError(e.message);
    }).finally(() => {
      setLimit(false);
      setFetching(false);
      setPage(2);
    })
  }

  const loadMoreData = () => {
    setLoadMore(true);
    const searchText = searchInputRef.current.value
    OrderFetcher.fetchOnlineOrders(page, searchText).then(({ data, error, route }) => {
      if (data) {
        setOnlineOrder([...onlineOrder, ...data]);
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
    OrderFetcher.fetchOnlineOrders(1, '').then(({ data, error, route }) => {
      if (data) setOnlineOrder(data);
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
      Data Pemesanan
    </h1>
    <form onSubmit={searchHandler} className='flex items-center gap-4 mt-4'>
      <input type='text' name='searchQuery' placeholder='Cari berdasarkan nama customer' ref={searchInputRef}
        className='border px-4 py-2 flex-1 max-w-sm hover:shadow-md focus:shadow-md hover:bg-slate-100 
        focus:bg-slate-200 rounded-md outline-none transition-all'/>
      <button className='bg-primary text-white px-4 py-2 rounded-md
        hover:opacity-70 active:opacity-40 transition-all'
        type='submit'
        >
        Cari
      </button>
    </form>
    <div className='mt-2 h-[calc(100vh-240px)] overflow-auto border rounded-lg p-4 bg-white/40 shadow-md'>
      {
        fetching ?
        <h2 className='text-primary text-lg font-semibold animate-bounce'>
          Loading...
        </h2>
        :
        onlineOrder.length === 0 ?
        <p>
          Data pemesanan kosong.
        </p>
        :
        <>
          {
            onlineOrder.map((Order) => {
              const { 
                productPrice,
                shipmentPrice,
                codePrice,
                status,
                qty,
                products: Product,
              } = Order.orderdetail;

              return <Link key={Order.id} href={`/org/orders/online-order/${Order.id}`}>
              <a key={Order.id} className='flex items-center justify-between shadow-md px-4 py-4
                rounded-md bg-white/30 hover:bg-slate-100 active:opacity-40 mb-3 transition-all'>
                <div className='overflow-clip w-32'>
                  <p className='text-xs text-slate-400'>
                    Nama Customer
                  </p>
                  <p>
                    {Order?.users?.fullName}
                  </p>
                </div>
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
              </a>
              </Link>
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
  </div>
    {
      error &&
      <CommonErrorModal text={error} onClick={() => setError('')}/>
    }
  </>
}