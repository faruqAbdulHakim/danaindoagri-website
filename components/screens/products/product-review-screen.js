import Router from 'next/router';

import { FaArrowLeft } from 'react-icons/fa';
import ReviewList from './review-list';
import ReviewProductDetail from './review-product-detail';

export default function ProductReviewScreen({ Product, reviewList }) {
  return <>
    <div className='bg-white/80 backdrop-blur-md'>
      <div className='py-6 pl-6 pr-10 h-full max-h-[calc(100vh-90px)] overflow-auto'>
        <button type='button' className='text-sm text-slate-600 flex items-center gap-2
          hover:opacity-70 active:opacity-40 transition-all'
          onClick={() => Router.back()}>
          <FaArrowLeft /> Kembali
        </button>
        <div className='mt-4'>
          <ReviewProductDetail Product={Product} reviewList={reviewList} />
        </div>
        <div className='mt-8'>
          <ReviewList reviewList={reviewList}/>
        </div>
      </div>
    </div>
  </>
}