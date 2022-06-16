import Image from 'next/image';
import { useState, useRef, useEffect } from 'react';
import Router from 'next/router';
import Link from 'next/link';

import { FiSearch } from 'react-icons/fi';

import CONFIG from '@/global/config';
import CommonErrorModal from '@/components/common/common-error-modal';
import UserFetcher from '@/utils/functions/users-fetcher';
import CommonModal from '@/components/common/common-modal';
import CommonSuccessModal from '@/components/common/common-success-modal';


const { ROLE_NAME } = CONFIG.SUPABASE;

export default function EmployeeDataScreen( { role } ) {
  const searchInputRef = useRef(null);
  const [employeeList, setEmployeeList] = useState([]);
  const [fetching, setFetching] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [employeeId, setEmployeeId] = useState(null);

  const employeeRole = role === ROLE_NAME.MARKETING ? 'Divisi Marketing' :
      role === ROLE_NAME.PRODUCTION ? 'Divisi Produksi' : 'unknown';

  const onEmployeeDelete = (employeeId) => {
    setEmployeeId(employeeId);
  }

  const searchFormSubitHandler = (event) => {
    event.preventDefault();
    setFetching(true);
    UserFetcher.getUserByRole(role, searchInputRef.current.value).then(({data, error, route}) => {
      if (route) Router.push(route);
      else if (error) setError(error);
      else setEmployeeList(data);
    }).finally(() => {
      setFetching(false);
    });
  }

  useEffect(() => {
    setFetching(true);
    UserFetcher.getUserByRole(role, searchInputRef.current.value).then(({data, error, route}) => {
      if (route) Router.push(route);
      else if (error) setError(error);
      else setEmployeeList(data);
    }).finally(() => {
      setFetching(false);
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
          fetching ?
          <p className='text-center mt-4'>Memuat data ...</p>
          :
          <div className='grid md:grid-cols-2 lg:grid-cols-3 justify-items-center
          h-full gap-4 p-4 overflow-auto'>
            {
              employeeList.map((employee, idx) => {
                return <EmployeeCard key={idx} employee={employee} role={employeeRole} onDelete={onEmployeeDelete}/>
              })
            }
          </div>
        }
      </div>
    </div>
    {
      employeeId &&
      <EmployeeDeleteConfirmation employeeId={employeeId} setEmployeeId={setEmployeeId}
        setError={setError} setSuccess={setSuccess}/>
    }
    {
      error &&
      <CommonErrorModal onClick={() => setError('')} text={error} />
    }
    {
      success &&
      <CommonSuccessModal onClick={() => Router.reload()} text={success}/>
    }
  </>
}

function EmployeeCard({ employee, role, onDelete }) {
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
        <Link href={`/org/owner/edit-employee/${employee.id}`}>
          <a type='button' className='border rounded-full px-4 py-2 min-w-[120px] 
            hover:bg-primary hover:text-white active:opacity-40 
            text-center transition-all'>
            Ubah
          </a>
        </Link>
        <button type='button' className='border hover:bg-red-500 hover:text-white rounded-full 
          px-4 py-2 min-w-[120px]
          active:opacity-40 transition-all'
          onClick={() => onDelete(employee.id)}>
          Hapus
        </button>
      </div>
    </div>
  </>
}

function EmployeeDeleteConfirmation({ employeeId, setEmployeeId, setError, setSuccess }) {
  const [fetching, setFetching] = useState(false);

  const deleteHandler = () => {
    setFetching(true);
    UserFetcher.deleteEmployee(employeeId)
      .then(({ data, error, route }) => {
        if (data) setSuccess(data);
        else if (error) setError(error);
        else if (route) Router.push(route);
      })
      .catch((e) => setError(e.message))
      .finally(() => setFetching(false));
  }

  return <CommonModal>
    <div className='p-4'>
      <h2 className='font-semibold text-lg'>
        Yakin ingin menghapus akun karyawan?
      </h2>
      <div className='flex flex-wrap justify-evenly gap-10 mt-4'>
        <button type='button' 
          className='bg-gray-400 hover:bg-red-600 disabled:hover:bg-gray-400 w-28 py-3 rounded-full text-white 
          transition-all duration-200'
          onClick={() => setEmployeeId(null)}
          disabled={fetching}
        >
          Batal
        </button>
        <button type='button' 
          className='bg-gradient-to-br from-red-600 to-red-600/40 hover:to-red-600/70 disabled:from-gray-400 
          disabled:to-gray-200 w-28 py-3 rounded-full text-white transition-all duration-200'
          onClick={deleteHandler}
          disabled={fetching}
        >
          Hapus
        </button>
      </div>
    </div>
  </CommonModal>
}
