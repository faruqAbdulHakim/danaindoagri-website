import Link from 'next/link';
import { useState, useEffect } from 'react';

import { FiSearch } from 'react-icons/fi';

import ProductItem from './product-item';

export default function ProductList() {
  const [searchVal, setSearchVal] = useState('');
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);

  const searchInputHandler = (event) => {
    setSearchVal(event.target.value);
  }

  useEffect(() => {
    const DUMMY_DATA = [
      {
        id: 1,
        name: 'Pupuk Organik Cair',
        size: '200 ml',
        stock: 230,
        price: 150000,
        imgUrl: 'https://picsum.photos/200',
      },
      {
        id: 2,
        name: 'Pupuk Organik Kering',
        size: '200 ml',
        stock: 230,
        price: 150000,
        imgUrl: 'https://picsum.photos/200',
      },
      {
        id: 3,
        name: 'Pupuk Xpander',
        size: '200 ml',
        stock: 230,
        price: 150000,
        imgUrl: 'https://picsum.photos/200',
      },
      {
        id: 4,
        name: 'Mobil Honda',
        size: '200 ml',
        stock: 230,
        price: 150000,
        imgUrl: 'https://picsum.photos/200',
      },
      {
        id: 5,
        name: 'Pupuk wow',
        size: '200 ml',
        stock: 230,
        price: 150000,
        imgUrl: 'https://picsum.photos/200',
      },
    ];
    setProducts(DUMMY_DATA);
  }, []);

  useEffect(() => {
    setFilteredProducts(
      products.filter(({ name }) => name.toLowerCase().includes(searchVal))
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
        <Link href='/'>
          <a className='bg-primary text-white px-4 py-2 block leading-relaxed rounded-lg
            hover:opacity-70 active:opacity-40 transition-all'>
            Tambah Produk
          </a>
        </Link>
      </div>
      <div className='mt-4 grid md:grid-cols-2 xl:grid-cols-3 justify-items-center gap-8
        max-h-[calc(100vh-240px)] overflow-auto border rounded-lg p-4 bg-white/40 shadow-md'>
        {
          filteredProducts.map((product) => {
            return <ProductItem product={product} key={product.id}/>
          })
        }
      </div>
    </div>
  </>
}

