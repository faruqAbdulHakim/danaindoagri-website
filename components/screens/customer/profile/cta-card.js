import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

import { BsPatchCheckFill, BsXOctagonFill } from 'react-icons/bs';
import { IoDocumentText, IoWallet, IoCheckmarkCircle, IoStar } from 'react-icons/io5';
import { FaTruck } from 'react-icons/fa';
import { FiChevronRight } from 'react-icons/fi';

import CONFIG from '@/global/config';

const { BUCKETS } = CONFIG.SUPABASE;

export default function CtaCard({ User }) {
  const [imageError, setImageError] = useState(false);

  return <>
    <div className='bg-slate-100 h-full p-6 rounded-md shadow-xl shadow-black/5'>
      <div className='flex items-start gap-4'>
        <div>
          { imageError ?
            <Image src='/assets/images/avatar.png' alt='' height={48} width={48} className='rounded-md'/>
            :
            <Image src={`${BUCKETS.AVATARS.AVATAR_BASE_URL}/avatar${User.id}`} alt='' height={48} width={48}
              onError={() => setImageError(true)} unoptimized={true}/>
          }
        </div>
        <div>
          <p className='text-slate-700'>{User?.fullName}</p>
          {User?.isVerified ?
          <div className='flex items-center gap-2'>
            <p className='text-slate-700 font-light text-sm mt-1'>Terverifikasi</p>
            <BsPatchCheckFill size={18} className='text-primary' />
          </div>
          :
          <div className='flex items-center gap-2'>
            <p className='text-slate-700 font-light text-sm mt-1'>Belum terverifikasi</p>
            <BsXOctagonFill size={14} className='text-red-500' />
          </div>
          }
        </div>
      </div>
      <div className='mt-6 bg-white rounded-md shadow-xl shadow-black/5 p-4'>
        <div className='flex items-center justify-between'>
          <div className='flex gap-1 items-center'>
            <IoDocumentText size={24} />
            <p className=''>
              Status terakhir
            </p>
          </div>
          <Link href='/'>
            <a className='text-xs text-slate-500 font-thin hover:underline'>
              Riwayat order
            </a>
          </Link>
        </div>
        <div className='flex justify-around mt-5'>
          <IoWallet size={26} className='text-primary'/>
          <IoCheckmarkCircle size={26} className=''/>
          <FaTruck size={26} className=''/>
          <IoStar size={26} className=''/>
        </div>
      </div>

      <div className='mt-8 flex flex-col gap-6'>
        <div className='border'>
          <Link href='/'>
            <a className='flex justify-between items-center text-lg py-3 px-6 hover:bg-slate-200 transition-all'>
              <p className='text-slate-700'>FAQ</p>
              <FiChevronRight size={20} className='text-slate-700' />
            </a>
          </Link>
        </div>
        <div className='border'>
          <Link href='/'>
            <a className='flex justify-between items-center text-lg py-3 px-6 hover:bg-slate-200 transition-all'>
              <p className='text-slate-700'>Bantuan</p>
              <FiChevronRight size={20} className='text-slate-700' />
            </a>
          </Link>
        </div>

        <p className='text-xs text-slate-500'>&copy; Copyright 2022. CV. Dana Indo Agri (PPL Kelompok A10)</p>
      </div>
    </div>
  </>
}