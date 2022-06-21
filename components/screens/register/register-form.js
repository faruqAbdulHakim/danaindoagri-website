import Link from 'next/link';
import Router from 'next/router';
import { useState, useEffect } from 'react';

import CommonInput from '@/components/common/common-input';
import CommonSelect from '@/components/common/common-select';
import CommonLabel from '@/components/common/common-label';
import CommonSuccessModal from '@/components/common/common-success-modal';
import CommonErrorModal from '@/components/common/common-error-modal';
import AuthFetcher from '@/utils/functions/auth-fetcher';
import AddressFetcher from '@/utils/functions/address-fetcher';
import DateHelper from '@/utils/functions/date-helper';

export default function RegisterForm() {
  const [formValues, setFormValues] = useState({
    fullName: '',
    gender: 'L',
    dob: '',
    provinceId: '',
    cityId: '',
    address: '',
    postalCode: '',
    email: '',
    password: '',
    passwordConfirmation: '',
    tel: '',
  });
  const [tab, setTab] = useState(0);
  const [provinceList, setProvinceList] = useState([]);
  const [cityList, setCityList] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [fetching, setFetching] = useState(false);

  const inputHandler = (event) => {
    const { name, value } = event.target;
    if (name === 'provinceId') {
      setFormValues({
        ...formValues,
        [name]: value,
        cityId: ''
      })
    } else {
      setFormValues({
        ...formValues,
        [name]: value,
      });
    }
  }

  const submitHandler = (event) => {
    event.preventDefault();

    setFetching(true);
    
    AuthFetcher.register(formValues).then(({ data, error }) => {
      if (data) setSuccess(data);
      else if (error) setError(error);
    }).catch((e) => {
      setError(e.message);
    }).finally(() => {
      setFetching(false)
    });
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
    <div className='px-4 py-8'>
      <div className='max-w-[340px] mx-auto'>
        <h1 className='text-2xl'>Registrasi</h1>

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
                <CommonInput type='date' max={DateHelper.getTodayDate()} id='dob' 
                  name='dob' value={formValues.dob} onChange={inputHandler} />
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
                disabled={fetching}
              >
                {fetching ? 'Mendaftarkan...' : 'Daftar'}
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

        {
          success && 
          <CommonSuccessModal text={success} onClick={() => Router.push('/login')}/>
        }
        {
          error &&
          <CommonErrorModal text={error} onClick={() => setError('')} />
        }
        
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