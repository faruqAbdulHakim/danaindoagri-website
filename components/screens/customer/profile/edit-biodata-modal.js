import Router from 'next/router';
import { useRef, useState } from 'react';

import CommonModal from '@/components/common/common-modal';
import CommonErrorModal from '@/components/common/common-error-modal';
import CommonSuccessModal from '@/components/common/common-success-modal';
import UserFetcher from '@/utils/functions/users-fetcher';

export default function EditBiodataModal({ headingText, defaultValue, closeModalHandler, name }) {
  const inputRef = useRef(null);
  const [fetching, setFetching] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const formSubmitHandler = (event) => {
    event.preventDefault();
    setFetching(true);
    
    const body = {name: name, value: inputRef.current.value};
    UserFetcher.updateUser(body).then(({ data, error, route }) => {
      if (data) setSuccess(data);
      else if (error) setError(error);
      else if (route) Router.push(route);
    }).catch((e) => {
      setError(e.message);
    }).finally(() => {
      setFetching(false);
    })
  }

  return <>
    {error &&
    <CommonErrorModal onClick={() => setError('')} text={error}/>
    }

    {success &&
    <CommonSuccessModal onClick={() => {Router.reload()}} text={success}/>
    }

    {!error && !success &&
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
            disabled={fetching}
          >
            Batal
          </button>
          <button type='submit' 
            className='bg-gradient-to-br from-primary to-primary/40 hover:to-primary/70 disabled:from-gray-400 
            disabled:to-gray-200 w-28 py-3 rounded-full text-white transition-all duration-200'
            disabled={fetching}
          >
            Simpan
          </button>
        </div>
      </form>
    </CommonModal>
    }
  </>
}