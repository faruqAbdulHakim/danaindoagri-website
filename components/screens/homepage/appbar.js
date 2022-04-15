import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';

import { FiUser, FiMenu, FiX } from 'react-icons/fi';
import { motion } from 'framer-motion';

export default function AppBar() {

  // list of navigation, except registration
  const navLinkList = [
    {
      text: 'Beranda',
      urlPath: '/'
    },
    {
      text: 'Produk',
      urlPath: '/'
    },
    {
      text: 'Pesan',
      urlPath: '/'
    },
    {
      text: 'Keranjang',
      urlPath: '/'
    },
    {
      text: 'Hubungi',
      urlPath: '/'
    },
  ]

  return <>
    <header className='py-2 px-6 sm:px-16'>
      <div className='flex items-center gap-10'>
        <div>
          <Image src='/assets/images/logo.svg' alt='logo' width={80} height={60}/>
        </div>
        <nav className='flex-1 flex justify-between items-center'>
          {/* Desktop Nav */}
          <DesktopNav navLinkList={navLinkList}/>

          {/* Mobile/Tablet Nav */}
          <MobileNav navLinkList={navLinkList}/>
        </nav>
      </div>
    </header>
  </>
}

function DesktopNav({ navLinkList }) {
  return <>
  <ul className='hidden lg:flex gap-6'>
    {navLinkList.map((navLink, idx) => {
      return<NavLink key={idx} idx={idx} text={navLink.text} urlPath={navLink.urlPath}/>
    })}
  </ul>
  <div className='hidden lg:inline'>
    <Link href='/register'>
      <a className='border px-4 py-2 border-white rounded-md text-white 
      hover:bg-primary hover:border-primary active:opacity-50 flex items-center transition-all'>
        <FiUser size={20} className='mr-2'/> Daftar
      </a>
    </Link>
  </div>
  </>
}

function NavLink({ text, urlPath, idx}) {
  return <>
    <motion.li
    initial={{opacity: 0, y: -10}}
    whileInView={{opacity: 1, y: 0}}
    transition={{duration: .5, delay: .2 + (idx * .15)}}
    className='first:text-primary hover:text-primary'>
      <Link href={urlPath}>
          <a className='hover:underline active:opacity-50'>
            {text}
          </a>
      </Link>
    </motion.li>
  </>
}

function MobileNav({ navLinkList }) {
  const [isOpen, setIsOpen] = useState(false);

  const buttonHandler = () => {
    setIsOpen(!isOpen);
  }

  const variants = {
    close: {
      opacity: 0,
      scale: .2,
    },
    open: {
      opacity: 1,
      scale: 1,
    },
  }

  return <>
    <button className='lg:hidden ml-auto border border-white p-1 rounded-md' onClick={buttonHandler}>
      {isOpen ? <FiX size={24} color='white' />: <FiMenu size={24} color='white'/>}
    </button>          
    <div className='lg:hidden relative z-50'>
      <motion.div
      animate={isOpen? 'open' : 'close'} 
      variants={variants}
      className='absolute top-8 right-0 flex flex-col rounded-md divide-y 
      bg-white shadow-md overflow-hidden origin-top-right'>
        {navLinkList.map((navLink, idx) => {
          return <MobileNavLink key={idx} text={navLink.text} urlPath={navLink.urlPath} />
        })}
        <MobileNavLink text='Daftar' urlPath='/register'/>
      </motion.div>
    </div>
  </>
}

function MobileNavLink({ text, urlPath }) {
  return <>
      <Link href={urlPath}>
        <a className='px-10 py-3 hover:bg-primary hover:text-white transition-all active:opacity-50'>
          {text}
        </a>
      </Link>
  </>
}
