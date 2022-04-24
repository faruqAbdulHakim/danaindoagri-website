// reference : customer/profile/authentication-tab

import Router from 'next/router';
import { useState, useRef } from 'react';

import API_ENDPOINT from '@/global/api-endpoint';
import CommonModal from '@/components/common/common-modal';
import CommonErrorModal from '@/components/common/common-error-modal';
import CommonSuccessModal from '@/components/common/common-success-modal';
import CONFIG from '@/global/config';

const { ROLE_NAME } = CONFIG.SUPABASE;

export default function AuthenticationTab({ User }) {
  const [isEditPassword, setIsEditPassword] = useState(false);
  const [isLogout, setIsLogout] = useState(false);

  const editPasswordButtonHandler = () => {
    setIsEditPassword(true);
  }

  const closeModalHandler = () => {
    setIsEditPassword(false);
  }

  const roleName = User?.role?.roleName;
  const canEdit = roleName !== ROLE_NAME.MARKETING && roleName !== ROLE_NAME.PRODUCTION;

  const logOutHandler = () => {
    setIsLogout(true);
    fetch(API_ENDPOINT.LOGOUT).then((res) => {
      return res.json();
    }).then((resJson) => {
      if (resJson.status === 300) {
        Router.push(resJson.location);
      }
    }).finally(() => {
      setIsLogout(false);
    })
  }

  return <>
    <div className='flex justify-center gap-3'>
      {
        canEdit &&
        <button type='button' 
          className='bg-primary text-white px-4 py-3 rounded-full hover:opacity-70 
          active:opacity-40 transition-all'
          disabled={isLogout}
          onClick={editPasswordButtonHandler}
        >
          Ubah Password
        </button>
      }
      <button type='button' 
        className='bg-red-600 text-white px-4 py-3 rounded-full hover:opacity-70 
        active:opacity-40 transition-all'
        disabled={isLogout}
        onClick={logOutHandler}
      >
        Logout
      </button>
    </div>

    {
      isEditPassword &&
      <EditPasswordModal closeModalHandler={closeModalHandler}/>
    }
  </>
}

function EditPasswordModal({ closeModalHandler }) {
  const [isSubmiting, setIsSubmiting] = useState(false);
  const [isEditSuccess, setIsEditSucces] = useState(false);
  const [editError, setEditError] = useState('');
  const passwordRef = useRef(null);
  const newPasswordRef = useRef(null);
  const newPasswordConfirmationRef = useRef(null);

  const submitHandler = (event) => {
    event.preventDefault();
    setIsSubmiting(true);

    const formValue = {
      password: passwordRef.current.value,
      newPassword: newPasswordRef.current.value,
      newPasswordConfirmation: newPasswordConfirmationRef.current.value,
    }
    fetch(API_ENDPOINT.USERS_CHANGE_PASSWORD, {
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
          <input type='password' placeholder='Password Lama'
            className='mt-4 text-lg outline-none border-b-2 border-slate-300 focus:border-primary 
            px-4 py-1 text-center min-w-0 w-full max-w-sm'
            ref={passwordRef}
          />
          <input type='password' placeholder='Password Baru'
            className='mt-4 text-lg outline-none border-b-2 border-slate-300 focus:border-primary 
            px-4 py-1 text-center min-w-0 w-full max-w-sm'
            ref={newPasswordRef}
          />
          <input type='password' placeholder='Konfirmasi Password'
            className='mt-4 text-lg outline-none border-b-2 border-slate-300 focus:border-primary 
            px-4 py-1 text-center min-w-0 w-full max-w-sm'
            ref={newPasswordConfirmationRef}
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
    <CommonErrorModal onClick={() => setEditError('')} text={editError}/>
    }
    {isEditSuccess &&
    <CommonSuccessModal onClick={closeModalHandler} text='Data berhasil diubah' />
    }
  </>
}
