import Image from 'next/image';
import Router from 'next/router';

import { IoWallet, IoCheckmarkCircle, IoStar } from 'react-icons/io5';
import { FaTruck, FaArrowLeft } from 'react-icons/fa';

import CONFIG from '@/global/config'

const { BUCKETS } = CONFIG.SUPABASE;
const { PRODUCTS_BASE_URL } = BUCKETS.PRODUCTS;

export default function OfflineOrderDetailScreen({ Order }) {
  const OrderDetail = Order.orderdetail;
  const Product = OrderDetail.products;
  const City = OrderDetail.cities;
  const Province = City.provinces;

  return <>
    <div className='bg-white/80 backdrop-blur-md h-full'>
      <div className='p-6 h-[calc(100vh-100px)] overflow-auto'>
        <button type='button' className='text-sm text-slate-600 flex items-center gap-2
          hover:opacity-70 active:opacity-40 transition-all'
          onClick={() => Router.back()}>
          <FaArrowLeft /> Kembali
        </button>
        <h1 className='mt-4 text-xl font-semibold'>
          Detail Pemesanan Offline
        </h1>
        <div className='mt-4 flex gap-8'>
          <div className='h-60 w-60 relative bg-slate-50 rounded-md overflow-hidden'>
            <Image src={`${PRODUCTS_BASE_URL}/${Product.imgUrl}`} alt='Tidak ada gambar' layout='fill' />
          </div>
          <div className='max-w-sm'>
            <div className='flex items-center gap-4'>
              <IoWallet size={28} 
                className={`${OrderDetail.status === 'belum dibayar' && 'text-primary'}`}
              />
              <IoCheckmarkCircle size={28}
                className={`${OrderDetail.status === 'dikonfirmasi' && 'text-primary'}`}
              />
              <FaTruck size={28} 
                className={`${OrderDetail.status === 'dikirim' && 'text-primary'}`}
              />
              <IoStar size={28}
                className={`${OrderDetail.status === 'diterima' && 'text-primary'}`}
              />
            </div>

            <hr className='my-4' />

            <div className='space-y-2'>
              <div>
                <p className='text-sm text-slate-600'>
                  Nama Produk
                </p>
                <p>
                  {Product.name}
                </p>
              </div>
              <div>
                <p className='text-sm text-slate-600'>
                  Ukuran
                </p>
                <p>
                  {Product.size}
                </p>
              </div>
              <div>
                <p className='text-sm text-slate-600'>
                  Kuantitas
                </p>
                <p>
                  {OrderDetail.qty}
                </p>
              </div>
              <div>
                <p className='text-sm text-slate-600'>
                  Alamat Tujuan
                </p>
                <p>
                  {OrderDetail.address}, {City.citytype.type} {City.city}, {Province.province}
                </p>
              </div>
            </div>

            <hr className='my-4' />
            
            <div className='space-y-2'>
              <div className='flex justify-between'>
                <p>
                  Harga Produk
                </p>
                <p>
                  Rp {OrderDetail.productPrice}
                </p>
              </div>
              <div className='flex justify-between'>
                <p>
                  Biaya Pengiriman
                </p>
                <p>
                  Rp {OrderDetail.shipmentPrice}
                </p>
              </div>
              <div className='flex justify-between'>
                <p>
                  Kode Transaksi
                </p>
                <p>
                  Rp {OrderDetail.codePrice}
                </p>
              </div>
              <div className='flex justify-between bg-primary text-white p-2 border-t-2 rounded-xl border-white border-dashed'>
                <p>
                  Total Pembayaran
                </p>
                <p>
                  Rp {OrderDetail.productPrice + OrderDetail.shipmentPrice + OrderDetail.codePrice}
                </p>
              </div>
              <p className='text-sm text-primary'>
                Harga dapat berbeda tergantung kebijakan harga grosir dan waktu pemesanan dilakukan
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </>
}
