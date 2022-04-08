import Image from 'next/image';
import { useState } from 'react';

import { motion } from 'framer-motion';

// how to buy section
export default function ThirdSection() {
  return <>
    <section className='px-4 mt-32 max-w-[1124px] lg:mx-auto'>
      <motion.div 
      initial={{opacity: 0, y: 80}}
      whileInView={{opacity: 1, y: 0}}
      transition={{delay: .2, duration: .6}}
      className='bg-primary p-10 sm:p-16 rounded-md relative'>
        {/* Decoration */}
        <div className='absolute inset-0 w-full h-full'>
          <Image 
            src='/assets/images/img_5.svg' 
            layout='fill' 
            alt='' 
            objectFit='contain'
            objectPosition='left bottom'
            className='scale-75 origin-bottom-left'
          />
          <Image 
            src='/assets/images/img_6.svg' 
            layout='fill' alt='' 
            objectFit='contain'
            objectPosition='right top'
            className='scale-50 origin-top-right'
          />
        </div>
        {/* Content */}
        <div className='relative'>
          <h2 className='text-white text-3xl text-center font-bold'>Bagaimana cara memesan?</h2>
          <p className='text-white text-center mt-6'>
            Pilih produk kami dan berpartisipasi dalam proyek agribisnis Indonesia, tetapi juga<br className='hidden md:inline'/>
            oleh tanah terbaik, warisan keluarga, inovasi, dan keahlian unggul secara<br className='hidden md:inline'/>
            keseluruhan.
          </p>
          <OrderStep />
        </div>
      </motion.div>
    </section>
  </>
}

function OrderStep() {
  const [step, setStep] = useState('1');

  const orderButtonHandler = (event) => {
    setStep(event.target.innerText);
  }

  const DATA = {
    1: {
      text1: 'Pilih dan klik pupuk yang anda butuhkan',
      text2: 'Kami selalu memiliki ketersediaan barang yang melimpah, jadi jangan khawatir untuk memesan, karena akan langsung kami proses',
    },
    2: {
      text1: 'Silahkan bayar tagihan anda melalui pembayaran apapun secara online',
      text2: 'PENTING! Jangan lupa perhatikan dan pastikan untuk mencocokan 3 angka terakhir sesuai tagihan yang ada di invoice anda',
    },
    3: {
      text1: 'Unggah bukti pembayaran anda sesuai invoice yang sudah anda dapat',
      text2: '3 angka terakhir dalam tagihan anda merupakan verifikasi unik dalam sistem kami',
    },
    4: {
      text1: 'Pembayaran selesai, barang akan segera kami proses.',
      text2: 'Silahkan bersantai, kami akan mengirim barang sampai ke tangan  anda',
    }
  }

  return <>
    <div className='flex justify-between items-center max-w-xl mx-auto mt-16'>
      <OrderButton text='1' step={step} handler={orderButtonHandler}/>
      <OrderDivider />
      <OrderButton text='2' step={step} handler={orderButtonHandler}/>
      <OrderDivider />
      <OrderButton text='3' step={step} handler={orderButtonHandler}/>
      <OrderDivider />
      <OrderButton text='4' step={step} handler={orderButtonHandler}/>
      <OrderDivider />
    </div>
    <div className='mt-12 sm:mt-20 grid sm:grid-cols-2 gap-10 max-w-xl mx-auto overflow-hidden transition-all'>
      <h3 className='text-white font-semibold text-2xl'>{DATA[step].text1}</h3>
      <p className='text-white'>{DATA[step].text2}</p>
    </div>
  </>
}

function OrderButton({text, step, handler}) {
  const isSelected = step === text;

  return <>
    <button 
      className={`${isSelected ? 'bg-white text-primary' : 'text-white/80' } border-[2px] 
      border-white/80 rounded-full aspect-square px-4 sm:px-5 hover:bg-white 
      hover:text-primary transition-all active:opacity-50`}
      onClick={handler}
    >
      {text}
    </button>
  </>
}

function OrderDivider() {
  return <>
    <div className='h-[2px] bg-white/80 w-full last:hidden'>
    </div>
  </>
}
