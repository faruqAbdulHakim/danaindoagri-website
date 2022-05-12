import Image from 'next/image';
import Link from 'next/link';

import CONFIG from '@/global/config';

const { ROLE_NAME, BUCKETS } = CONFIG.SUPABASE;
const { PRODUCTS_BASE_URL } = BUCKETS.PRODUCTS;

export default function ProductItem({ Product, userRole }) {
  return <>
  <Link href={`/org/products/${Product.id}`}>
    <a className='bg-slate-100 hover:shadow-md
      rounded-lg p-6 max-w-[280px] w-full transition-all'>
      <div className='h-32 w-32 relative rounded-full overflow-hidden mx-auto bg-white'>
        <Image src={`${PRODUCTS_BASE_URL}/${Product.imgUrl}`} alt='' layout='fill' 
          objectFit='cover' objectPosition='center'
          unoptimized={true}
        />
      </div>
      <h2 className='text-center mt-8 font-semibold'>
        {Product.name}
      </h2>
      <div className='mt-4'>
        <p>
          {Product.size}
        </p>
        <div className='mt-2 flex flex-wrap justify-between'>
          <p>
            Stok: {Product.stock}
          </p>
          <p className='text-primary'>
            Rp {Product.price}
          </p>
        </div>
      </div>
      {
        userRole === ROLE_NAME.MARKETING &&
        <>
          <hr className='mt-4'/>
          <div className='mt-6 mx-auto w-max'>
            <Link href={`/org/products/${Product.id}/edit-product`}>
              <a className='bg-primary text-white px-8 py-3 rounded-full hover:opacity-70 active:opacity-40 transition-all'>
                Ubah
              </a>
            </Link>
          </div>
        </>
      }
    </a>
  </Link>
  </>
}