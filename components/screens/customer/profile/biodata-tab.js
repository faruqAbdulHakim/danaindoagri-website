import Image from 'next/image';
import Router from 'next/router';
import { useState, useRef } from 'react';

import { FiEdit } from 'react-icons/fi';

import EditBiodataModal from './edit-biodata-modal';
import CommonSuccessModal from '@/components/common/common-success-modal';
import CommonErrorModal from '@/components/common/common-error-modal';
import UserFetcher from '@/utils/functions/users-fetcher';
import CONFIG from '@/global/config';

const { BUCKETS } = CONFIG.SUPABASE;

export default function BiodataTab({ User }) {
  const [isEdit, setIsEdit] = useState('');

  const editButtonHandler = (editData) => {
    setIsEdit(editData);
  }

  const closeModalHandler = () => {
    setIsEdit('');
  }
  return <>
    <div className='sm:flex gap-8'>
      <div>
        <UserImage User={User} />
      </div>
      <div className='flex flex-col gap-4 w-max mx-auto sm:mx-0'>
        
        <h2 className='text-slate-700 text-xl mt-6'>
          Biodata diri
        </h2>

        <div className='flex items-center justify-between max-w-xs sm:max-w-none gap-4'>
          <div className='sm:flex'>
            <p className='sm:w-32 font-thin'>
              Nama
            </p>
            <p className='sm:w-44 font-thin'>
              {User?.fullName}
            </p>
          </div>
          <div className=''>
            <EditButton onClick={() => editButtonHandler('fullName')} />
          </div>
        </div>

        <div className='flex items-center justify-between max-w-xs sm:max-w-none gap-4'>
          <div className='sm:flex'>
            <p className='sm:w-32 font-thin'>
              Tanggal Lahir
            </p>
            <p className='sm:w-44 font-thin'>
              {User?.dob}
            </p>
          </div>
          <div className=''>
            <EditButton onClick={() => editButtonHandler('dob')} />
          </div>
        </div>

        <div className='flex items-center justify-between max-w-xs sm:max-w-none gap-4'>
          <div className='sm:flex'>
            <p className='sm:w-32 font-thin'>
              Jenis Kelamin
            </p>
            <p className='sm:w-44 font-thin'>
              {User?.gender}
            </p>
          </div>
          <div className=''>
            <EditButton onClick={() => editButtonHandler('gender')} />
          </div>
        </div>

        <h2 className='text-slate-700 text-xl mt-6'>
          Kontak
        </h2>

        <div className='flex items-center justify-between max-w-xs sm:max-w-none gap-4'>
          <div className='sm:flex'>
            <p className='sm:w-32 font-thin'>
              Email
            </p>
            <p className='sm:w-44 font-thin'>
              {User?.email}
            </p>
          </div>
          <div className=''>
            <EditButton onClick={() => editButtonHandler('email')} />
          </div>
        </div>

        <div className='flex items-center justify-between max-w-xs sm:max-w-none gap-4'>
          <div className='sm:flex'>
            <p className='sm:w-32 font-thin'>
              No HP
            </p>
            <p className='sm:w-44 font-thin'>
              {User?.tel}
            </p>
          </div>
          <div className=''>
            <EditButton onClick={() => editButtonHandler('tel')} />
          </div>
        </div>

      </div>
    </div>

    {
      isEdit === 'fullName' ? 
      <EditBiodataModal 
        headingText='Nama' 
        defaultValue={User?.fullName} 
        closeModalHandler={closeModalHandler}
        name='fullName'
      />
      :
      isEdit === 'dob' ?
      <EditBiodataModal 
        headingText='Tanggal Lahir'
        defaultValue={User?.dob}
        closeModalHandler={closeModalHandler}
        name='dob'
      />
      :
      isEdit === 'gender' ?
      <EditBiodataModal
        headingText='Jenis Kelamin'
        defaultValue={User?.gender}
        closeModalHandler={closeModalHandler}
        name='gender'
      />
      :
      isEdit === 'email' ?
      <EditBiodataModal 
        headingText='Email'
        defaultValue={User?.email}
        closeModalHandler={closeModalHandler}
        name='email'
      />
      :
      isEdit === 'tel' ?
      <EditBiodataModal
        headingText='No HP'
        defaultValue={User?.tel}
        closeModalHandler={closeModalHandler}
        name='tel'
      />
      :
      <></>
    }
  </>
}

function UserImage({ User }) {
  const [imageError, setImageError] = useState(false);
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);
  const [fetching, setFetching] = useState(false);

  const fileInputRef = useRef(null);

  const fileInputChange = (event) => {
    const file = event.target.files[0];
    setFetching(true);
    UserFetcher.updateAvatar(User.id, file).then(({ data, error, route }) => {
      if (route) Router.push(route);
      else if (error) setError(error);
      else if (data) setSuccess(data);
    }).finally(() => {
      setFetching(false);
    });
  }

  return <>
    <div className='bg-white p-4 rounded-md shadow-xl shadow-black/5 w-max mx-auto'>
      <div className='relative h-40 w-40 sm:h-44 sm:w-44 font-thin rounded-md overflow-hidden'>
        {
          imageError ?
          <Image src='/assets/images/avatar.png' alt='' layout='fill' objectFit='cover'/>
          :
          <Image src={`${BUCKETS.AVATARS.AVATAR_BASE_URL}/avatar${User.id}`} alt='' layout='fill' objectFit='cover'
            onError={() => setImageError(true)} unoptimized={true}/>
        }
      </div>
      <button className='mt-3 w-full py-2 border hover:bg-slate-100 rounded-md'
        onClick={() => fileInputRef.current.click()} disabled={fetching}>
        Ubah foto
      </button>
      <input ref={fileInputRef} type='file' className='hidden' accept='image/jpeg,image/png'
        onChange={fileInputChange}/>
    </div>
    {
      success && 
      <CommonSuccessModal onClick={() => Router.reload()} text={success} />
    }
    {
      error &&
      <CommonErrorModal onClick={() => Router.reload()} text={error} />
    }
  </>
}

function EditButton({ onClick }) {
  return <>
    <button className='text-primary hover:scale-110 active:opacity-40 transition-all'
      type='button'
      onClick={onClick}
    >
      <FiEdit size={20}/>
    </button>
  </>
}
