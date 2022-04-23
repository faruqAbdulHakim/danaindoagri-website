import { FiCheck } from 'react-icons/fi';

import CommonModal from './common-modal';

export default function CommonSuccessModal({ text, onClick }) {
  return <>
  <CommonModal>
      <div className='w-full min-w-[340px] flex flex-col items-center py-4'>
        <p className='text-center w-3/4 text-lg font-semibold'>
          {text}
        </p>
        <button 
          type='button'
          className='text-white bg-primary mt-4 rounded-full shadow-md shadow-primary/50 
          hover:opacity-70 active:opacity-40 transition-all duration-200'
          onClick={onClick}
        >
          <FiCheck size={48} className='p-2'/>
        </button>
      </div>
    </CommonModal>
  </>
}
