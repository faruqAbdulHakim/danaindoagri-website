import Image from 'next/image';
import { useRef } from 'react';

import { VscChevronLeft, VscChevronRight } from 'react-icons/vsc';
import { motion } from 'framer-motion';


// testimonial section
export default function FourthSection() {
  const sliderRef = useRef(null);

  const slideLeftHandler = () => {
    sliderRef.current.scrollLeft -= 600
  };
  const slideRightHandler = () => {
    sliderRef.current.scrollLeft += 600
  };

  return <>
    <section className='my-32'>
      <div className='flex px-4 max-w-screen-lg lg:mx-auto'>
        <motion.div
          initial={{opacity: 0, x: -80}}
          whileInView={{opacity: 1, x: 0}}
          transition={{delay: .2, duration: .4}}
          className='w-28 h-14 absolute'
        >
          <Image src='/assets/images/img_9.svg' alt='' layout='fill' objectFit='contain'/>
        </motion.div>
        <motion.h2 
          initial={{opacity: 0, x: 80}}
          whileInView={{opacity: 1, x: 0}}
          transition={{delay: .5, duration: .6}}
          className='text-3xl font-bold ml-20 sm:ml-24 md:ml-28'
        >
          Bagaimana reputasi <br className='hidden sm:inline'/>dan testimoni kami?
        </motion.h2>
      </div>
      {/* slider */}
      <motion.div 
        initial={{opacity: 0}}
        whileInView={{opacity: 1}}
        transition={{delay: .8, duration: .6}} 
        className='relative'
      >
        <div className='absolute h-full w-20 sm:w-36 top-0 left-0 bg-gradient-to-r from-white to-white/10'></div>
        <div className='absolute h-full w-20 sm:w-36 top-0 right-0 bg-gradient-to-l from-white to-white/10'></div>
        <div
          ref={sliderRef} 
          className='mt-16 px-16 py-4 space-x-8 whitespace-nowrap 
          overflow-x-scroll no-scroll scroll-smooth'
        >
            <TestimonialCard />
            <TestimonialCard />
            <TestimonialCard />
            <TestimonialCard />
            <TestimonialCard />
            <TestimonialCard />
            <TestimonialCard />
            <TestimonialCard />
        </div>
      </motion.div>

      {/* slider button */}
      <motion.div 
        initial={{opacity: 0}}
        whileInView={{opacity: 1}}
        transition={{delay: .4, duration: .6}} 
        className='mt-8 px-4 max-w-screen-lg lg:mx-auto space-x-4'
      >
        <SliderButton Button={VscChevronLeft} handler={slideLeftHandler} />
        <SliderButton Button={VscChevronRight} handler={slideRightHandler} />
      </motion.div>
    </section>
  </>
}

function TestimonialCard() {
  return <>
    <div className='bg-white inline-block shadow-md rounded-md hover:scale-105 transition-all'>
      <div className='w-80 min-h-[200px] p-4'>
        <div className='flex gap-4'>
          <div className='relative h-14 w-14 rounded-full overflow-hidden bg-primary/50'>
            <Image src='https://picsum.photos/200' alt='' layout='fill'/>
          </div>
          <div>
            <h3 className='text-primary'>Nama Customer</h3>
            <p className='font-bold'>Posisi Customer</p>
          </div>
        </div>
        <div className='mt-4'>
          &quot; Testimonial belum tersedia
        </div>
      </div>
    </div>
  </>
}

function SliderButton({ Button, handler }) {
  return <>
    <button 
      className='rounded-full p-2 shadow-xl bg-white hover:bg-primary 
      hover:shadow-primary/50 group active:scale-90 transition-all' 
      onClick={handler}
    >
      <Button size={32} className='group-hover:text-white'/>
    </button>
  </>
}
