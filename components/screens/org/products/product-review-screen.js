import Router from 'next/router';
import Image from 'next/image';

import { FaArrowLeft } from 'react-icons/fa';

import ReviewList from '../../products/review-list';
import ReviewProductDetail from '../../products/review-product-detail';
import CONFIG from '@/global/config';

const { PRODUCTS_BASE_URL } = CONFIG.SUPABASE.BUCKETS.PRODUCTS;

export default function ProductReviewScreen({ Product, reviewList }) {
  return <>
    <div className='bg-white/80 backdrop-blur-md'>
      <div className='py-6 pl-6 pr-10 h-full max-h-[calc(100vh-90px)] overflow-auto'>
        <button type='button' className='text-sm text-slate-600 flex items-center gap-2
          hover:opacity-70 active:opacity-40 transition-all'
          onClick={() => Router.back()}>
          <FaArrowLeft /> Kembali
        </button>
        <div className='flex gap-8 items-start mt-4'>
          <div className='w-56 rounded-md overflow-hidden aspect-square relative'>
            <Image src={`${PRODUCTS_BASE_URL}/${Product.imgUrl}`} alt='' layout='fill' objectFit='cover'/>
          </div>
          <div>
            <ReviewProductDetail Product={Product} reviewList={reviewList} />
          </div>
        </div>
        <div className='mt-8'>
          <ReviewList reviewList={reviewList}/>
        </div>
      </div>
    </div>
  </>
}