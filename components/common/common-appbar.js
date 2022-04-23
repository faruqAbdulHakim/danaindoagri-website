import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';

import { FiMenu, FiX } from 'react-icons/fi';
import { motion } from 'framer-motion';

export default function CommonAppbar({ User }) {

  // list of navigation, except registration and login
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
          <DesktopNav navLinkList={navLinkList} User={User}/>

          {/* Mobile/Tablet Nav */}
          <MobileNav navLinkList={navLinkList} User={User}/>
        </nav>
      </div>
    </header>
  </>
}

function DesktopNav({ navLinkList, User }) {
  return <>
  <ul className='hidden lg:flex gap-6'>
    {navLinkList.map((navLink, idx) => {
      return<NavLink key={idx} idx={idx} text={navLink.text} urlPath={navLink.urlPath}/>
    })}
  </ul>
  <div className='hidden lg:inline'>
    {User ?
    <Link href='/org/dashboard'>
      <a className='px-4 py-2 text-white hover:opacity-40 active:opacity-70 flex items-center gap-2 transition-all'>
        <Image src='/assets/images/avatar.png' alt='' width={30} height={30} className='rounded-full'/>
        <p>
          {User.fullName}
        </p>
      </a>
    </Link>
    :
    <div className='flex items-center border border-white rounded-md overflow-hidden'>
      <Link href='/register'>
        <a className='px-4 py-2 text-white
        hover:bg-primary hover:border-primary active:opacity-50 flex items-center transition-all'>
          Daftar
        </a>
      </Link>
      <Link href='/login'>
        <a className='px-4 py-2 text-white border-l
        hover:bg-primary hover:border-primary active:opacity-50 flex items-center transition-all'>
          Masuk
        </a>
      </Link>
    </div>
      }
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

function MobileNav({ navLinkList, User }) {
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
        {User ?
        <>
          <MobileNavLink text='Dashboard' urlPath='/org/dashboard'/>
        </>
        :
        <>
          <MobileNavLink text='Daftar' urlPath='/register'/>
          <MobileNavLink text='Masuk' urlPath='/login'/>
        </>
        }
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
