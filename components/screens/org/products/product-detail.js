import Image from 'next/image';
import Link from 'next/link';

import CONFIG from '@/global/config';

const { PRODUCTS_BASE_URL } = CONFIG.SUPABASE.BUCKETS.PRODUCTS;

export default function ProductDetail({ Product }) {
  return <>
    <div className='h-full p-6 bg-white/80 backdrop-blur-md rounded-r-3xl grid sm:grid-cols-2 gap-6'>
      <div>
        <h1 className='text-xl font-semibold ml-4'>
          Produk
        </h1>
        <div className='aspect-square relative w-full max-w-[320px] border mt-4 rounded-md overflow-hidden'>
          <Image src={`${PRODUCTS_BASE_URL}/${Product.imgUrl}`} alt={Product.name} layout='fill'
            objectFit='cover' objectPosition='center'/>
        </div>
        <h2 className='text-2xl mt-6'>
          {Product.name}
        </h2>
      </div>
      <div className='rounded-md border shadow-md p-6 bg-white/60 h-full max-h-[calc(100vh-140px)] overflow-auto'>
        <h2 className='text-xl'>
          Informasi Produk
        </h2>
        <div className='flex flex-col mt-4'>
          <div className='flex py-4 border-b border-slate-500'>
            <p className='font-semibold w-32'>
              Ukuran
            </p>
            <p>
              {Product.size}
            </p>
          </div>
          <div className='flex py-4 border-b border-slate-500'>
            <p className='font-semibold w-32'>
              Harga
            </p>
            <p>
              Rp {Product.price}
            </p>
          </div>
          <div className='flex py-4 border-b border-slate-500'>
            <p className='font-semibold w-32'>
              Sisa stok
            </p>
            <p>
              {Product.stock}
            </p>
          </div>
          <div className='py-4 border-b border-slate-500'>
            <p className='font-semibold w-32'>
              Deskripsi
            </p>
            <p className='mt-1'>
              {Product.desc}
            </p>
          </div>
          <div className='py-4 border-b border-slate-500'>
            <p className='font-semibold w-32'>
              Harga Grosir
            </p>
            {
              Product.wsPrice.length > 0 ?
              <>
                <div className='flex items-center gap-2'>
                  <span className='w-8'></span>
                  <p className='w-32'>
                    qty
                  </p>
                  <p>
                    Harga / barang
                  </p>
                </div>
                {Product.wsPrice.map((price, idx) => {
                  return <WsPriceList key={price.id} price={price} idx={idx}/>
                })}
              </>
              :
              <>
                <p>
                  Tidak ada harga grosir pada produk ini.
                </p>
              </>
            }

          </div>
        </div>
        <div className='mt-12 ml-auto w-max'>
          <Link href={`/org/products/${Product.id}/review`}>
            <a className='bg-primary text-white px-4 py-3 rounded-lg 
              hover:opacity-70 active:opacity-40 transition-all'>
              Lihat Ulasan
            </a>
          </Link>
        </div>
      </div>
    </div>
  </>
}

function WsPriceList({ price, idx }) {
  return <>
    <div className='flex items-center gap-2'>
      <p className='w-8'>
        {idx}
      </p>
      <p className='w-32'>
        {price.minQty} - {price.maxQty}
      </p>
      <p>
        {price.price}
      </p>
    </div>
  </>
}
