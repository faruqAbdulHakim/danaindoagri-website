import { useState, useEffect } from 'react';

import { AiFillStar } from 'react-icons/ai';

export default function ReviewProductDetail({ Product, reviewList }) {
  const [rating, setRating] = useState(0);
  
  useEffect(() => {
    if (reviewList.length !== 0) setRating(
      (reviewList.reduce((a, b) => a + b.rating, 0) / reviewList.length)
      .toFixed(1)
    );
  }, [reviewList]);

  return <>
    <h1 className='text-2xl font-semibold'>
      {Product.name}
    </h1>
    <div className='mt-6 flex gap-4'>
      <AiFillStar size={26} className={`${rating >= 1 ? 'text-yellow-500' : 'text-slate-300'}`} />
      <AiFillStar size={26} className={`${rating >= 2 ? 'text-yellow-500' : 'text-slate-300'}`} />
      <AiFillStar size={26} className={`${rating >= 3 ? 'text-yellow-500' : 'text-slate-300'}`} />
      <AiFillStar size={26} className={`${rating >= 4 ? 'text-yellow-500' : 'text-slate-300'}`} />
      <AiFillStar size={26} className={`${rating >= 5 ? 'text-yellow-500' : 'text-slate-300'}`} />
    </div>
    <div className='mt-4 flex gap-8'>
      <p>
        <span className='text-xl'>{rating}</span> / 5
      </p>
      <p>
        {reviewList.length} ulasan
      </p>
    </div>
  </>
}