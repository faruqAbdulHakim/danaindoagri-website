import Image from 'next/image'

import { motion } from 'framer-motion';

// new opportunities section
export default function FirstSection() {
  return <>
    <motion.section 
    initial={{opacity: 0, y: 50}}
    whileInView={{opacity: 1, y: 0}}
    transition={{duration: .5}}
    viewport={{ once: false }}
    className='px-4 max-w-screen-lg lg:mx-auto'>
      <h2 className='font-bold text-center text-3xl'>Kesempatan Baru!</h2>
      <p className='text-center mt-4'>
        Kami merupakan produsen dan juga distributor pupuk terbaik<br className='hidden sm:inline'/>
        di Kabupaten Jember, Jawa Timur. Kami yang paling proper dan Bersama kami<br className='hidden sm:inline'/>
        mari kita wujudkan Indonesia hijau dengan pupuk buatan kami.<br className='hidden sm:inline'/>
      </p>
      <div className='grid sm:grid-cols-2 lg:grid-cols-3 mt-12 gap-8'>
        <Card
          imgSrc='/assets/images/img_1.svg'
          headingText='Terhubung langsung
          dengan divisi marketing'
          text='Divisi marketing kami akan
          melayani segala kebutuhan yang
          customer butuhkan,
          terutama mengenai ketersediaan pupuk.
          '
        />
        <Card
          imgSrc='/assets/images/img_2.svg'
          headingText='Kembangkan bisnis anda
          Bersama kami'
          text='Kepada segala customer, mari
          kembangkan bisnis anda
          bersama kami.
          '
        />
        <Card
          imgSrc='/assets/images/img_3.svg'
          headingText='Tanam tanaman anda
          Sekarang!'
          text='Kami menyediakan pupuk
          berkualitas tinggi yang akan
          menunjang seluruh
          pertumbuhan tanaman anda.
          '
        />
      </div>
    </motion.section>
  </>
}

function Card({imgSrc, headingText, text}) {
  return <>
  <div className='w-full shadow-xl p-8 rounded-md bg-white hover:bg-primary hover:shadow-primary
  group transition-all duration-300'>
    <div>
      <Image src={imgSrc} alt={headingText} width={72} height={58}/>
    </div>
    <h3 className='mt-4 text-lg font-semibold group-hover:text-white'>
      {headingText}
    </h3>
    <p className='mt-4 text-gray-700 group-hover:text-white'>
      {text}
    </p>
  </div>
  </>
}


