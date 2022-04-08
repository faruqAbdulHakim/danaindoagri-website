import Link from 'next/link'

import { motion } from 'framer-motion';

// Big Card section
export default function FifthSection() {
  return <>
    <section className='px-4 mt-32 max-w-screen-lg lg:mx-auto'>
      <motion.div 
        initial={{opacity: 0, y: 120}}
        whileInView={{opacity: 1, y: 0}}
        transition={{delay: .2, duration: .6}} 
        className='bg-white p-8 rounded-md shadow-md'
      >
        <h2 className='font-bold text-3xl text-center leading-relaxed'>
          Ingin memesan dalam <span className='text-primary'>Jumlah besar? </span>
          <br className='hidden md:inline'/>
          Kami siap melayani grosir!
        </h2>
        <div className='text-center mt-12'>
          <Link href='/'>
            <a className='text-white bg-primary hover:bg-white hover:text-primary
            border border-primary px-8 py-3 rounded-md active:opacity-50 transition-all'>
              Beli Sekarang
            </a>
          </Link>
        </div>
      </motion.div>
    </section>
  </>
}