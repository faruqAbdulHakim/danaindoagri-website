import Link from 'next/link';
import { useState } from 'react';

import CommonInput from '@/components/common/common-input';
import CommonSelect from '@/components/common/common-select';
import CommonLabel from '@/components/common/common-label';
import API_ENDPOINT from '@/global/api-endpoint';
import RegisterSuccessModal from './register-success-modal';

export default function RegisterForm() {
  const [tab, setTab] = useState(0);
  const [formValues, setFormValues] = useState({
    fullName: '',
    gender: 'L',
    dob: '',
    address: '',
    postalCode: '',
    email: '',
    password: '',
    passwordConfirmation: '',
    tel: '',
  });
  const [formError, setFormError] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [isSubmiting, setIsSubmiting] = useState(false);

  const getTodayDate = () => {
    const todayTime = new Date();
    const year = todayTime.getFullYear();
    const month = todayTime.getMonth();
    const date = todayTime.getDate();
    return `${year}-${month < 10 ? '0'+month : month}-${date < 10 ? '0'+date : date}`
  }

  const inputHandler = (event) => {
    setFormValues({
      ...formValues,
      [event.target.name]: event.target.value,
    });
  }

  const submitHandler = (event) => {
    event.preventDefault();

    setIsSubmiting(true);
    
    if (formError !== '') setFormError('');

    fetch(API_ENDPOINT.REGISTER, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify(formValues),
    }).then((res) => {
      return res.json();
    }).then((resJson) => {
      if (resJson.status === 400) {
        setFormError(resJson.message);
      } else if (resJson.status === 201) {
        setIsSuccess(true);
      }
    }).catch(() => {
      setFormError('Terjadi Kesalahan di sisi Server!!!');
    }).finally(() => {
      setIsSubmiting(false);
    })

  }

  return <>
    <div className='px-4 py-8'>
      <div className='max-w-[340px] mx-auto'>
        <h1 className='text-2xl'>Registrasi</h1>
        
        {/* error message (return from server) */}
        {formError && <p className='text-red-600'>{formError}</p>}

        {/* tabs */}
        <div className='space-x-2 mt-4 grid grid-cols-2'>
          <TabsButton text='Info Personal' isActive={tab === 0} handler={() => setTab(0)}/>
          <TabsButton text='Detail Akun' isActive={tab === 1} handler={() => setTab(1)}/>
        </div>

        {/* inputs */}
        <form className='flex flex-col gap-3 mt-3' onSubmit={submitHandler}>
          {/* first tab */}
          {
          tab === 0 && 
          <>
            <div className='flex flex-col'>
                <CommonLabel text='Nama Lengkap' id='fullName'/>
                <CommonInput type='text' placeholder='Nama lengkap' id='fullName' 
                  name='fullName' value={formValues.fullName} onChange={inputHandler} />
            </div>
            <div className='flex flex-col'>
                <CommonLabel text='Jenis Kelamin' id='gender'/>
                <CommonSelect id='gender'
                  name='gender' value={formValues.gender} onChange={inputHandler} 
                >
                  <option value='L'> Saya adalah laki-laki</option>
                  <option value='P'> Saya adalah perempuan</option>
                </CommonSelect>
            </div>
            <div className='flex flex-col'>
                <CommonLabel text='Tanggal Lahir' id='dob'/>
                <CommonInput type='date' max={getTodayDate()} id='dob' 
                  name='dob' value={formValues.dob} onChange={inputHandler} />
            </div>
            <div className='flex flex-col'>
                <CommonLabel text='Alamat' id='address'/>
                <CommonInput type='text' placeholder='Alamat' id='address'
                  name='address' value={formValues.address} onChange={inputHandler} />
            </div>
            <div className='flex flex-col'>
                <CommonLabel text='Kode Pos' id='postalCode'/>
                <CommonInput type='text' placeholder='Kode Pos' id='postalCode'
                  name='postalCode' value={formValues.postalCode} onChange={inputHandler} />
            </div>
            <button 
              type='button'
              className='bg-primary text-white px-4 py-3 rounded-md mt-4 ring-2 ring-primary
              uppercase tracking-wider hover:opacity-70 active:opacity-30 transition-all'
              onClick={() => setTab(1)}
            >
              Selanjutnya
            </button>
          </>
          }
          {/* second tab */}
          {
            tab === 1 &&
            <>
              <div className='flex flex-col'>
                <CommonLabel text='Email' id='email'/>
                <CommonInput type='email' placeholder='Email' id='email'
                  name='email' value={formValues.email} onChange={inputHandler}/>
              </div>
              <div className='flex flex-col'>
                <CommonLabel text='Kata Sandi' id='password'/>
                <CommonInput type='password' placeholder='Kata sandi' id='password'
                  name='password' value={formValues.password} onChange={inputHandler}/>
              </div>
              <div className='flex flex-col'>
                <CommonLabel text='Konfirmasi Kata Sandi' id='passwordConfirmation'/>
                <CommonInput type='password' placeholder='Konfirmasi kata sandi' id='passwordConfirmation'
                  name='passwordConfirmation' value={formValues.passwordConfirmation} onChange={inputHandler}/>
              </div>
              <div className='flex flex-col'>
                <CommonLabel text='Nomor Telepon' id='noTelp'/>
                <CommonInput type='text' placeholder='Nomor Telepon' id='noTelp'
                  name='tel' value={formValues.tel} onChange={inputHandler}/>
              </div>
                <button 
                type='submit'
                className='bg-primary text-white px-4 py-3 rounded-md mt-4 ring-2 ring-primary
                uppercase tracking-wider hover:opacity-70 active:opacity-30 disabled:bg-slate-600 
                disabled:ring-slate-600 disabled:hover:opacity-100 disabled:active:opacity-100
                transition-all'
                disabled={isSubmiting}
              >
                {isSubmiting ? 'Mendaftarkan...' : 'Daftar'}
              </button>
            </>
          }

          <p className='text-gray-400 text-center'>
            Sudah punya akun?{' '}
            <Link href='/login'>
              <a className='text-primary hover:underline active:opacity-40'>
                Masuk
              </a>
            </Link>
          </p>
        </form>

        {/* modal if customer registration success */}
        {isSuccess && <RegisterSuccessModal />}
        
      </div>
    </div>

    
  </>
}

function TabsButton({ text, isActive, handler}) {
  return <>
    <button 
      type='button'
      className={`border-b-2 pb-2 text-left text-lg
      hover:text-primary hover:border-primary/70 transition-all duration-200
      ${isActive ? 'border-primary' : 'text-gray-700'}`}
      onClick={handler}
    >
      {text}
    </button>
  </>
}