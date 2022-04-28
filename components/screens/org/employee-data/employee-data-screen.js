import Image from 'next/image';
import { useState, useRef, useEffect } from 'react';
import Router from 'next/router';

import { FiSearch } from 'react-icons/fi';

import CONFIG from '@/global/config';
import userFetcher from '@/utils/functions/users-fetcher';
import CommonErrorModal from '@/components/common/common-error-modal';
import Link from 'next/link';

const { ROLE_NAME } = CONFIG.SUPABASE;

export default function EmployeeDataScreen( { role } ) {
  const searchInputRef = useRef(null);
  const [employeeList, setEmployeeList] = useState([]);
  const [isFetching, setIsFetching] = useState(false);
  const [isError, setIsError] = useState('');

  const employeeRole = role === ROLE_NAME.MARKETING ? 'Divisi Marketing' :
      role === ROLE_NAME.PRODUCTION ? 'Divisi Produksi' : 'unknown';

  const searchFormSubitHandler = (event) => {
    event.preventDefault();
    setIsFetching(true);
    userFetcher(role, searchInputRef.current.value).then(({data, error, route}) => {
      if (route) Router.push(route);
      else if (error) setIsError(error);
      else setEmployeeList(data);
    }).finally(() => {
      setIsFetching(false);
    });
  }

  useEffect(() => {
    setIsFetching(true);
    userFetcher(role, searchInputRef.current.value).then(({data, error, route}) => {
      if (route) Router.push(route);
      else if (error) setIsError(error);
      else setEmployeeList(data);
    }).finally(() => {
      setIsFetching(false);
    });
  }, [role]);

  return <>
    <div className='bg-white/80 backdrop-blur-md h-full max-h-[calc(100vh-140px)] rounded-r-3xl p-6'>
      <div>
        <form className='flex-1 flex flex-wrap gap-2' onSubmit={searchFormSubitHandler}>
          <input ref={searchInputRef} type='text' placeholder='Cari berdasarkan nama...' 
            className='outline-none border w-full max-w-md px-4 py-2 rounded-lg 
            shadow-sm hover:shadow-md focus:shadow-md transition-all min-w-0'
          />
          <div className='flex-1 flex justify-between'>
            <button type='submit'
              className='bg-primary text-white flex items-center gap-2 px-4 py-2 rounded-lg
              hover:opacity-70 active:opacity-40 transition-all'
            >
              <FiSearch/> Cari
            </button>
            <Link href='/org/owner/add-employee'>
              <a className='bg-primary text-white px-4 py-2 rounded-lg
                hover:opacity-70 active:opacity-40 transition-all'
              >
                Tambah Karyawan
              </a>
            </Link>
          </div>
        </form>
      </div>    

      <div className='mt-4 h-full border border-slate-300 shadow-md rounded-lg'>
        {
          isFetching ?
          <p className='text-center mt-4'>Memuat data ...</p>
          :
          <div className='grid md:grid-cols-2 lg:grid-cols-3 justify-items-center
          h-full gap-4 p-4 overflow-auto'>
            {
              employeeList.map((employee, idx) => {
                return <EmployeeCard key={idx} employee={employee} role={employeeRole} />
              })
            }
          </div>
        }
      </div>
    </div>

    {
      isError &&
      <CommonErrorModal onClick={() => setIsError('')} text={isError} />
    }
  </>
}

function EmployeeCard({ employee, role }) {
  return <>
    <div className='bg-white border shadow-md p-4 rounded-xl w-full max-w-[320px] h-max'>
      <div className='text-center'>
        <Image src='/assets/images/avatar.png' alt='' width={80} height={80} className='rounded-full'/>
      </div>
      <div>
        <p className='text-center'>
          {employee.fullName}
        </p>
        <p className='text-center text-primary text-sm'>
          {role}
        </p>
      </div>
      <hr  className='mt-2'/>
      <div className='flex flex-col justify-center items-center mt-2 gap-2'>
        <button type='button' className='border rounded-full px-4 py-2 min-w-[120px] 
          hover:bg-primary hover:text-white hover:opacity-70 active:opacity-40 transition-all'>
          Ubah
        </button>
        <button type='button' className='bg-primary text-white rounded-full px-4 py-2 min-w-[120px]
          hover:opacity-70 active:opacity-40 transition-all'>
          Hapus
        </button>
      </div>
    </div>
  </>
}