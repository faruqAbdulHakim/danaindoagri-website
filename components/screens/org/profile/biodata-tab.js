// reference : customer/profile/biodata-tab.js

import Image from 'next/image';
import { useState } from 'react';

import { FiEdit } from 'react-icons/fi';

import EditBiodataModal from './edit-biodata-modal';
import CONFIG from '@/global/config';

const { ROLE_NAME } = CONFIG.SUPABASE;

export default function BiodataTab({ User }) {
  const [isEdit, setIsEdit] = useState('');

  const editButtonHandler = (editData) => {
    setIsEdit(editData);
  }

  const closeModalHandler = () => {
    setIsEdit('');
  }

  const roleName = User?.role?.roleName;

  const canEdit = roleName !== ROLE_NAME.MARKETING && roleName !== ROLE_NAME.PRODUCTION

  return <>
    <div className='sm:flex gap-8'>
      <div>
        <UserImage />
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
          {
            canEdit &&
            <div>
              <EditButton onClick={() => editButtonHandler('fullName')} />
            </div>
          }
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
          {
            canEdit && 
            <div>
              <EditButton onClick={() => editButtonHandler('dob')} />
            </div>
          }
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
          {
            canEdit && 
            <div>
              <EditButton onClick={() => editButtonHandler('gender')} />
            </div>
          }
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
          {
            canEdit && 
            <div>
              <EditButton onClick={() => editButtonHandler('email')} />
            </div>
          }
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
          {
            canEdit && 
            <div>
              <EditButton onClick={() => editButtonHandler('tel')} />
            </div>
          }
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

function UserImage() {
  return <>
    <div className='bg-white p-4 rounded-md shadow-xl shadow-black/5 w-max mx-auto'>
      <div className='relative h-40 w-40 sm:h-44 sm:w-44 font-thin rounded-md overflow-hidden'>
        <Image src='/assets/images/avatar.png' alt='' layout='fill' objectFit='cover'/>
      </div>
      <button className='mt-3 w-full py-2 border hover:bg-slate-100 rounded-md'>Ubah foto</button>
    </div>
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
