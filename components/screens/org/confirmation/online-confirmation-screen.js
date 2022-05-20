import Router from 'next/router';
import Image from 'next/image';
import { useEffect, useState, useRef } from 'react';

import OrderFetcher from '@/utils/functions/order-fetcher';
import CommonErrorModal from '@/components/common/common-error-modal';
import CommonModal from '@/components/common/common-modal';
import CONFIG from '@/global/config';

const { BASE_URL } = CONFIG.SUPABASE.BUCKETS.PROOF_OF_PAYMENT;

export default function OnlineConfirmationScreen() {
  const [fetching, setFetching] = useState(false);
  const [loadMore, setLoadMore] = useState(false);
  const [limit, setLimit] = useState(false);
  const [error, setError] = useState('');
  const [onlineOrder, setOnlineOrder] = useState([]);
  const [page, setPage] = useState(2);
  const [proofAvailability, setProofAvailability] = useState('1');
  const [proofOfPayment, setProofOfPayment] = useState('');

  const searchInputRef = useRef(null);

  const searchHandler = (event) => {
    event.preventDefault();
    setFetching(true);
    const searchText = searchInputRef.current.value;
    OrderFetcher.fetchUnconfirmedOrder(1, searchText).then(({ data, error, route }) => {
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
    OrderFetcher.fetchUnconfirmedOrder(page, searchText, proofAvailability).then(({ data, error, route }) => {
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
    OrderFetcher.fetchUnconfirmedOrder(1, '', proofAvailability).then(({ data, error, route }) => {
      if (data) setOnlineOrder(data);
      else if (error) setError(error);
      else if (route) Router.push(route);
    }).catch((e) => {
      setError(e.message);
    }).finally(() => {
      setFetching(false);
    })
  }, [proofAvailability])

  return <>
  <div className='p-6 bg-white/80 h-full backdrop-blur-md overflow-hidden'>
    <h1 className='text-xl font-semibold'>
      Konfirmasi Pemesanan
    </h1>
    <form onSubmit={searchHandler} className='flex items-center gap-4 mt-4'>
      <select className='border px-4 py-2 hover:shadow-md hover:bg-slate-100 
         rounded-md outline-none transition-all' value={proofAvailability}
         onChange={(event) => setProofAvailability(event.target.value)}>
        <option value='1'>
          Sudah ada bukti
        </option>
        <option value='0'>
          Belum ada bukti
        </option>
      </select>
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
                qty,
                products: Product,
              } = Order.orderdetail;

              return <div key={Order.id} className='flex items-center justify-between shadow-md px-4 py-4
                rounded-md bg-white/30 mb-3'>
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
                <div className='w-64'>
                  <div className='flex justify-end items-center gap-2'>
                    { 
                      Order.proofOfPayment &&
                      <button type='button'
                        className='border-2 rounded-full border-primary px-4 py-2 
                          hover:opacity-70 active:opacity:40 transition-all'
                        onClick={() => setProofOfPayment(Order.proofOfPayment)}>
                            Lihat bukti
                      </button>
                    }
                    <button type='button'
                      className='border-2 rounded-full border-primary px-4 py-2 bg-primary text-white
                        hover:opacity-70 active:opacity:40 transition-all'>
                          Konfirmasi
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
      error &&
      <CommonErrorModal text={error} onClick={() => setError('')}/>
    }
    {
      proofOfPayment &&
      <CommonModal>
        <div className='flex flex-col gap-8 p-2'>
          <button className='relative w-72 sm:w-96 shadow-md aspect-video border hover:opacity-70 active:opacity-40 transition-all'
            type='button'
            onClick={() => {
              window.open(`${BASE_URL}/${proofOfPayment}`);
            }}>
            <Image src={`${BASE_URL}/${proofOfPayment}`} alt={proofOfPayment} layout='fill' objectFit='cover'/>
          </button>
          <button className='bg-slate-400 text-white rounded-full px-4 py-2
            w-max mx-auto hover:bg-red-600 transition-all'
            type='button'
            onClick={() => setProofOfPayment('')}>
              Tutup
          </button>
        </div>
      </CommonModal>
    }
  </>
}