import Image from 'next/image';
import Link from 'next/link';
import Router from 'next/router';
import { useState } from 'react';

import CommonLabel from '@/components/common/common-label';
import CommonInput from '@/components/common/common-input';
import AuthFetcher from '@/utils/functions/auth-fetcher';

export default function LoginForm() {
  const [formValues, setFormValues] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [fetching, setFetching] = useState(false);

  const inputHandler = (event) => {
    setFormValues({
      ...formValues,
      [event.target.name]: event.target.value,
    });
  }

  const submitHandler = (event) => {
    event.preventDefault();
    setFetching(true);

    if (error !== '') setError('');
    AuthFetcher.login(formValues).then(({ error, route }) => {
      if (error) setError(error);
      else if (route) Router.push(route);
    }).catch((e) => {
      setError(e.message);
    }).finally(() => {
      setFetching(false);
    })
  }

  return <>
    <div className='relative p-8'>
      <div className='relative h-16 w-full'>
        <Image src='/assets/images/logo.svg' alt='' layout='fill' objectFit='contain' objectPosition='top left'/>
      </div>
      <div className='max-w-[340px] mx-auto mt-8'>
        <h1 className='text-3xl'>Masuk</h1>

        {/* error message (return from server) */}
        {error && <p className='text-red-600'>{error}</p>}

        {/* Login Form */}
        <form className='flex flex-col gap-4 mt-4' onSubmit={submitHandler}>
          <div className='flex flex-col'>
            <CommonLabel text='Email' id='email'/>
            <CommonInput type='email' placeholder='Email' id='email' 
              name='email' value={formValues.email} onChange={inputHandler} />
          </div>
          <div className='flex flex-col'>
            <CommonLabel text='Password' id='password'/>
            <CommonInput type='password' placeholder='Password' id='password' 
              name='password' value={formValues.password} onChange={inputHandler} />
          </div>
          <Link href='/'>
            <a className='text-gray-400 hover:text-gray-600 hover:underline w-max active:opacity-40
            transition-all'>
              Lupa kata sandi?
            </a>
          </Link>
          <button
            type='submit'
            className='bg-primary text-white rounded-md ring-2 ring-primary uppercase 
            tracking-wider px-4 py-3 font-semibold hover:opacity-70 active:opacity-40 
            disabled:bg-slate-600 disabled:ring-slate-600 disabled:hover:opacity-100 disabled:active:opacity-100
            transition-all'
            disabled={fetching}
          >
            Masuk
          </button>
          <p className='text-center text-gray-400'>
            Belum memiliki akun?{' '}
            <Link href='/register'>
              <a className='text-primary hover:underline active:opacity-40'>
                Registrasi
              </a>
            </Link>
          </p>
        </form>
      </div>
    </div>
  </>
}