import Image from 'next/image';
import Link from 'next/link';

import { BsArrowRight } from 'react-icons/bs';

import CONFIG from '@/global/config';

const { PRODUCTS_BASE_URL } = CONFIG.SUPABASE.BUCKETS.PRODUCTS;

export default function ProductItem({ Product }) {
  const { id, name, imgUrl } = Product;
  return <>
    <Link href={`/product/${id}`}>
      <a className='bg-[#f5f5f5] p-6 group rounded-md w-full max-w-[260px] aspect-[7/8]
        hover:shadow-md group opacity-70 hover:opacity-100 transition-all duration-500'>
        <h2 className='text-center'>
          {name}
        </h2>
        <div className='w-full aspect-square max-w-[120px] mx-auto mt-6 
          rounded-md overflow-hidden'>
          <div className='h-full w-full relative'>
            <Image src={`${PRODUCTS_BASE_URL}/${imgUrl}`} alt='' layout='fill' 
              objectFit='cover' objectPosition='center'/>
          </div>
        </div>
        <div className='w-max mx-auto mt-6 relative'>
          <span className='h-12 w-12 bg-white/80 rounded-full absolute -translate-x-2 -top-1/2 shadow-sm'></span>
          <p className='flex items-center gap-2 relative'>
            Lihat Detail <BsArrowRight/>
          </p>
        </div>
      </a>
    </Link>
  </>
}