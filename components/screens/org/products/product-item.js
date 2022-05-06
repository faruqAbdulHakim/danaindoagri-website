import Image from 'next/image';
import Link from 'next/link';

import CONFIG from '@/global/config';

const { PRODUCTS_BASE_URL } = CONFIG.SUPABASE.BUCKETS.PRODUCTS;

export default function ProductItem({ product }) {
  return <>
    <div className='bg-slate-100 hover:bg-slate-200
      rounded-lg p-6 max-w-[280px] w-full transition-all'>
      <div className='h-32 w-32 relative rounded-full overflow-hidden mx-auto bg-white'>
        <Image src={`${PRODUCTS_BASE_URL}/${product.imgUrl}`} alt='' layout='fill' 
          objectFit='cover' objectPosition='center'
          unoptimized={true}
        />
      </div>
      <h2 className='text-center mt-8 font-semibold'>
        {product.name}
      </h2>
      <div className='mt-4'>
        <p>
          {product.size}
        </p>
        <div className='mt-2 flex flex-wrap justify-between'>
          <p>
            Stok: {product.stock}
          </p>
          <p className='text-primary'>
            Rp {product.price}
          </p>
        </div>
      </div>
      <hr className='mt-4'/>
      <div className='mt-6 mx-auto w-max'>
        <Link href='/'>
          <a className='bg-primary text-white px-8 py-3 rounded-full hover:opacity-70 active:opacity-40 transition-all'>
            Ubah
          </a>
        </Link>
      </div>
    </div>
  </>
}