import Link from 'next/link';

import { BsXCircleFill, BsCheckCircleFill } from 'react-icons/bs';
import { IoWallet, IoCheckmarkCircle, IoStar } from 'react-icons/io5';
import { FaTruck } from 'react-icons/fa';

export default function PurchaseItem({ Purchase }) {
  const Product = Purchase.orderdetail.products
  return <>
  <Link href={`/purchase/${Purchase.id}`}>
  <a>
    <div className='flex items-center justify-between flex-wrap gap-8 border shadow-md 
      px-4 py-3 rounded-md hover:bg-slate-200/80 active:opacity-40 transition-all'>
      {/* status upload bukti */}
      <div className='w-60'>
        {
          Purchase.proofOfPayment ?
          <div className='flex items-center justify-between text-primary'>
            <BsCheckCircleFill size={42}/>
            <p>
              Bukti sudah diupload
            </p>
          </div>
          :
          <div className='flex items-center justify-between text-red-600'>
            <BsXCircleFill size={42}/>
            <p>
              Bukti belum diupload
            </p>
          </div>
        }
      </div>

      {/* product detail */}
      <div className='w-60'>
        <div className='flex gap-2 items-center justify-between'>
          <p className='flex-1 text-clip overflow-hidden'>
            {Product.name}
          </p>
          <p>
            {Purchase.orderdetail.qty}
          </p>
        </div>
      </div>

      {/* order status */}
      <div className='w-52'>
        <div className='flex items-center gap-2'>
          <IoWallet size={20} 
            className={`${Purchase.orderdetail.status === 'belum dibayar' && 'text-primary'}`}
          />
          <IoCheckmarkCircle size={20}
            className={`${Purchase.orderdetail.status === 'dikonfirmasi' && 'text-primary'}`}
          />
          <FaTruck size={20} 
            className={`${Purchase.orderdetail.status === 'dikirim' && 'text-primary'}`}
          />
          <IoStar size={20}
            className={`${Purchase.orderdetail.status === 'diterima' && 'text-primary'}`}
          />
        </div>
      </div>
    </div>
  </a>
  </Link>
  </>
}