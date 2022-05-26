import Router from 'next/router';
import Image from 'next/image';
import { useEffect, useState } from 'react';

import ProductsFetcher from '@/utils/functions/products-fetcher';
import CommonErrorModal from '@/components/common/common-error-modal';
import OrderFetcher from '@/utils/functions/order-fetcher';
import CONFIG from '@/global/config';
import CommonSuccessModal from '@/components/common/common-success-modal';

const { PRODUCTS_BASE_URL } = CONFIG.SUPABASE.BUCKETS.PRODUCTS;

export default function EditOfflineOrderScreen({ Order }) {
  const [formValues, setFormValues] = useState({
    productId: Order.orderdetail.products.id,
    qty: Order.orderdetail.qty,
  })
  const [productList, setProductList] = useState([]);
  const [productPrice, setProductPrice] = useState(0);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [fetching, setFetching] = useState(false);
  const [initialFetching, setInitialFetching] = useState(true);

  const inputHandler = (event) => {
    const { name, value } = event.target;
    setFormValues({
      ...formValues,
      [name]: value
    });
  }

  const submitHandler =  (event) => {
    event.preventDefault();
    setFetching(true);

    const body = {
      productId: formValues.productId,
      qty: parseInt(formValues.qty),
      productPrice,
      orderDetail: Order.orderdetail
    }
    OrderFetcher.updateOfllineOrder(body).then(({ data, error, route }) => {
      if (data) setSuccess(data);
      else if (error) setError(error);  
      else if (route) Router.push(route);
    }).catch((e) => {
      setError(e);
    }).finally(() => {
      setFetching(false);
    })
  }

  useEffect(() => {
    setInitialFetching(true);
    ProductsFetcher.fetchAllProducts().then(({ data, error, route }) => {
      if (data) setProductList(data);
      else if (error) setError(error);
      else if (route) Router.push(route);
    }).catch((e) => {
      setError(e.message);
    }).finally(() => {
      setInitialFetching(false);
    })
  }, [])

  useEffect(() => { 
    const Product = productList.find((X) => X.id === parseInt(formValues.productId));
    console.log(Product);
    const qty = formValues.qty;
    if (Product && qty) {
      let productPrice = Product.price * qty;
      Product.wsPrice.forEach((X) => {
        const {minQty, maxQty, price} = X;
        if (qty <= maxQty && qty >= minQty) {
          productPrice = price * qty;
        }
      })
      setProductPrice(productPrice)
    }
  }, [formValues.productId, formValues.qty, productList])

  return <>
    <div className='bg-white/80 backdrop-blur-md p-8 h-full'>
      <h1 className='text-lg font-semibold'>
        Ubah Pesanan
      </h1>
      <div className='mt-8 h-[calc(100vh-200px)] overflow-auto'>
        {
        initialFetching ?
        <p className='text-lg font-semibold animate-bounce text-primary'>
          Loading
        </p>
        :
        <div className='flex items-start gap-16'>
          <div className='w-60 h-60 relative rounded-md overflow-hidden'>
            {
              formValues.productId ?
              <Image src={`${PRODUCTS_BASE_URL}/${productList.find((X) => X.id === parseInt(formValues.productId))?.imgUrl}`} 
                alt='Gambar tidak ada' 
                layout='fill' 
                objectFit='cover'/>
              :
              <div className='h-full w-full p-2 flex justify-center items-center bg-slate-100'>
                <p className='text-center text-sm'>
                  Pilih produk terlebih dahulu
                </p>
              </div>
            }
          </div>
          <form onSubmit={submitHandler} className='flex-1 flex flex-col gap-4'>
            <select onChange={inputHandler} 
              name='productId'
              value={formValues.productId}
              className='w-72 border outline-none hover:bg-slate-50 focus:bg-slate-100 px-4 py-2
                hover:shadow-md focus:shadow-md rounded-md transition-all' required>
              <option disabled value=''>Pilih Produk</option>
              {productList.map((Product) => {
                return <option key={Product.id} value={Product.id}>
                  {Product.name} - {Product.size} g
                </option>
              })}
            </select>
            <div className='flex items-center gap-4'>
              <input type='text' pattern='[0-9]+' name='qty' value={formValues.qty} onChange={inputHandler}
                className='w-40 border outline-none hover:bg-slate-50 focus:bg-slate-100 px-4 py-2
                hover:shadow-md focus:shadow-md rounded-md transition-all text-center'
                placeholder='Kuantitas' 
                required />
              <p>
                Sisa stok: {formValues.productId ? productList.find((X) => X.id === parseInt(formValues.productId))?.stock : 0}
              </p>
            </div>
            <div className='mt-8'>
              <p>
                Total harga : Rp {productPrice}
              </p>
              <p className='text-sm text-slate-600'>
                Harga dapat berbeda apabila memiliki kebijakan harga grosir
              </p>
            </div>
            <div className='mt-16 w-max ml-auto'>
              <button type='submit'
                className='bg-primary disabled:bg-slate-600 text-white px-4 py-2 rounded-md
                  hover:opacity-70 active:opacity-40 transition-all'
                disabled={fetching}>
                  Ubah
              </button>
            </div>
          </form>
        </div>
        }
      </div>
    </div>
    {
      error &&
      <CommonErrorModal text={error} onClick={() => setError('')}/>
    }
    {
      success &&
      <CommonSuccessModal text={success} onClick={() => Router.push('/org/orders/offline')} />
    }
  </>
}