import Link from 'next/link';
import Router from 'next/router';
import { useState, useEffect } from 'react';

import { FiSearch } from 'react-icons/fi';

import ProductItem from './product-item';
import EditStockModal from './edit-stock-modal';
import ProductsFetcher from '@/utils/functions/products-fetcher';
import CommonErrorModal from '@/components/common/common-error-modal';
import CONFIG from '@/global/config';

const { ROLE_NAME } = CONFIG.SUPABASE;

export default function ProductList({ userRole }) {
  const [searchVal, setSearchVal] = useState('');
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState('');
  const [editStockModal, setEditStockModal] = useState(null); // fill with productid
  

  const searchInputHandler = (event) => {
    setSearchVal(event.target.value);
  }

  useEffect(() => {
    ProductsFetcher.fetchAllProducts().then(({ data, error, route }) => {
      if (data) setProducts(data);
      else if (error) setError(error);
      else if (route) Router.push(route);
    }).catch((e) => {
      setError(e.message);
    }).finally(() => {
      setFetching(false);
    });
  }, []);

  useEffect(() => {
    setFilteredProducts(
      products
        .filter(({ name }) => name.toLowerCase().includes(searchVal))
        .sort((a, b) => {
          return a.name.toLowerCase() < b.name.toLowerCase() ? -1 : 1;
        })
    )
  }, [products, searchVal]);

  return <>
    <div className='p-6 bg-white/80 backdrop-blur-md rounded-r-3xl 
      h-full shadow-black/5'>
      <h1 className='text-2xl font-semibold'>
        Produk
      </h1>
      <div className='mt-4 flex gap-4'>
        <form className='flex items-center w-full max-w-xl relative' onSubmit={(event) => {event.preventDefault()}}>
          <input type='text' placeholder='Cari produk...' 
            className='outline-none border pl-4 pr-10 py-2 rounded-lg 
            shadow-sm hover:shadow-md focus:shadow-md transition-all bg-transparent min-w-0 flex-1'
            value={searchVal} onChange={searchInputHandler}
          />
          <div className='text-slate-300 px-4 absolute right-0'>
            <FiSearch />
          </div>
        </form>
        {
          userRole === ROLE_NAME.MARKETING &&
          <Link href='/org/products/add-product'>
            <a className='bg-primary text-white px-4 py-2 block leading-relaxed rounded-lg
              hover:opacity-70 active:opacity-40 transition-all'>
              Tambah Produk
            </a>
          </Link>
        }
      </div>

      <div className='mt-4 grid md:grid-cols-2 xl:grid-cols-3 justify-items-center gap-8
        max-h-[calc(100vh-240px)] overflow-auto border rounded-lg p-4 bg-white/40 shadow-md'>
        {
          fetching &&
          <p>Loading ... </p>
        }
        {
          filteredProducts.map((product) => {
            return <ProductItem Product={product} userRole={userRole} key={product.id}
              setEditStockModal={setEditStockModal} setError={setError}/>
          })
        }
      </div>
    </div>
    {
      error &&
      <CommonErrorModal text={error} onClick={() => setError('')}/>
    }
    {
      editStockModal &&
      <EditStockModal Product={filteredProducts.find((X) => X.id === editStockModal)} 
        setEditStockModal={setEditStockModal}
        setError={setError} />
    }
  </>
}

