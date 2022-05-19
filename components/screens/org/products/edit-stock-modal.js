import Router from 'next/router';
import { useState, useRef } from 'react';

import CommonModal from '@/components/common/common-modal'
import ProductsFetcher from '@/utils/functions/products-fetcher';

export default function EditStockModal({ Product, setEditStockModal, setError }) {
  const inputRef = useRef(null);
  const [fetching, setFetching] = useState(false);

  const submitHandler = (event) => {
    event.preventDefault();
    setFetching(true);
    const formData = new FormData();
    formData.append('productId', Product.id);
    formData.append('stock', inputRef.current.value);
    ProductsFetcher.patchProduct(formData).then(({ data, error, route }) => {
      if (data) Router.reload();
      else if (error) {
        setEditStockModal(null);
        setError(error);
      }
      else if (route) Router.push(route);
    }).catch((e) => {
      setEditStockModal(null);
      setError(e.message);
    }).finally(() => {
      setFetching(false);
    })
  }

  return <>
    <CommonModal>
      <form onSubmit={submitHandler} className='p-6'>
        <h2 className='text-lg font-semibold text-center'>
          Ubah Stok {Product.name}
        </h2>
        <p className='text-center'>
          Stok Awal : {Product.stock}
        </p>
        <input ref={inputRef} type='text' pattern='[0-9]+' name='stock' required
          className='border border-slate-300 outline-none bg-slate-50 px-4 py-2 w-full min-w-0
          mt-4 text-center rounded-lg focus:bg-slate-100 hover:shadow-md focus:shadow-md transition-all'
          placeholder='Stok' />
        <div className='flex flex-wrap justify-evenly gap-10 mt-6'>
          <button type='button' 
            className='bg-gray-400 hover:bg-red-600 disabled:hover:bg-gray-400 w-28 py-3 rounded-full text-white 
            transition-all duration-200'
            onClick={() => setEditStockModal(null)}
            disabled={fetching}
          >
            Batal
          </button>
          <button type='submit' 
            className='bg-gradient-to-br from-primary to-primary/40 hover:to-primary/70 disabled:from-gray-400 
            disabled:to-gray-200 w-28 py-3 rounded-full text-white transition-all duration-200'
            disabled={fetching}
          >
            Simpan
          </button>
        </div>
      </form>
    </CommonModal>
  </>
}