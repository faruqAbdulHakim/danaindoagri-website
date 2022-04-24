// reference : customer/profile/edit-biodata-modal.js

import Router from 'next/router';
import { useRef, useState } from 'react';

import CommonModal from '@/components/common/common-modal';
import API_ENDPOINT from '@/global/api-endpoint';
import CommonErrorModal from '@/components/common/common-error-modal';
import CommonSuccessModal from '@/components/common/common-success-modal';

export default function EditBiodataModal({ headingText, defaultValue, closeModalHandler, name }) {
  const inputRef = useRef(null);
  const [isSubmiting, setIsSubmiting] = useState(false);
  const [isEditSuccess, setIsEditSucces] = useState(false);
  const [editError, setEditError] = useState('');

  const formSubmitHandler = (event) => {
    event.preventDefault();
    setIsSubmiting(true);
    
    const httpReqBody = {name: name, value: inputRef.current.value}
    fetch(API_ENDPOINT.USERS_PROFILE_UPDATE, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify(httpReqBody),
    }).then((res) => {
      return res.json()
    }).then((resJson) => {
      if (resJson.status === 200) {
        setIsEditSucces(true);
      } else if (resJson.status === 400) {
        setEditError(resJson.message);
      } else if (resJson.status === 300) {
        Router.push(resJson.location);
      }
    }).catch(() => {
    }).finally(() => {
      setIsSubmiting(false);
    })
  }

  return <>
    {editError &&
    <CommonErrorModal onClick={() => setEditError('')} text={editError}/>
    }

    {isEditSuccess &&
    <CommonSuccessModal onClick={() => {Router.reload()}} text="Data berhasil diubah"/>
    }

    {!editError && !isEditSuccess &&
    <CommonModal>
      <form className='sm:px-16 sm:py-8' onSubmit={formSubmitHandler}>
        <p className='text-xl font-semibold text-center'>
          {headingText}
        </p>

          {name === 'gender' ? 
          <select 
            defaultValue={defaultValue} 
            ref={inputRef}
            className='mt-4 text-lg outline-none border-b-2 border-slate-300 focus:border-primary 
            px-4 py-1 min-w-0 max-w-xs w-full'
          >
            <option value='L'>Saya Laki-laki</option>
            <option value='P'>Saya Perempuan</option>
          </select>
          :
          <input 
            type={name === 'dob' ? 
                  'date' 
                  : name === 'email' ? 
                  'email' 
                  : name === 'tel' ? 
                  'tel' 
                  :'text'}
            defaultValue={defaultValue} 
            name={name}
            ref={inputRef}
            className='mt-4 text-lg outline-none border-b-2 border-slate-300 focus:border-primary 
            px-4 py-1 text-center min-w-0 w-full max-w-xs'
          />
          }
          
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
  </>
}
