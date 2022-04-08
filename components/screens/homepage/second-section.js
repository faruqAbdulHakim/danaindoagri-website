import Image from 'next/image';
import Link from 'next/link';

import { motion } from 'framer-motion';

// reason to choose section
export default function SecondSection() {
  return <>
    <section className='px-4 mt-32 max-w-screen-lg lg:mx-auto'>
      <motion.div
      initial={{opacity: 0, x: -40}}
      whileInView={{opacity: 1, x: 0}}
      transition={{duration: .8}}
      >
        <h2 className='font-bold text-3xl'>
          Kenapa harus pupuk kami?
        </h2>
        <p className='mt-6'>
          Karena kami adalah yang terbaik, dan pupuk kami sudah dibeli Kementrian<br className='hidden md:inline'/>
          Pertanian Republik Indonesia dalam jumlah besar setiap bulannya.
        </p>
      </motion.div>
      <div className='grid lg:grid-cols-2 gap-8 mt-12 mb-10'>
        <motion.div 
          initial={{opacity: 0, x: -40}} 
          whileInView={{opacity: 1, x: 0}}
          transition={{delay:.2, duration: .3}}
        >
          <Card 
            imgSrc='/assets/images/img_4.jpg'
            topText='Pupuk berkualitas'
            headingText='Dipilah dan melalui
            Quality Control maksimal'
            text='Kami memiliki visi dan misi untuk menjaga kualitas
            demi tanaman terbaik yang akan anda tanam'
            linkText='Pilih Pupuk'
            linkUrl='/'
          />
        </motion.div>
        <motion.div 
          initial={{opacity: 0, x: 40}} 
          whileInView={{opacity: 1, x: 0}}
          transition={{delay:.4, duration: .5}}
        >
          <Card 
            imgSrc='/assets/images/img_5.jpg'
            topText='Mudah, murah, dan aman'
            headingText='Divisi Marketing kami
            akan selalu membantu'
            text='Jangan khawatir dan takut, silahkan bertanya,
            karena divisi marketing akan membimbing seluruh customer'
            linkText='Hubungi kami'
            linkUrl='/'
          />
        </motion.div>
      </div>
    </section>
  </>
}

function Card({imgSrc, topText, headingText, text, linkText, linkUrl}) {
  return <>
    <div className='shadow-xl p-12 relative rounded-md overflow-hidden h-full'>
      <div className='absolute inset-0 w-full h-full'>
        <Image src={imgSrc} alt='' layout='fill' aria-hidden='true' objectFit='cover'/>
        <div className='w-full h-full bg-gradient-to-t from-black/50 to-black/10
        relative'></div>
      </div>
      <div className='relative'>
        <p className='text-primary uppercase tracking-widest'>{topText}</p>
        <div className='h-1 w-12 bg-white mt-6'></div>
        <h3 className='text-white mt-14 text-3xl font-semibold'>{headingText}</h3>
        <p className='text-gray-200 mt-4'>{text}</p>
        <div className='mt-8'>
          <Link href={linkUrl}>
            <a className='bg-white text-primary px-8 py-3 rounded-md font-semibold
            hover:bg-primary hover:text-white hover:shadow-md hover:shadow-primary/30
            active:opacity-50 transition-all ease-out duration-300'>
              {linkText}
            </a>
          </Link>
        </div>
      </div>
    </div>
  </>
}
