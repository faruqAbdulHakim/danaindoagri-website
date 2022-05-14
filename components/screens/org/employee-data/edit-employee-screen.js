import { useState, useRef, useEffect } from 'react';
import Router from 'next/router';

import { FiX } from 'react-icons/fi';

import CommonInput from '@/components/common/common-input';
import CommonLabel from '@/components/common/common-label';
import CommonSelect from '@/components/common/common-select';
import CommonErrorModal from '@/components/common/common-error-modal';
import CommonSuccessModal from '@/components/common/common-success-modal';
import CommonModal from '@/components/common/common-modal';
import DateHelper from '@/utils/functions/date-helper';
import UserFetcher from '@/utils/functions/users-fetcher';
import AddressFetcher from '@/utils/functions/address-fetcher';
import CONFIG from '@/global/config';

const { ROLE_NAME } = CONFIG.SUPABASE;

export default function EditEmployeeScreen({ Employee }) {
  const [provinceList, setProvinceList] = useState([]);
  const [cityList, setCityList] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [fetching, setFetching] = useState(false);
  const [isEditPassword, setIsEditPassword] = useState(false);
  const [formValues, setFormValues] = useState({
    fullName: Employee.fullName,
    gender: Employee.gender,
    dob: Employee.dob,
    provinceId: Employee.cities.provinces.id,
    cityId: Employee.cities.id,
    address: Employee.address,
    postalCode: Employee.postalCode,
    email: Employee.email,
    tel: Employee.tel,
    roleName: Employee.role.roleName,
  });

  const inputHandler = (event) => {
    const { name, value } = event.target;
    if (name === 'provinceId') {
      setFormValues({
        ...formValues,
        [name]: value,
        cityId: '',
      })
    } else {
      setFormValues({
        ...formValues,
        [name]: value,
      });
    }
  }

  const biodataSubmitHandler = (event) => {
    event.preventDefault();
    setFetching(true);
    UserFetcher.editEmployee('biodata', Employee.id, formValues).then(({data, error, route}) => {
      if (error) setError(error);
      else if (route) Router.push(route);
      else setSuccess(data);
    }).finally(() => {
      setFetching(false);
    })
  }

  useEffect(() => {
    setFetching(true);
    AddressFetcher.fetchAllProvinces().then(({ data, error }) => {
      if (data) setProvinceList(data);
      else if (error) setError(error);
    }).catch((e) => {
      setError(e.message);
    }).finally(() => {
      setFetching(false);
    });
  }, [])

  useEffect(() => {
    if (formValues.provinceId !== '') {
      setFetching(true);
      AddressFetcher.fetchAllCitiesByProvinceId(formValues.provinceId).then(({ data, error }) => {
        if (data) setCityList(data);
        else if (error) setError(error);
      }).catch((e) => {
        setError(e.message);
      }).finally(() => {
        setFetching(false);
      })
    }
  }, [formValues.provinceId])

  return <>
    <div className='p-8 bg-white shadow-md rounded-md w-full max-w-screen-md relative'>
      <button className='absolute top-5 right-5 p-2 bg-slate-300 rounded-full 
      hover:bg-slate-600 hover:text-white active:opacity-40 transition-all'
        onClick={() => {Router.back()}}
      >
        <FiX />
      </button>
      <h1 className='text-center text-primary font-semibold text-2xl'>
        Ubah data karyawan
      </h1>
      <form className='mt-6 max-w-md mx-auto space-y-4' onSubmit={biodataSubmitHandler}>
        <div className='flex flex-col'>
            <CommonLabel text='Role Karyawan' id='roleName'/>
            <CommonSelect id='roleName'
              name='roleName' value={formValues.roleName} onChange={inputHandler} 
            >
              <option value={ROLE_NAME.MARKETING}> Marketing</option>
              <option value={ROLE_NAME.PRODUCTION}> Produksi</option>
            </CommonSelect>
        </div>
        <div className='flex flex-col'>
          <CommonLabel id='fullName' text='Nama Lengkap' />
          <CommonInput id='fullName' placeholder='Nama Lengkap' name='fullName'
            value={formValues.fullName} onChange={inputHandler}/>
        </div>
        <div className='flex flex-col'>
            <CommonLabel text='Jenis Kelamin' id='gender'/>
            <CommonSelect id='gender'
              name='gender' value={formValues.gender} onChange={inputHandler} 
            >
              <option value='L'> Laki-laki</option>
              <option value='P'> Perempuan</option>
            </CommonSelect>
        </div>
        <div className='flex flex-col'>
          <CommonLabel id='dob' text='Tanggal Lahir' />
          <CommonInput id='dob' placeholder='Tanggal Lahir' name='dob' type='date'
            value={formValues.dob} onChange={inputHandler} max={DateHelper.getTodayDate()}/>
        </div>
        <div className='flex flex-col'>
            <CommonLabel text='Provinsi' id='provinceId'/>
            <CommonSelect id='provinceId'
              name='provinceId' value={formValues.provinceId} onChange={inputHandler} 
            >
              <option value='' disabled>Pilih provinsi</option>
              {
                provinceList.map((province) => {
                  return <option key={province.id} value={province.id}>{province.province}</option>
                })
              }
            </CommonSelect>
        </div>
        <div className='flex flex-col'>
            <CommonLabel text='Kabupaten/Kota' id='cityId'/>
            <CommonSelect id='cityId'
              name='cityId' value={formValues.cityId} onChange={inputHandler} 
              disabled={fetching || cityList.length === 0}
            >
              <option value='' disabled>Pilih Kabupaten/Kota</option>
              {
                cityList.map((city) => {
                  return <option key={city.id} value={city.id}>{city.citytype.type} {city.city}</option>
                })
              }
            </CommonSelect>
        </div>
        <div className='flex flex-col'>
            <CommonLabel text='Detail Alamat' id='address'/>
            <CommonInput type='text' placeholder='Detail Alamat' id='address'
              name='address' value={formValues.address} onChange={inputHandler} />
        </div>
        <div className='flex flex-col'>
            <CommonLabel text='Kode Pos' id='postalCode'/>
            <CommonInput type='text' placeholder='Kode Pos' id='postalCode'
              name='postalCode' value={formValues.postalCode} onChange={inputHandler} />
        </div>
        <div className='flex flex-col'>
          <CommonLabel text='Email' id='email'/>
          <CommonInput type='email' placeholder='Email' id='email'
            name='email' value={formValues.email} onChange={inputHandler}/>
        </div>
        <div className='flex flex-col'>
          <CommonLabel text='Nomor Telepon' id='noTelp'/>
          <CommonInput type='text' placeholder='Nomor Telepon' id='noTelp'
            name='tel' value={formValues.tel} onChange={inputHandler}/>
        </div>
        <div className='flex gap-4'>
          <button type='button' className='px-4 py-3 mt-4 bg-white text-primary rounded-md
            hover:underline active:opacity-40 disabled:hover:no-underline 
            disabled:active:opacity-100 transition-all' disabled={fetching}
            onClick={() => setIsEditPassword(true)}>
            Ubah password
          </button>
          <button type='submit' className='px-4 py-3 mt-4 bg-primary text-white rounded-md
            hover:opacity-70 active:opacity-40 disabled:bg-slate-600 disabled:hover:opacity-100 
            disabled:active:opacity-100 transition-all' disabled={fetching}>
            Ubah data
          </button>
        </div>
      </form>
    </div>
    {
      !success && !error && isEditPassword &&
      <EditPasswordModal setSuccess={setSuccess} setError={setError} 
        closeHandler={() => setIsEditPassword(false)} Employee={Employee}/>
    }
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

function EditPasswordModal({setSuccess, setError, closeHandler, Employee}) {
  const passwordRef = useRef(null);
  const passwordConfirmationRef = useRef(null);
  const [fetching, setFetching] = useState(false);

  const passwordFormSubmitHandler = (event) => {
    event.preventDefault();
    setFetching(true);
    const formValues = {
      password: passwordRef.current.value,
      passwordConfirmation: passwordConfirmationRef.current.value,
    };

    UserFetcher.editEmployee('password', Employee.id, formValues).then(({data, error, route}) => {
      if (error) setError(error);
      else if (route) Router.push(route);
      else setSuccess(data);
    }).finally(() => {
      setFetching(false);
    })
  }

  return <>
    <CommonModal>
      <div className='px-8 py-4'>
        <h2 className='text-center font-semibold text-lg'>Ubah Password</h2>
        <form onSubmit={passwordFormSubmitHandler} className='flex justify-center items-center flex-col'>
          <input ref={passwordRef} type='password' placeholder='Masukkan password baru'
            className='mt-4 text-lg outline-none border-b-2 border-slate-300 focus:border-primary 
            px-4 py-1 text-center min-w-0 w-full max-w-xs'
          />
          <input ref={passwordConfirmationRef} type='password' placeholder='Konfirmasi password baru'
            className='mt-4 text-lg outline-none border-b-2 border-slate-300 focus:border-primary 
            px-4 py-1 text-center min-w-0 w-full max-w-xs'
          />
        <div className='flex flex-wrap justify-evenly gap-10 mt-8'>
          <button type='button' 
            className='bg-gray-400 hover:bg-red-600 disabled:hover:bg-gray-400 w-28 py-3 rounded-full text-white 
            transition-all duration-200'
            onClick={closeHandler}
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
      </div>
    </CommonModal>
  </>
}
