import Link from 'next/link';

import CommonModal from '@/components/common/common-modal';

import { FiCheck } from 'react-icons/fi';

export default function RegisterSuccessModal() {
  return <>
    <CommonModal>
      <div className='w-full min-w-[340px] flex flex-col items-center py-4'>
        <p className='text-center w-3/4'>
          Pendaftaran berhasil. Silahkan login untuk melanjutkan.
        </p>
        <Link href='/login'>
          <a className='text-white bg-primary mt-4 rounded-full shadow-md shadow-primary/50 
            hover:opacity-70 active:opacity-40 transition-all duration-200'>
            <FiCheck size={48} className='p-2'/>
          </a>
        </Link>
      </div>
    </CommonModal>
  </>
}