import Image from 'next/image';
import Router from 'next/router';
import { useRef, useState } from 'react';

import CommonSuccessModal from '@/components/common/common-success-modal';
import CommonErrorModal from '@/components/common/common-error-modal';
import ProductsFetcher from '@/utils/functions/products-fetcher';
import CONFIG from '@/global/config';

const { PRODUCTS_BASE_URL } = CONFIG.SUPABASE.BUCKETS.PRODUCTS;

export default function EditProductForm({ Product }) {
  const inputFileRef = useRef(null);
  const [imageSrc, setImageSrc] = useState('');
  const [fetching, setFetching] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [formValues, setFormValues] = useState({
    name: Product.name,
    price: Product.price,
    size: Product.size,
    desc: Product.desc,
  });

  const inputFileChangeHandler = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.addEventListener('load', (event) => {
      setImageSrc(event.target.result);
    })
    reader.readAsDataURL(file);
  }

  const updateFormValues = (event) => {
    const { name, value } = event.target;
    setFormValues({
      ...formValues,
      [name]: value,
    });
  }

  const submitHandler = (event) => {
    event.preventDefault();
    setFetching(true);

    const file = inputFileRef.current.files[0];
    const formData = new FormData();
    formData.append('file', file);
    Object.entries(formValues).forEach(([key, value]) => {
      formData.append(key, value);
    });

    const { id, imgUrl } = Product;
    ProductsFetcher.updateProduct(id, imgUrl, formData).then(({ data, error, route }) => {
      console.log(data,error, route)
      if (error) setError(error);
      else if (route) Router.push(route);
      else if (data) setSuccess(data);
    }).catch((e) => {
      setError(e.message);
    }).finally(() => {
      setFetching(false);
    })
  }

  return <>
    <div className='h-full bg-white/80 backdrop-blur-md rounded-r-3xl p-6'>
      <form className='bg-white/20 rounded-lg border shadow-md p-6 h-full max-h-[calc(100vh-140px)] overflow-auto'
        onSubmit={submitHandler}>
        <h1 className='text-2xl font-semibold'>
          Ubah Produk
        </h1>
        <div className='flex gap-6 mt-6'>
          <div className='p-4 shadow-lg rounded-lg h-max'>
            <div className='h-40 w-40 relative rounded-md overflow-hidden'>
              {
                imageSrc ?
                <Image src={imageSrc} alt='' layout='fill' className='bg-white'/>
                :
                <Image src={`${PRODUCTS_BASE_URL}/${Product.imgUrl}`} alt='' layout='fill' 
                  className='bg-white' unoptimized={true}/>
              }
            </div>
            <button type='button' 
              className='mt-4 border border-slate-400 w-full py-2 rounded-md
              hover:shadow-md transition-all'
              onClick={() => {inputFileRef.current.click()}}
              disabled={fetching}>
              Pilih Foto
            </button>
            <input ref={inputFileRef} type='file' accept='image/jpeg,image/png' className='hidden' 
              onChange={inputFileChangeHandler}/>
          </div>
          <div className='flex-1'>
            <h2 className='text-lg font-semibold'>
              Informasi Produk
            </h2>
            <div className='mt-4 flex flex-col gap-4'>
              <div className='flex items-start gap-4'>
                <label htmlFor='name' className='w-32'>
                  Nama Produk
                </label>
                <input type='text' id='name' name='name' 
                  className='outline-none border px-2 py-1 hover:shadow-md
                  w-full max-w-[260px] min-w-0 bg-slate-50 hover:bg-slate-100 focus:bg-slate-200 
                  rounded-sm transition-all'
                  value={formValues.name}
                  onChange={updateFormValues}
                  placeholder='Nama produk'/>
              </div>
              <div className='flex items-start gap-4'>
                <label htmlFor='price' className='w-32'>
                  Harga
                </label>
                <input type='text' id='price' name='price' 
                  className='outline-none border px-2 py-1 hover:shadow-md
                  w-full max-w-[260px] min-w-0 bg-slate-50 hover:bg-slate-100 focus:bg-slate-200 
                  rounded-sm transition-all'
                  value={formValues.price}
                  onChange={updateFormValues}
                  pattern='[0-9]+'
                  placeholder='Harga'/>
              </div>
              <div className='flex items-start gap-4'>
                <label htmlFor='size' className='w-32'>
                  Ukuran
                </label>
                <input type='text' id='size' name='size' 
                  className='outline-none border px-2 py-1 hover:shadow-md
                  w-full max-w-[260px] min-w-0 bg-slate-50 hover:bg-slate-100 focus:bg-slate-200 
                  rounded-sm transition-all'
                  value={formValues.size}
                  onChange={updateFormValues}
                  placeholder='Ukuran'/>
              </div>
              <div className='flex items-start gap-4'>
                <label htmlFor='desc' className='w-32'>
                  Deskripsi
                </label>
                <textarea id='desc' name='desc'
                  className='outline-none border px-2 py-1 hover:shadow-md
                  w-full max-w-[260px] min-w-0 bg-slate-50 hover:bg-slate-100 focus:bg-slate-200 
                  rounded-sm transition-all'
                  value={formValues.desc}
                  onChange={updateFormValues}
                  placeholder='Deskripsi' rows={3}>
                </textarea>
              </div>
            </div>
            <div className='flex justify-end mt-6'>
              <button className='ml-auto bg-primary text-white px-6 py-3 rounded-lg disabled:bg-slate-700' 
                type='submit'
                disabled={fetching}>
                { fetching ? 'Loading' : 'Ubah' }
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>

    {
      success &&
      <CommonSuccessModal text={success} onClick={() => Router.push('/org/products')}/>
    }
    {
      error &&
      <CommonErrorModal text={error} onClick={() => setError('')}/>
    }
  </>
}
