import Image from 'next/image';
import Router from 'next/router';
import { useRef, useState } from 'react';

import { HiLocationMarker, HiOutlineFolder, HiOutlineUpload } from 'react-icons/hi';
import { FaTruck } from 'react-icons/fa';

import OrderFetcher from '@/utils/functions/order-fetcher';
import CommonErrorModal from '@/components/common/common-error-modal';
import CommonSuccessModal from '@/components/common/common-success-modal';
import CONFIG from '@/global/config';

const { BASE_URL } = CONFIG.SUPABASE.BUCKETS.PROOF_OF_PAYMENT;

export default function OrderDetailScreen({ Order }) {
  const { 
    qty,
    productPrice, 
    shipmentPrice, 
    codePrice, 
    etd,
    expedition,
    products: Product,
    address,
    cities: City,
  } = Order.orderdetail;
  
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [fetching, setFetching] = useState(false);
  const uploadFileRef = useRef(null);
  const changeFileRef = useRef(null);

  const uploadFileHandler = () => {
    if (!Order.proofOfPayment) uploadFileRef.current.click();
  }

  const deleteProofOfPayment = () => {
    setFetching(true);
    OrderFetcher.deleteProofOfPayment(Order.id).then(({ data, error, route }) => {
      if (data) setSuccess(data);
      else if (error) setError(error);
      else if (route) Router.push(route);
    }).catch((e) => {
      setError(e.message);
    }).finally(() => {
      setFetching(false);
    })
  }

  const changeProofOfPayment = () => {
    if (Order.proofOfPayment) changeFileRef.current.click();
  }

  const changeFileChange = (event) => {
    if (!Order.proofOfPayment) return setError('Bukti pembayaran sebelumnya tidak ada');
    const file = event.target.files[0];
    setFetching(true)
    OrderFetcher.changeProofOfPayment(Order.id, file).then(({ data, error, route }) => {
      if (data) setSuccess(data);
      else if (error) setError(error);
      else if (route) Router.push(route);
    }).catch((e) => {
      setError(e.message);
    }).finally(() => {
      setFetching(false);
    })
  }

  const uploadFileChange = (event) => {
    if (Order.proofOfPayment) return setError('Bukti pembayaran sudah ada');
    const file = event.target.files[0];
    setFetching(true)
    OrderFetcher.postProofOfPayment(Order.id, file).then(({ data, error, route }) => {
      if (data) setSuccess(data);
      else if (error) setError(error);
      else if (route) Router.push(route);
    }).catch((e) => {
      setError(e.message);
    }).finally(() => {
      setFetching(false);
    })
  }

  return <>
  <div className='bg-white/90 backdrop-blur-md'>
    <div className='py-6 pl-6 pr-10 h-full max-h-[calc(100vh-90px)] overflow-auto'>
      {/* product information */}
      <h2 className='text-2xl font-semibold'>
        {Product.name}
      </h2>
      <div className='mt-4 flex gap-8'>
        <div>
          <p>
            Ukuran : {Product.size} g
          </p>
          <p className='text-primary text-xl font-semibold'>
            Rp {Product.price}
          </p>
          <hr className='my-4'/>
          <div className='flex items-center gap-2'>
            <HiLocationMarker className='text-primary' size={20}/> 
            <p>
              Dikirim dari Jember
            </p>
          </div>
          <div className='mt-2 flex items-center gap-2'>
            <FaTruck className='text-primary' size={20}/> 
            <p>
              Estimasi tiba {etd} hari
            </p>
          </div>

          <hr className='my-4'/>

          {/* Expedition */}
          <p>
            Pengiriman :
          </p>
          <p>
            {expedition}
          </p>

          <hr className='my-4'/>

          {/* Price */}
          <div className='mt-2 flex justify-between'>
            <p>
              Subtotal Produk
            </p>
            <p>
              Rp {productPrice}
            </p>
          </div>
          <div className='mt-2 flex justify-between'>
            <p>
              Subtotal Pengiriman
            </p>
            <p>
              Rp {shipmentPrice}
            </p>
          </div>
          <div className='bg-primary text-white mt-2 rounded-xl flex 
          justify-between px-4 py-2 border-t-4 border-dotted border-white'>
            <p>
              Total Pembayaran
            </p>
            <p>
              Rp {productPrice + shipmentPrice + codePrice}
            </p>
          </div>
        </div>
        <div className='bg-white rounded-md shadow-md h-max p-4 max-w-[240px]'>
          <p>
            Rincian Jumlah
          </p>
          <div className='flex items-center gap-2'>
            <input type='text' alt='' 
              className='border inline w-min min-w-0 text-center rounded-md p-1 border-slate-400'
              pattern='[0-9]+' name='qty' 
              size='5'
              value={qty} disabled />
          </div>
          <p className='mt-2'>
            Berat : {Product.size * qty} g
          </p>
          <hr className='my-2'/>
          <div className='flex items-center gap-2'>
            <HiLocationMarker className='text-primary' size={20}/> 
            <p>
              Alamat tujuan
            </p>
          </div>
          <p>
            {address},{' '}
            {City?.citytype?.type} {City?.city}, {' '}
            {City?.provinces?.province}
          </p>
        </div>
      </div>

      <p className='text-primary text-sm mt-4'>
        Harga dapat berbeda dikarenakan kebijakan grosir atau perubahan harga setelah pemesanan
      </p>

      <div className={`mt-4 rounded-lg border-2 border-dashed shadow-md p-4 
        ${!Order.proofOfPayment && 'hover:bg-slate-100 active:opacity-40 transition-all'}`} onClick={uploadFileHandler}>
        <input ref={uploadFileRef} type='file' name='upload-proofofpayment' hidden accept='image/jpeg,image/png'
          onChange={uploadFileChange} disabled={fetching} />
        <input ref={changeFileRef} type='file' name='changeproofofpayment' hidden accept='image/jpeg,image/png'
          onChange={changeFileChange} disabled={fetching} />
        <p className='flex items-center gap-2'>
          <HiOutlineFolder size={22} /> {Order.proofOfPayment ? 'File' : 'Choose File'}
        </p>
        <div className='p-2 min-h-[140px] flex flex-col gap-2 items-center justify-center'>
          {
          Order.proofOfPayment ?
          <>
            <div className='bg-slate-200 w-full max-w-[120px] aspect-square relative border
              rounded-md overflow-hidden
              cursor-pointer hover:opacity-70 active:opacity-40 transition-all'
              onClick={() => {
                window.open(`${BASE_URL}/${Order.proofOfPayment}`)
              }}
            >
              <Image src={`${BASE_URL}/${Order.proofOfPayment}`} alt='bukti' layout='fill' objectFit='cover'/>
            </div>
            <p className='text-sm text-slate-600'>
              {Order.proofOfPayment}
            </p>
          </>
          :
          <>
            <HiOutlineUpload size={32} className={`text-slate-600 ${fetching && 'animate-bounce animate-pulse'}`} />
            <p className='text-sm text-slate-600'>
              {fetching ? 'Loading...' : 'Upload bukti pembayaran'}
            </p>
          </>
          }
        </div>
        {
          Order.proofOfPayment &&  
          Order.orderdetail.status === 'belum dibayar' ?
          <div className='flex justify-end gap-2'>
            <button
              type='button'
              className='px-4 py-2 rounded-md bg-red-600 text-white disabled:bg-slate-600
              hover:opacity-70 active:opacity:40 transition-all'
              onClick={deleteProofOfPayment}
              disabled={fetching}
            >
              Hapus
            </button>
            <button
              type='button'
              className='px-4 py-2 rounded-md bg-primary text-white disabled:bg-slate-600
              hover:opacity-70 active:opacity:40 transition-all'
              onClick={changeProofOfPayment}
              disabled={fetching}
            >
              Ubah
            </button>
          </div>
          :
          <p className='text-right text-sm text-primary'>
            Bukti telah dikonfirmasi
          </p>
        }
      </div>
    </div>
  </div>
  {
    error &&
    <CommonErrorModal text={error} onClick={() => Router.reload()} />
  }
  {
    success &&
    <CommonSuccessModal text={success} onClick={() => Router.reload()} />
  }
  </>
}