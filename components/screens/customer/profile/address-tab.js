import Router from 'next/router';
import { useState, useEffect } from 'react';

import CommonModal from '@/components/common/common-modal';
import CommonErrorModal from '@/components/common/common-error-modal';
import CommonSuccessModal from '@/components/common/common-success-modal';
import UserFetcher from '@/utils/functions/users-fetcher';
import AddressFetcher from '@/utils/functions/address-fetcher';

export default function AddressTab({ User }) {
  const [isEditMode, setIsEditMode] = useState(false);

  const province = User.cities.provinces.province;
  const cityType = User.cities.citytype.type;
  const city = User.cities.city

  return <>
    <div>
      <p className='text-lg'>Kabupaten/Kota : {cityType} {city}</p>
      <p className='text-lg'>Provinsi : {province}</p>
      <p className='text-slate-700'>Kode Pos : {User?.postalCode}</p>
      <button type='button' className='mt-2 px-4 py-2 border-2 border-primary rounded-md 
        hover:bg-primary hover:text-white active:opacity-40 transition-all'
        onClick={() => setIsEditMode(true)}
      >
        Ubah Alamat
      </button>
    </div>

    {isEditMode &&
    <EditAddressModal closeModalHandler={() => setIsEditMode(false)}/>
    }
  </>
}

function EditAddressModal({ closeModalHandler }) {
  const [formValues, setFormValues] = useState({
    provinceId: '',
    cityId: '',
    postalCode: '',
  });
  const [provinceList, setProvinceList] = useState([]);
  const [cityList, setCityList] = useState([]);
  const [fetching, setFetching] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const submitHandler = (event) => {
    event.preventDefault();
    setFetching(true);

    UserFetcher.updateAddress(formValues).then(({ data, error, route }) => {
      if (data) setSuccess(data);
      else if (route) Router.push(route);
      else if (error) setError(error);
    }).catch((e) => {
      setError(e.message);
    }).finally(() => {
      setFetching(false);
    })
  }

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
    {!error && !success &&
    <CommonModal>
      <form className='sm:px-16 sm:py-8' onSubmit={submitHandler}>
        <h2 className='text-center text-xl font-semibold'>Ubah Alamat</h2>
        <div className='flex flex-col w-80'>
          <select type='text' name='provinceId'
            className='mt-4 text-lg outline-none border-b-2 border-slate-300 focus:border-primary 
            px-4 py-1 text-center min-w-0 w-full max-w-sm'
            value={formValues.provinceId}
            onChange={inputHandler}
          >
            <option value='' disabled>Pilih Provinsi</option>
            {provinceList.map((province) => {
              return <option key={province.id} value={province.id}>{province.province}</option>
            })}
          </select>
          <select type='text' name='cityId'
            className='mt-4 text-lg outline-none border-b-2 border-slate-300 focus:border-primary 
            px-4 py-1 text-center min-w-0 w-full max-w-sm'
            value={formValues.cityId}
            onChange={inputHandler}
          >
            <option value='' disabled>Pilih Kabupaten/Kota</option>
            {cityList.map((city) => {
              return <option key={city.id} value={city.id}>{city.citytype.type} {city.city}</option>
            })}
          </select>
          <input type='text' placeholder='Kode Pos' name='postalCode'
            className='mt-4 text-lg outline-none border-b-2 border-slate-300 focus:border-primary 
            px-4 py-1 text-center min-w-0 w-full max-w-sm'
            value={formValues.postalCode}
            onChange={inputHandler}
          />
        </div>
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

    {error &&
    <CommonErrorModal onClick={() => setError('')} text={error} />
    }

    {success &&
    <CommonSuccessModal onClick={() => {Router.reload()}} text={success} />
    }
  
  </>
}
