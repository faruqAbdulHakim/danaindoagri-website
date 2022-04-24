// reference : customer/profile/address-tab.js

import Router from 'next/router';
import { useState, useRef } from 'react';

import CommonModal from '@/components/common/common-modal';
import API_ENDPOINT from '@/global/api-endpoint';
import CommonErrorModal from '@/components/common/common-error-modal';
import CommonSuccessModal from '@/components/common/common-success-modal';
import CONFIG from '@/global/config';

const { ROLE_NAME } = CONFIG.SUPABASE;

export default function AddressTab({ User }) {
  const [isEditMode, setIsEditMode] = useState(false);

  const roleName = User?.role?.roleName;
  const canEdit = roleName !== ROLE_NAME.MARKETING && roleName !== ROLE_NAME.PRODUCTION;

  return <>
    <div>
      <p className='text-lg'>Alamat : {User?.address}</p>
      <p className='text-slate-700'>Kode Pos : {User?.postalCode}</p>
      {
        canEdit && 
        <button type='button' className='mt-2 px-4 py-2 border-2 border-primary rounded-md 
          hover:bg-primary hover:text-white active:opacity-40 transition-all'
          onClick={() => setIsEditMode(true)}
        >
          Ubah Alamat
        </button>
      }
    </div>

    {isEditMode &&
    <EditAddressModal closeModalHandler={() => setIsEditMode(false)}/>
    }
  </>
}

function EditAddressModal({ closeModalHandler }) {
  const [isSubmiting, setIsSubmiting] = useState(false);
  const [editError, setEditError] = useState('');
  const [isEditSuccess, setIsEditSucces] = useState(false);
  const addressRef = useRef(null);
  const postalCodeRef = useRef(null);

  const submitHandler = (event) => {
    event.preventDefault();
    setIsSubmiting(true);

    const formValue = {
      address: addressRef.current.value,
      postalCode: postalCodeRef.current.value,
    }
    fetch(API_ENDPOINT.USERS_CHANGE_ADDRESS, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify(formValue),
    }).then((res) => {
      return res.json();
    }).then((resJson) => {
      if (resJson.status === 300) {
        Router.push(resJson.location);
      } else if (resJson.status === 400) {
        setEditError(resJson.message);
      } else if (resJson.status === 200) {
        setIsEditSucces(true);
      }
    }).catch(() => {
      setEditError('Terjadi kesalahan di sisi server')
    }).finally(() => {
      setIsSubmiting(false);
    })
  }

  return <>
    {!editError && !isEditSuccess &&
    <CommonModal>
      <form className='sm:px-16 sm:py-8' onSubmit={submitHandler}>
        <h2 className='text-center text-xl font-semibold'>Ubah Password</h2>
        <div className='flex flex-col w-80'>
          <input type='text' placeholder='Alamat'
            className='mt-4 text-lg outline-none border-b-2 border-slate-300 focus:border-primary 
            px-4 py-1 text-center min-w-0 w-full max-w-sm'
            ref={addressRef}
          />
          <input type='text' placeholder='Kode Pos'
            className='mt-4 text-lg outline-none border-b-2 border-slate-300 focus:border-primary 
            px-4 py-1 text-center min-w-0 w-full max-w-sm'
            ref={postalCodeRef}
          />
        </div>
        <div className='flex flex-wrap justify-evenly gap-10 mt-4'>
          <button type='button' 
            className='bg-gray-400 hover:bg-red-600 disabled:hover:bg-gray-400 w-28 py-3 rounded-full text-white 
            transition-all duration-200'
            onClick={closeModalHandler}
            disabled={isSubmiting}
          >
            Batal
          </button>
          <button type='submit' 
            className='bg-gradient-to-br from-primary to-primary/40 hover:to-primary/70 disabled:from-gray-400 
            disabled:to-gray-200 w-28 py-3 rounded-full text-white transition-all duration-200'
            disabled={isSubmiting}
          >
            Simpan
          </button>
        </div>
      </form>
    </CommonModal>
    }

    {editError &&
    <CommonErrorModal onClick={() => setEditError('')} text={editError} />
    }

    {isEditSuccess &&
    <CommonSuccessModal onClick={() => {Router.reload()}} text='Data berhasil diubah' />
    }
  
  </>
}
