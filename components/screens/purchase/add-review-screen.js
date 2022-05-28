import Router from 'next/router';
import { useState } from 'react';

import { AiFillStar } from 'react-icons/ai';

export default function AddReviewScreen({ Order }) {
  const [formValues, setFormValues] = useState({
    rating: 0,
  });

  const {
    qty,
    products: Product
  } = Order.orderdetail

  return <>
  <div className='bg-white/80 backdrop-blur-md p-6'>
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
        >
            <AiFillStar size={26} className={`${formValues.rating >= 1 ? 'text-primary' : 'text-slate-300 hover:text-slate-400'} 
            active:scale-125 transition-all`} />
        </button>
        <button type='button'
          onClick={() => {
            setFormValues({...formValues, rating: 2})
          }}
        >
            <AiFillStar size={26} className={`${formValues.rating >= 2 ? 'text-primary' : 'text-slate-300 hover:text-slate-400'} 
            active:scale-125 transition-all`} />
        </button>
        <button type='button'
          onClick={() => {
            setFormValues({...formValues, rating: 3})
          }}
        >
            <AiFillStar size={26} className={`${formValues.rating >= 3 ? 'text-primary' : 'text-slate-300 hover:text-slate-400'} 
            active:scale-125 transition-all`} />
        </button>
        <button type='button'
          onClick={() => {
            setFormValues({...formValues, rating: 4})
          }}
        >
            <AiFillStar size={26} className={`${formValues.rating >= 4 ? 'text-primary' : 'text-slate-300 hover:text-slate-400'} 
            active:scale-125 transition-all`} />
        </button>
        <button type='button'
          onClick={() => {
            setFormValues({...formValues, rating: 5})
          }}
        >
            <AiFillStar size={26} className={`${formValues.rating >= 5 ? 'text-primary' : 'text-slate-300 hover:text-slate-400'} 
            active:scale-125 transition-all`} />
        </button>
      </div>
      <div>
        <textarea className='border p-2 mt-8 outline-none hover:bg-slate-50 focus:bg-slate-100 shadow-md rounded-md 
        resize-none w-full max-w-md transition-all' rows={7} placeholder='Tulis ulasan anda disini'></textarea>
      </div>
      <div className='max-w-md flex justify-end gap-4 mt-2'>
          <button className='bg-slate-400 text-white px-4 py-2 rounded-md hover:bg-red-600 active:opacity-40 transition-all'
            type='button'
            onClick={() => Router.push(`/purchase/${Order.id}`)}>
            Batal
          </button>
          <button className='bg-primary text-white px-4 py-2 rounded-md hover:opacity-70 active:opacity-40 transition-all'>
            Ulas
          </button>
      </div>
    </div>
  </div>
  </>
}