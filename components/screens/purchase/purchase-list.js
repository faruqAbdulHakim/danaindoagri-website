import Link from 'next/link';
import Router from 'next/router';
import { useState, useEffect } from 'react';

import OrderFetcher from '@/utils/functions/order-fetcher';
import CommonErrorModal from '@/components/common/common-error-modal';
import PurchaseItem from './purchase-item';

export default function PurchaseList({ User }) {
  return <>
    <div className='mt-4 border shadow-md rounded-2xl h-[calc(100vh-180px)] overflow-auto'>
      {
        User ?
        <ShowPurchaseList />
        :
        <HidePurchaseList />
      }
    </div>
  </>
}

function HidePurchaseList() {
  return <>
    <div className='h-full w-full flex flex-col items-center justify-center'>
      <p>
        Silahkan login terlebih dahulu
      </p>
      <Link href='/login'>
        <a className='text-primary hover:underline active:opacity-40'>
          Klik disini untuk Login
        </a>
      </Link>
    </div>
  </>
}

function ShowPurchaseList() {
  const [purchaseList, setPurchaseList] = useState([]);
  const [fetching, setFetching] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    setFetching(true);
    OrderFetcher.fetchCustomerOrders().then(({ data, error, route }) => {
      if (data) setPurchaseList(data);
      else if (error) setError(error);
      else if (route) Router.push(route);
    }).catch((e) => {
      setError(e.message);
    }).finally(() => {
      setFetching(false);
    })
  }, []);

  return <>
    <div className='p-4'>
      {
        fetching ?
        <p className='py-4 animate-bounce text-primary font-semibold text-lg'>
          Loading...
        </p>
        :
        purchaseList.length === 0 ?
        <p>
          Belum melakukan pemesanan.
        </p>
        :
        <>
          <div className='flex flex-col gap-4'>
            {
              purchaseList.map((Purchase) => {
                return <PurchaseItem key={Purchase.id} Purchase={Purchase} />
              })
            }
          </div>
        </>
      }
    </div>

    {
      error &&
      <CommonErrorModal text={error} onClick={() => setError('')}/>
    }
  </>
}
