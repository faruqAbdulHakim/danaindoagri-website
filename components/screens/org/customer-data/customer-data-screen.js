import Image from 'next/image';
import { useRef, useState, useEffect } from 'react';
import Router from 'next/router';

import { FiSearch, FiX } from 'react-icons/fi';

import API_ENDPOINT from '@/global/api-endpoint';
import CommonErrorModal from '@/components/common/common-error-modal';
import CommonModal from '@/components/common/common-modal';

export default function CustomerDataScreen() {
  const searchInputRef = useRef(null);
  const [customerDataList, setCustomerDataList] = useState([]);
  const [isError, setIsError] = useState('');
  const [userDetail, setUserDetail] = useState(null);

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
          return <CustomerCard key={idx} fullName={item.fullName} email={item.email} address={item.address} 
          detailButtonHandler={() => setUserDetail(item)} 
          />
        })}
      </div>  
    </div>
    {
      userDetail &&
      <CustomerDetail User={userDetail} closeHandler={() => setUserDetail(null)} />
    }
    {
      isError &&
      <CommonErrorModal onClick={() => setIsError('')} text={isError} />
    }
  </>
}

function CustomerCard({ fullName, email, address, detailButtonHandler }) {
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
          onClick={detailButtonHandler}
        >
          Lihat Detail
        </button>
      </div>
    </div>
  </div>
  </>
}

function CustomerDetail({ User, closeHandler }) {
  return <>
    <CommonModal>
        <div className='relative px-8 py-4'>
          <button className='absolute top-0 right-0 bg-slate-200 p-2 rounded-full 
            hover:bg-slate-600 hover:text-white active:opacity-40 transition-all'
            onClick={closeHandler}
          >
            <FiX size={18}/>
          </button>
          <div>
            <div className='text-center'>
              <Image src='/assets/images/avatar.png' alt='' width={96} height={96} 
                objectFit='cover' className='rounded-full'
              />
            </div>
            <div className='mt-6 grid grid-cols-2 gap-x-4 gap-y-2'>
              <p className='text-right text-primary'>Nama Lengkap :</p>
              <p>{User.fullName}</p>
              <p className='text-right text-primary'>Tanggal lahir :</p>
              <p>{User.dob}</p>
              <p className='text-right text-primary'>Jenis Kelamin :</p>
              <p>{User.gender}</p>
              <p className='text-right text-primary'>Alamat :</p>
              <p>{User.address}</p>
              <p className='text-right text-primary'>Kode pos :</p>
              <p>{User.postalCode}</p>
              <p className='text-right text-primary'>Email :</p>
              <p>{User.email}</p>
              <p className='text-right text-primary'>No HP :</p>
              <p>{User.tel}</p>
              <p className='text-right text-primary'>Status verifikasi :</p>
              <p>{User.isVerified ? 'Terverifikasi' : 'Belum terverifikasi'}</p>
            </div>
          </div>
        </div>
      </CommonModal>
  </>
}