import Router from 'next/router';
import { useState, useRef, useEffect } from 'react';

import OrderFetcher from '@/utils/functions/order-fetcher';
import CommonErrorModal from '@/components/common/common-error-modal';
import CommonSuccessModal from '@/components/common/common-success-modal';
import CommonModal from '@/components/common/common-modal';

export default function ReceiptNumberScreen() {
  //fetching
  const [fetching, setFetching] = useState(false);
  const [loadMore, setLoadMore] = useState(false);
  const [insertFetching, setInsertFetching] = useState(false);
  //state
  const [limit, setLimit] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [confirmedOrder, setConfirmedOrder] = useState([]);
  const [page, setPage] = useState(2);
  const [insert, setInsert] = useState(null); // orderId

  const searchInputRef = useRef(null);
  const receiptNumberRef = useRef(null);

  const searchHandler = (event) => {
    event.preventDefault();
    setFetching(true);

    OrderFetcher.fetchConfirmedOrder(
      1,
      searchInputRef.current.value
    )
      .then(({ data, error, route }) => {
      if (data) setConfirmedOrder(data);
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
    
    OrderFetcher.fetchConfirmedOrder(
      page,
      searchInputRef.current.value
    )
      .then(({ data, error, route }) => {
        if (data) {
          setConfirmedOrder([...confirmedOrder, ...data]);
          if (data.length === 0) setLimit(true);
        }
        else if (error) setError(error);
        else if (route) Router.push(route);
      })
      .catch((e) => {
        setError(e.message);
      })
      .finally(() => {
        setLoadMore(false);
        setPage(page + 1);
      })
  }

  const insertReceiptNumber = (event) => {
    event.preventDefault();
    setInsertFetching(true);

    OrderFetcher.postReceiptNumber(
      insert, receiptNumberRef.current.value
    ).then(({ data, error, route }) => {
      if (data) setSuccess(data);
      else if (error) setError(error);
      else if (route) Router.push(route)
    }).catch((e) => setError(e.message))
    .finally(() => setInsertFetching(false));
  }

  useEffect(() => {
    setFetching(true);
    OrderFetcher.fetchConfirmedOrder(1, '')
    .then(({ data, error, route }) => {
      if (data) setConfirmedOrder(data);
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
      Nomor Resi
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
        confirmedOrder.length === 0 ?
        <p>
          Data pemesanan kosong.
        </p>
        :
        <>
          {
            confirmedOrder.map((Order) => {
              const { 
                productPrice,
                shipmentPrice,
                codePrice,
                qty,
                products: Product,
              } = Order.orderdetail;

              return <div key={Order.id} 
                className='flex items-center justify-between shadow-md px-4 py-4
                rounded-md bg-white/30 mb-3 hover:bg-slate-100 transition-all'
                onClick={() => Router.push(`/org/orders/online/${Order.id}`)}>
                <div className='overflow-clip w-40'>
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
                <div className='overflow-clip w-16'>
                  <p className='text-xs text-slate-400'>
                    Kuantitas
                  </p>
                  <p>
                    {qty}
                  </p>
                </div>
                <div className='overflow-clip w-36'>
                  <p className='text-xs text-slate-400'>
                    Total Harga
                  </p>
                  <p>
                    Rp {productPrice + shipmentPrice + codePrice}
                  </p>
                </div>
                <div className='w-36'>
                  <div className='flex justify-end items-center gap-2'>
                    <button type='button'
                    className='border-2 rounded-full border-primary px-4 py-2 bg-primary text-white
                    hover:opacity-70 active:opacity:40 transition-all'
                    onClick={(event) => {
                      event.stopPropagation();
                      setInsert(Order.id);
                    }}>
                      Input No Resi
                    </button>
                  </div>
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
  </div>
    {
      insert &&
      <CommonModal>
        <form onSubmit={insertReceiptNumber} className='px-6 py-4 flex flex-col items-center'>
          <h2 className='text-xl font-semibold text-center'>
            Tambah Nomor Resi
          </h2>
          <input ref={receiptNumberRef} type='text' className='min-w-0 mt-6 outline-none border-b-2 text-center px-4 py-1
            focus:border-b-primary' placeholder='Nomor Resi'/>
          <div className='flex flex-wrap justify-evenly gap-10 mt-4'>
            <button type='button' 
              className='bg-gray-400 hover:bg-red-600 disabled:hover:bg-gray-400 w-28 py-3 rounded-full text-white 
              transition-all duration-200'
              onClick={() => setInsert(null)}
              disabled={insertFetching}
            >
              Batal
            </button>
            <button type='submit' 
              className='bg-gradient-to-br from-primary to-primary/40 hover:to-primary/70 disabled:from-gray-400 
              disabled:to-gray-200 w-28 py-3 rounded-full text-white transition-all duration-200'
              disabled={insertFetching}
            >
              Simpan
            </button>
          </div>
        </form>
      </CommonModal> 
    }
    {
      error &&
      <CommonErrorModal text={error} onClick={() => setError('')}/>
    }
    {
      success &&
      <CommonSuccessModal text={success} onClick={() => Router.reload()} />
    }
  </>
}
