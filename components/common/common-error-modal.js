import { FiX } from 'react-icons/fi';

import CommonModal from './common-modal';

export default function CommonErrorModal({ text, onClick }) {
  return <>
    <CommonModal>
      <div className='w-full min-w-[340px] flex flex-col items-center py-4'>
        <p className='text-center w-3/4'>
          Terjadi kesalahan. <span className='text-red-500'>{text}</span>.
        </p>
        <button 
          className='text-white bg-red-500 mt-4 rounded-full shadow-md shadow-red-500/50 
          hover:opacity-70 active:opacity-40 transition-all duration-200'
          onClick={onClick}
        >
          <FiX size={48} className='p-2'/>
        </button>
      </div>
    </CommonModal>
  </>
}
