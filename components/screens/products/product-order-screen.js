import Link from 'next/link';
import { useState, useEffect } from 'react';

import { FaTruck } from 'react-icons/fa';
import { HiLocationMarker } from 'react-icons/hi';

import RajaongkirFetcher from '@/utils/functions/rajaongkir-fetcher';
import CONFIG from '@/global/config';
import CommonErrorModal from '@/components/common/common-error-modal';
import CommonModal from '@/components/common/common-modal';

const origin = CONFIG.RAJAONGKIR.DEFAULT_ORIGIN;

export default function ProductOrderScreen({ User, Product }) {
  const [formValues, setFormValues] = useState({
    courier: '',
    courierService: '',
    qty: 1,
    accountNumber: '',
    accountName: '',
  });
  const [fetching, setFetching] = useState(false);
  const [error, setError] = useState('');
  const [expedition, setExpedition] = useState({});
  const [shipmentCostList, setShipmentCostList] = useState([]);
  const [shipmentPrice, setShipmentPrice] = useState(0);
  const [shipmentEtd, setShipmentEtd] = useState(null);
  const [productPrice, setProductPrice] = useState(0);
  const [getWsPrice, setGetWsPrice] = useState(0);
  const [codePrice, _] = useState(Math.floor(Math.random() * 999) + 1);

  const [confirmModal, setConfirmModal] = useState(true);

  const inputHandler = (event) => {
    const { name, value } = event.target;
    if (name === 'courier') {
      setFormValues({
        ...formValues,
        [name]: value,
        courierService: '',
      });
    } else {
      setFormValues({
        ...formValues,
        [name]: value
      });
    }
  }

  const submitHandler = (event) => {
    event.preventDefault();
    setConfirmModal(true);
  }

  const createOrder = () => {
    setFetching(true);
    setTimeout(() => {
      setFetching(false)
    }, 3000)
  }

  useEffect(() => {
    if (formValues.courier !== '') {
      setFetching(true);
      const body = {origin, destination: User.cities.id, weight: Product.size, courier: formValues.courier}
      RajaongkirFetcher.getCost(body).then(({ data, error }) => {
        if (data) setExpedition(data[0]);
        else if (error) setError(error);
      }).catch((e) => {
        setError(e.message);
        setExpedition({});
      }).finally(() => {
        setFetching(false);
      });
    }
  }, [Product.size, User.cities.id, formValues.courier]);

  // update selected shipment service
  useEffect(() => {
    if (Object.keys(expedition).length > 0) {
      setShipmentCostList(expedition.costs)
    } else {
      setShipmentCostList([]);
    }
  }, [expedition]);

  // calculate total shipment price
  useEffect(() => {
    if (formValues.courierService !== '') {
      const { value: shipmentCost, etd } = shipmentCostList[formValues.courierService].cost[0];
      setShipmentPrice(shipmentCost);
      setShipmentEtd(etd);
    } else {
      setShipmentPrice(0);
      setShipmentEtd(null);
    }
  }, [formValues.courierService, shipmentCostList]);

  // calculate total product price
  useEffect(() => {
    let productPrice = formValues.qty * Product.price;

    let getWsPrice = 0;
    Product.wsPrice.forEach((wsPrice) => {
      if (formValues.qty >= wsPrice.minQty && formValues.qty <= wsPrice.maxQty) {
        productPrice = formValues.qty * wsPrice.price;
        getWsPrice = wsPrice.price;
      }
    })

    setProductPrice(productPrice);
    setGetWsPrice(getWsPrice);
  }, [Product.wsPrice, Product.price, formValues.qty])

  return <>
    <div className='bg-white/90 backdrop-blur-md'>
      <form onSubmit={submitHandler} className='py-6 pl-6 pr-10 h-full max-h-[calc(100vh-90px)] overflow-auto'>

        {/* product information */}
        <h2 className='text-2xl font-semibold'>
          {Product.name}
        </h2>
        <div className='mt-4 flex gap-8'>
          <div>
            <p>
              Ukuran : {Product.size} g
            </p>
            <p className='text-primary text-xl font-semibold'>
              Rp {Product.price}
            </p>
            <hr className='my-4'/>
            <div className='flex items-center gap-2'>
              <HiLocationMarker className='text-primary' size={20}/> 
              <p>
                Dikirim dari Jember
              </p>
            </div>
            <div className='mt-2 flex items-center gap-2'>
              <FaTruck className='text-primary' size={20}/> 
              <p>
                {shipmentEtd ? 
                `Estimasi tiba ${shipmentEtd} hari`
                :
                'Pilih ekspedisi terlebih dahulu'
                }
              </p>
            </div>

            <hr className='my-4'/>

            {/* Expedition */}
            <p>
              Pilih Pengiriman :
            </p>
            <select name='courier' 
              className='mt-2 block rounded-md border-slate-400 w-full border px-4 py-2' required
              value={formValues.courier} onChange={inputHandler}>
              <option value='' disabled>Pilih jasa ekspedisi</option>
              <option value='jne'>Jalur Nugraha Ekakurir (JNE)</option>
              <option value='pos'>Pos Indonesia (POS)</option>
              <option value='tiki'>Citra Van Titipan Kilat (TIKI)</option>
            </select>
            <select name='courierService' 
              className='mt-2 block rounded-md border-slate-400 w-full border px-4 py-2 disabled:bg-slate-100' required
              value={formValues.courierService} onChange={inputHandler} disabled={formValues.courier === '' || fetching}>
              <option value='' disabled>Pilih tipe jasa</option>
              {shipmentCostList?.map((variant, idx) => {
                return <option key={idx} value={idx}>{variant.service}</option>
              })}
            </select>

            <hr className='my-4'/>

            {/* payment detail */}
            <p className='text-center'>
              Metode Pembayaran
            </p>
            <p className='text-center font-semibold'>
              102 000 52638921 - Mang Garox - BANK BCA
            </p>
            <p className='italic text-gray-400 text-sm text-center'>
              kirim hingga 3 digit terakhir
            </p>
            <input type='text' name='accountNumber'
              className='mt-2 block rounded-md border-slate-400 w-full border px-4 py-2'
              placeholder='Nomor Rekening'
              value={formValues.accountNumber}
              onChange={inputHandler}
              required
            />
            <input type='text' name='accountName'
              className='mt-2 block rounded-md border-slate-400 w-full border px-4 py-2'
              placeholder='Nama Pemilik Rekening'
              value={formValues.accountName}
              onChange={inputHandler}
              required
            />
            <div className='mt-2 flex justify-between'>
              <p>
                Subtotal Produk
              </p>
              <p>
                Rp {productPrice}
              </p>
            </div>
            <div className='mt-2 flex justify-between'>
              <p>
                Subtotal Pengiriman
              </p>
              <p>
                Rp {shipmentPrice}
              </p>
            </div>
            <div className='bg-primary text-white mt-2 rounded-xl flex 
            justify-between px-4 py-2 border-t-4 border-dotted border-white'>
              <p>
                Total Pembayaran
              </p>
              <p>
                Rp {productPrice + shipmentPrice + codePrice}
              </p>
            </div>
          </div>
          <div className='bg-white rounded-md shadow-md h-max p-4 max-w-[240px]'>
            <p>
              Atur Jumlah
            </p>
            <div className='flex items-center gap-2'>
              <input type='text' alt='' 
                className='border inline w-min min-w-0 text-center rounded-md p-1 border-slate-400'
                pattern='[0-9]+' name='qty' 
                size='5'
                value={formValues.qty} onChange={inputHandler} required />
              <p className='flex-1'>
                stok: {Product.stock}
              </p>
            </div>
            <p className='mt-2'>
              Berat : {Product.size * formValues.qty} g
            </p>
            {getWsPrice > 0 &&
            <p className='text-primary text-sm'>
              Anda mendapatkan harga grosir Rp {getWsPrice}
            </p>
            }
            <hr className='my-2'/>
            <div className='flex items-center gap-2'>
              <HiLocationMarker className='text-primary' size={20}/> 
              <p>
                Alamat tujuan
              </p>
            </div>
            <p>
              {User.address},{' '}
              {User.cities.citytype.type} {User.cities.city}, {' '}
              {User.cities.provinces.province}
            </p>
            <div className='mt-4 flex gap-4 justify-between items-center'>
              <Link href='/products'>
                <a className='rounded-lg px-4 py-2 bg-gray-400 text-white hover:bg-red-600
                  transition-all'>
                  Batal
                </a>
              </Link>
              <button type='submit' className='flex-1 rounded-lg px-4 py-2 bg-primary text-white hover:opacity-70
                active:opacity-40 transition-all'>
                Beli
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
    {
      error &&
      <CommonErrorModal text={error} onClick={() => setError('')}/>
    }
    {
      confirmModal &&
      <CommonModal>
        <div className='p-6 max-w-[320px]'>
          <p className='text-center text-lg font-semibold'>
            Apakah Anda yakin ingin menambah pesanan
          </p>
          <div className='mt-6 flex gap-8 justify-between'>
            <button 
              type='button'
              onClick={() => setConfirmModal(false)}
              className='bg-gray-400 hover:bg-red-600 disabled:hover:bg-gray-400 w-28 py-3 rounded-full text-white 
              transition-all duration-200'
              disabled={fetching}
            >
              Batal
            </button>
            <button
              type='button'
              onClick={createOrder}
              className='bg-gradient-to-br from-primary to-primary/40 hover:to-primary/70 disabled:from-gray-400 
              disabled:to-gray-200 w-28 py-3 rounded-full text-white transition-all duration-200'
              disabled={fetching}
            >
              Pesan
            </button>
          </div>
        </div>
      </CommonModal>
    }
  </>
}