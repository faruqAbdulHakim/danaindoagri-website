import Image from 'next/image';
import Router from 'next/router';
import { useRef, useState } from 'react';

import CommonSuccessModal from '@/components/common/common-success-modal';
import CommonErrorModal from '@/components/common/common-error-modal';
import ProductsFetcher from '@/utils/functions/products-fetcher';

export default function AddProductForm() {
  const inputFileRef = useRef(null);
  const [imageSrc, setImageSrc] = useState('');
  const [fetching, setFetching] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [countWsPrice, setCountWsPrice] = useState(0);
  const [formValues, setFormValues] = useState({
    name: '',
    size: '',
    desc: '',
    price: '',
    wsPrice: [],
  })

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

  // wsprice
  const updateWsPrice = (i, name, value) => {
    const updatedWsPrice = formValues.wsPrice;
    updatedWsPrice[i][name] = value;
    setFormValues({
      ...formValues,
      wsPrice: updatedWsPrice,
    });
  }

  const deleteWsPrice = (i) => {
    const updatedWsPrice = formValues.wsPrice;
    updatedWsPrice.splice(i, 1);
    setCountWsPrice(countWsPrice-1);
    setFormValues({
      ...formValues,
      wsPrice: updatedWsPrice,
    })
  }

  const wsPriceInputElements = [];
  for (let i = 0; i < countWsPrice; i++) {
    wsPriceInputElements.push(
      <div key={i} className='flex items-center'>
        <p className='w-8'>
          {i + 1}
        </p>
        <div className='w-40 flex items-center justify-between gap-2'>
          <input type='text' name={`minQty${i}`} placeholder='min' className='p-1 min-w-0 border rounded-sm
            bg-slate-50 hover:bg-slate-100 focus:bg-slate-200 outline-none hover:shadow-md transition-all' 
            onChange={(event) => updateWsPrice(i, 'minQty', event.target.value)}
            value={formValues.wsPrice[i].minQty}
            pattern='[0-9]+'/>
          <input type='text' name={`maxQty${i}`} placeholder='max' className='p-1 min-w-0 border rounded-sm
            bg-slate-50 hover:bg-slate-100 focus:bg-slate-200 outline-none hover:shadow-md transition-all' 
            onChange={(event) => updateWsPrice(i, 'maxQty', event.target.value)}
            value={formValues.wsPrice[i].maxQty}
            pattern='[0-9]+'/>
        </div>
        <input type='text' name={`wsPrice${i}`} 
          placeholder='harga'
          className='p-1 w-40 border rounded-sm ml-4 bg-slate-50 hover:bg-slate-100 focus:bg-slate-200 outline-none 
          hover:shadow-md transition-all'
          onChange={(event) => updateWsPrice(i, 'price', event.target.value)} 
          value={formValues.wsPrice[i].price}
          pattern='[0-9]+'
        />
        <button type='button'
          className='text-primary text-sm ml-2 hover:opacity-70 active:opacity-40 transition-all'
          onClick={() => deleteWsPrice(i)}>
          Hapus
        </button>
      </div>
    )
  }

  const addNewWs = () => {
    const wsPrice = formValues.wsPrice;
    wsPrice.push(
      {
        minQty: '',
        maxQty: '',
        price: '',
      }
    )
    setFormValues({
      ...formValues,
      wsPrice
    })
    setCountWsPrice(countWsPrice + 1);
  }

  // form submit
  const submitHandler = (event) => {
    event.preventDefault();
    setFetching(true);

    const file = inputFileRef.current.files[0];

    const formData = new FormData();
    formData.append('file', file);
    
    const { wsPrice, ...productForm } = formValues;
    Object.entries(productForm).forEach(([key, value]) => {
      formData.append(key, value);
    });

    formData.append('wsPrice', JSON.stringify(wsPrice))

    ProductsFetcher.addNewProduct(formData).then(({ data, error, route }) => {
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
          Tambah Produk
        </h1>
        <div className='flex gap-6 mt-6'>
          <div className='p-4 shadow-lg rounded-lg h-max'>
            <div className='h-40 w-40 relative rounded-md overflow-hidden'>
              {
                imageSrc ?
                <Image src={imageSrc} alt='' layout='fill' className='bg-white'/>
                :
                <div className='h-full w-full bg-slate-200 p-4 text-xs'>
                  Belum mengunggah gambar
                </div>
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
                <label htmlFor='size' className='w-32'>
                  Ukuran (gram)
                </label>
                <input type='text' id='size' name='size' 
                  className='outline-none border px-2 py-1 hover:shadow-md
                  w-full max-w-[260px] min-w-0 bg-slate-50 hover:bg-slate-100 focus:bg-slate-200 
                  rounded-sm transition-all'
                  value={formValues.size}
                  onChange={updateFormValues}
                  pattern='[0-9]+'
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
              <div className='flex items-start gap-4'>
                <label htmlFor='price' className='w-32'>
                  Harga Satuan
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
              <div className='flex flex-col gap-2'>
                <h3>Harga Grosir</h3>
                <div className='flex items-center'>
                  <span className='w-8'></span>
                  <p className='w-40 text-sm'>Total Produk (buah)</p>
                  <p className='w-40 text-sm ml-4'>Harga Barang / Buah</p>
                </div>

                {wsPriceInputElements}

                <div className='flex items-center'>
                  <p className='w-8'>
                    {countWsPrice + 1}
                  </p>
                  <div className='w-40 flex items-center justify-between gap-2'>
                    <input type='number' name='disabled-min' className='min-w-0 border rounded-sm bg-gray-200' disabled />
                    <input type='number' name='disabled-max' className='min-w-0 border rounded-sm bg-gray-200' disabled />
                  </div>
                  <input type='number' name='disabled-ws-price' 
                    className='w-40 border rounded-sm bg-gray-200 ml-4' 
                    disabled 
                  />
                </div>
                <div>
                  <button type='button' className='text-primary hover:underline active:opacity-40 transition-all' 
                    onClick={addNewWs}>
                    Tambah
                  </button>
                </div>
              </div>
            </div>
            <div className='flex justify-end mt-6'>
              <button className='ml-auto bg-primary text-white px-6 py-3 rounded-lg disabled:bg-slate-700' 
                type='submit'
                disabled={fetching}>
                { fetching ? 'Loading' : 'Tambah' }
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
