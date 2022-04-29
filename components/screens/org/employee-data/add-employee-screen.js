import { useState } from 'react';
import Router from 'next/router';

import { FiX } from 'react-icons/fi';

import CommonInput from '@/components/common/common-input';
import CommonLabel from '@/components/common/common-label';
import CommonSelect from '@/components/common/common-select';
import CommonErrorModal from '@/components/common/common-error-modal';
import CommonSuccessModal from '@/components/common/common-success-modal';
import DateHelper from '@/utils/functions/date-helper';
import UserFetcher from '@/utils/functions/users-fetcher';
import CONFIG from '@/global/config';

const { ROLE_NAME } = CONFIG.SUPABASE;

export default function AddEmployeeScreen() {
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isFetching, setIsFetching] = useState(false);
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
    roleName: ROLE_NAME.MARKETING,
  });

  const inputChangeHandler = (event) => {
    setFormValues({
      ...formValues,
      [event.target.name]: event.target.value,
    });
  }

  const submitHandler = (event) => {
    event.preventDefault();
    setIsFetching(true);
    UserFetcher.addEmployee(formValues).then(({data, error, route}) => {
      if (error) setError(error);
      else if (route) Router.push(route);
      else setSuccess(data);
    }).finally(() => {
      setIsFetching(false);
    })
  }

  return <>
    <div className='p-8 bg-white shadow-md rounded-md w-full max-w-screen-md relative'>
      <button className='absolute top-5 right-5 p-2 bg-slate-300 rounded-full 
      hover:bg-slate-600 hover:text-white active:opacity-40 transition-all'
        onClick={() => {Router.back()}}
      >
        <FiX />
      </button>
      <h1 className='text-center text-primary font-semibold text-2xl'>
        Tambah Karyawan baru
      </h1>
      <form className='mt-6 max-w-md mx-auto space-y-4' onSubmit={submitHandler}>
        <div className='flex flex-col'>
            <CommonLabel text='Role Karyawan' id='roleName'/>
            <CommonSelect id='roleName'
              name='roleName' value={formValues.roleName} onChange={inputChangeHandler} 
            >
              <option value={ROLE_NAME.MARKETING}> Marketing</option>
              <option value={ROLE_NAME.PRODUCTION}> Produksi</option>
            </CommonSelect>
        </div>
        <div className='flex flex-col'>
          <CommonLabel id='fullName' text='Nama Lengkap' />
          <CommonInput id='fullName' placeholder='Nama Lengkap' name='fullName'
            value={formValues.fullName} onChange={inputChangeHandler}/>
        </div>
        <div className='flex flex-col'>
            <CommonLabel text='Jenis Kelamin' id='gender'/>
            <CommonSelect id='gender'
              name='gender' value={formValues.gender} onChange={inputChangeHandler} 
            >
              <option value='L'> Laki-laki</option>
              <option value='P'> Perempuan</option>
            </CommonSelect>
        </div>
        <div className='flex flex-col'>
          <CommonLabel id='dob' text='Tanggal Lahir' />
          <CommonInput id='dob' placeholder='Tanggal Lahir' name='dob' type='date'
            value={formValues.dob} onChange={inputChangeHandler} max={DateHelper.getTodayDate()}/>
        </div>
        <div className='flex flex-col'>
            <CommonLabel text='Alamat' id='address'/>
            <CommonInput type='text' placeholder='Alamat' id='address'
              name='address' value={formValues.address} onChange={inputChangeHandler} />
        </div>
        <div className='flex flex-col'>
            <CommonLabel text='Kode Pos' id='postalCode'/>
            <CommonInput type='text' placeholder='Kode Pos' id='postalCode'
              name='postalCode' value={formValues.postalCode} onChange={inputChangeHandler} />
        </div>
        <div className='flex flex-col'>
          <CommonLabel text='Email' id='email'/>
          <CommonInput type='email' placeholder='Email' id='email'
            name='email' value={formValues.email} onChange={inputChangeHandler}/>
        </div>
        <div className='flex flex-col'>
          <CommonLabel text='Kata Sandi' id='password'/>
          <CommonInput type='password' placeholder='Kata sandi' id='password'
            name='password' value={formValues.password} onChange={inputChangeHandler}/>
        </div>
        <div className='flex flex-col'>
          <CommonLabel text='Konfirmasi Kata Sandi' id='passwordConfirmation'/>
          <CommonInput type='password' placeholder='Konfirmasi kata sandi' id='passwordConfirmation'
            name='passwordConfirmation' value={formValues.passwordConfirmation} onChange={inputChangeHandler}/>
        </div>
        <div className='flex flex-col'>
          <CommonLabel text='Nomor Telepon' id='noTelp'/>
          <CommonInput type='text' placeholder='Nomor Telepon' id='noTelp'
            name='tel' value={formValues.tel} onChange={inputChangeHandler}/>
        </div>
        <button type='submit' className='px-4 py-3 mt-4 bg-primary text-white rounded-md
          hover:opacity-70 active:opacity-40 disabled:bg-slate-600 disabled:hover:opacity-100 
          disabled:active:opacity-100 transition-all' disabled={isFetching}>
          Tambah data
        </button>
      </form>
    </div>
    {
      success &&
      <CommonSuccessModal onClick={() => {Router.back()}} text={success}/>
    }
    {
      error &&
      <CommonErrorModal onClick={() => setError('')} text={error}/>
    }
  </>
}