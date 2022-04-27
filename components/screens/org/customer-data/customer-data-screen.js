import Image from 'next/image';
import { useRef, useState, useEffect } from 'react';
import Router from 'next/router';

import { FiSearch } from 'react-icons/fi';

import API_ENDPOINT from '@/global/api-endpoint';
import CommonErrorModal from '@/components/common/common-error-modal';

export default function CustomerDataScreen() {
  const searchInputRef = useRef(null);
  const [customerDataList, setCustomerDataList] = useState([]);
  const [isError, setIsError] = useState('');

  const searchFormSubitHandler = (event) => {
    event.preventDefault();
    setCustomerDataList([]);
    const searchInputVal = searchInputRef.current.value;

    fetch(API_ENDPOINT.GET_CUSTOMER_DATA + `?searchQuery=${searchInputVal}`).then((res) => {
      return res.json();
    }).then((resJson) => {
      if (resJson.status === 200) {
        setCustomerDataList(resJson.data);
      } else if (resJson.status === 300) {
        Router.push(resJson.location);
      } else {
        setIsError(resJson.message)
      }
    }).catch((error) => {
      setIsError(error.message)
    })
  }

  useEffect(() => {
    fetch(API_ENDPOINT.GET_CUSTOMER_DATA).then((res) => {
      return res.json();
    }).then((resJson) => {
      if (resJson.status === 200) {
        setCustomerDataList(resJson.data);
      } else if (resJson.status === 300) {
        Router.push(resJson.location);
      } else {
        setIsError(resJson.message)
      }
    }).catch((error) => {
      setIsError(error.message)
    })
  }, [])

  return <>
    <div className='p-6 bg-white/80 backdrop-blur-md rounded-r-3xl h-full shadow-black/5 flex flex-col'>
      <div>
        <form className='flex flex-wrap gap-2' onSubmit={searchFormSubitHandler}>
          <input ref={searchInputRef} type='text' placeholder='Cari berdasarkan nama...' 
            className='outline-none border w-full max-w-md px-4 py-2 rounded-lg 
            shadow-sm hover:shadow-md focus:shadow-md transition-all'
          />
          <button type='submit'
            className='bg-primary text-white flex items-center gap-2 px-4 py-2 rounded-lg
            hover:opacity-70 active:opacity-40 transition-all'
          >
              <FiSearch/> Cari
          </button>
        </form>
      </div>    

      <p className='mt-3'>Menampilkan 5 pencarian teratas</p>
      <div className='flex-1 border border-slate-400 shadow-md rounded-md p-4 space-y-4'>
        {customerDataList.map((item, idx) => {
          return <CustomerCard key={idx} fullName={item.fullName} email={item.email} address={item.address} />
        })}
      </div>  
    </div>
    {
      isError &&
      <CommonErrorModal onClick={() => setIsError('')} text={isError} />
    }
  </>
}

function CustomerCard({ fullName, email, address }) {
  return <>
  <div className='bg-white hover:bg-slate-100 border px-4 py-2 rounded-lg flex items-center shadow-sm'>
    <div className='ml-4 mr-8'>
      <Image src='/assets/images/avatar.png' alt='avatar' width={45} height={45} 
      objectFit='cover' className='rounded-full'/>
    </div>
    <div className='flex-1 flex justify-between gap-8 flex-wrap'>
      <div className='flex-1 flex items-center justify-between'>
        <p className='w-full'>
          {fullName}
        </p>
        <p className='w-full'>
          {email}
        </p>
        <p className='text-primary w-full'>
          {address}
        </p>
      </div>
      <div>
        <button
          className='border px-4 py-2 rounded-full hover:bg-primary hover:text-white shadow-sm
          active:opacity-40 transition-all'
          >
          Lihat Detail
        </button>
      </div>
    </div>
  </div>
  </>
}
