import Router from 'next/router';
import { useEffect, useState } from 'react';

import ProductsFetcher from '@/utils/functions/products-fetcher';
import CommonErrorModal from '@/components/common/common-error-modal';
import ProductItem from './product-item';

export default function ProductList() {
  const [productList, setProductList] = useState([]);
  const [fetching, setFetching] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    setFetching(true);
    ProductsFetcher.fetchAllProducts().then(({ data, error, route }) => {
      if (data) setProductList(data);
      else if (error) setError(error);
      else if (route) Router.push(route);
    }).catch((e) => {
      setError(e.message);
    }).finally(() => {
      setFetching(false);
    })
  }, [])

  return <>
    {
      fetching ?
      <p className='text-center font-semibold text-2xl text-primary  mt-4
      animate-bounce'>
        Loading...
      </p>
      :
      productList.length === 0 ?
      <p>
        Tidak dapat menemukan produk.
      </p>
      :
      <>
      <div className='mt-6'>
        <div className='grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 justify-items-center gap-6'>
          {
            productList.map((Product) => {
              return <ProductItem key={Product.id} Product={Product}/>
            })
          }
        </div>
      </div>
      </>
    }
    {
      error &&
      <CommonErrorModal text={error} onClick={() => {Router.push('/')}}/>
    }
  </>
}

