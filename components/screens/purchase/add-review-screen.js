import Router from 'next/router';
import { useState, useEffect } from 'react';

import { AiFillStar } from 'react-icons/ai';

import ReviewFetcher from '@/utils/functions/review-fetcher';
import CommonSuccessModal from '@/components/common/common-success-modal';
import CommonErrorModal from '@/components/common/common-error-modal';

export default function AddReviewScreen({ Order, Review }) {
  const [formValues, setFormValues] = useState({
    rating: 0,
    review: '',
  });
  const [exist, setExist] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const submitHandler = (event) => {
    event.preventDefault();
    setFetching(true);
    const body = {
      ...formValues,
      onlineOrderId: Order.id,
      productId: Order.orderdetail.productId,
    }
    ReviewFetcher.addNewReview(body)
      .then(({ data, error, route }) => {
        if (data) setSuccess(data);
        else if (error) setError(error);
        else if (route) Router.push(route);
      })
      .catch((e) => setError(e.message))
      .finally(() => setFetching(false));
  }

  const {
    qty,
    products: Product
  } = Order.orderdetail

  useEffect(() => {
    if (Review !== null) {
      setExist(true);
      setFormValues({
        rating: Review.rating,
        review: Review.review,
      })
    }
  }, [Review])

  return <>
  <form onSubmit={submitHandler} className='bg-white/80 backdrop-blur-md p-6'>
    <div className='h-[calc(100vh-140px)] overflow-scroll'>
      <h1 className='text-2xl font-semibold'>
        {Product.name}
      </h1>
      <div className='flex gap-8 mt-2'>
        <p>
          Jumlah Pesanan: {qty}
        </p>
        <p className='text-primary'>
          Rp {Product.price}
        </p>
      </div>
      <div className='flex mt-8 gap-4'>
        <button type='button'
          onClick={() => {
            setFormValues({...formValues, rating: 1})
          }}
          disabled={exist}
        >
            <AiFillStar size={26} className={`${formValues.rating >= 1 ? 'text-primary' : 'text-slate-300 hover:text-slate-400'} 
            active:scale-125 transition-all`} />
        </button>
        <button type='button'
          onClick={() => {
            setFormValues({...formValues, rating: 2})
          }}
          disabled={exist}
        >
            <AiFillStar size={26} className={`${formValues.rating >= 2 ? 'text-primary' : 'text-slate-300 hover:text-slate-400'} 
            active:scale-125 transition-all`} />
        </button>
        <button type='button'
          onClick={() => {
            setFormValues({...formValues, rating: 3})
          }}
          disabled={exist}
        >
            <AiFillStar size={26} className={`${formValues.rating >= 3 ? 'text-primary' : 'text-slate-300 hover:text-slate-400'} 
            active:scale-125 transition-all`} />
        </button>
        <button type='button'
          onClick={() => {
            setFormValues({...formValues, rating: 4})
          }}
          disabled={exist}
        >
            <AiFillStar size={26} className={`${formValues.rating >= 4 ? 'text-primary' : 'text-slate-300 hover:text-slate-400'} 
            active:scale-125 transition-all`} />
        </button>
        <button type='button'
          onClick={() => {
            setFormValues({...formValues, rating: 5})
          }}
          disabled={exist}
        >
            <AiFillStar size={26} className={`${formValues.rating >= 5 ? 'text-primary' : 'text-slate-300 hover:text-slate-400'} 
            active:scale-125 transition-all`} />
        </button>
      </div>
      <div>
        <textarea className='border p-2 mt-8 outline-none hover:bg-slate-50 focus:bg-slate-100 shadow-md rounded-md 
        resize-none w-full max-w-md transition-all disabled:bg-gray-100' rows={7} placeholder='Tulis ulasan anda disini' 
        value={formValues.review} onChange={(event) => {setFormValues({...formValues, review: event.target.value})}}
        disabled={exist}
        ></textarea>
      </div>
      {
        exist ?
        <p className='text-sm text-primary mt-2'>
          Anda telah memberi ulasan untuk pemesanan ini
        </p>
        :
        <div className='max-w-md flex justify-end gap-4 mt-2'>
          <button className='bg-slate-400 text-white px-4 py-2 rounded-md hover:bg-red-600 active:opacity-40 transition-all'
            type='button'
            onClick={() => Router.push(`/purchase/${Order.id}`)}
            disabled={fetching}>
            Batal
          </button>
          <button className='bg-primary text-white px-4 py-2 rounded-md 
          hover:opacity-70 active:opacity-40 disabled:bg-slate-600 transition-all'
          type='submit'
          disabled={fetching}>
            Ulas
          </button>
        </div>
      }
    </div>
  </form>
  {
    success &&
    <CommonSuccessModal text={success} onClick={() => Router.reload()}/>
  }
  {
    error &&
    <CommonErrorModal text={error} onClick={() => setError('')} />
  }
  </>
}