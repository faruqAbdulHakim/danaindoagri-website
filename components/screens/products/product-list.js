import Router from 'next/router';
import { useEffect, useState } from 'react';

import ProductsFetcher from '@/utils/functions/products-fetcher';
import CommonErrorModal from '@/components/common/common-error-modal';
import ProductItem from './product-item';

export default function ProductList() {
  const [productList, setProductList] = useState([]);
  const [filteredProductList, setFilteredProductList] = useState([]);
  const [searchText, setSearchText] = useState('');
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

  
  useEffect(() => {
    if (productList.length > 0) {
      const updated = productList
        .filter((Product) => Product.name.includes(searchText))
        .sort((a, b) => {
          return a.name.toLowerCase() < b.name.toLowerCase() ? -1 : 1;
        });
      setFilteredProductList(updated);
    }
  }, [productList, searchText])

  return <>
    {
      fetching ?
      <p className='text-center font-semibold text-2xl text-primary  mt-4
      animate-bounce'>
        Loading...
      </p>
      :
      filteredProductList.length === 0 ?
      <p>
        Tidak dapat menemukan produk.
      </p>
      :
      <>
      <input type='text' 
        className='mt-2 outline-none bg-[#f5f5f5]
          w-full max-w-md min-w-0 ml-4 hover:shadow-md focus:shadow-md
          px-4 py-2 rounded-md transition-all'
        value={searchText}
        onChange={(event) => setSearchText(event.target.value)}
        placeholder='Cari produk berdasarkan nama'/>
      <div className='mt-4'>
        <div className='grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 justify-items-center gap-6'>
          {
            filteredProductList.map((Product) => {
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

