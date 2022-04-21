import Link from 'next/link';
import Image from 'next/image';

import { FiUser } from 'react-icons/fi';

export default function CommonFooter() {
  return <>
    <footer className='mt-32'>
      <div className='px-4 max-w-screen-lg lg:mx-auto'>
        <div className='grid sm:grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-16 
        w-max mx-auto lg:mx-0 lg:w-full lg:justify-items-stretch'>
          <div className='flex flex-col gap-2'>
            <FooterCommonHeadingText text='Perusahaan'/>
            <FooterCommonLinkText text='Tentang Kami' url='/' />
            <FooterCommonLinkText text='Tim' url='/' />
            <FooterCommonLinkText text='Karir' url='/' />
            <FooterCommonLinkText text='Kontrak' url='/' />
          </div>
          <div className='flex flex-col gap-2'>
            <FooterCommonHeadingText text='Produk'/>
            <FooterCommonLinkText text='Produk' url='/' />
            <FooterCommonLinkText text='Cara memesan' url='/' />
            <FooterCommonLinkText text='Harga' url='/' />
            <FooterCommonLinkText text='Stok' url='/' />
          </div>
          <div className='flex flex-col gap-2'>
            <FooterCommonHeadingText text='Legal'/>
            <FooterCommonLinkText text='Privasi' url='/' />
            <FooterCommonLinkText text='Ketentuan' url='/' />
            <FooterCommonLinkText text='Keamanan' url='/' />
          </div>
          <div className='flex flex-col gap-4 bg-primary p-8 rounded-md'>
            <h3 className='font-semibold text-white'>Saran dan kritik</h3>
            <p className='text-white'>
              Tulis disini ya : <br />
              <span className='text-sm'>danaindoagri@gmail.com</span>
            </p>
            <Link href='/'>
              <a className='bg-white text-primary px-4 py-2 rounded-md w-max flex items-start
              hover:bg-primary hover:text-white active:opacity-50 border border-white transition-all'>
                <FiUser size={20} className='mr-2'/> Hubungi Kami
              </a>
            </Link>
          </div>
        </div>
      </div>

      <div className='mt-32'/>
      <div className='h-[1px] bg-gray-500'/>

      <div className='px-4 max-w-screen-lg lg:mx-auto'>
        <div className='flex justify-between items-center pt-10 pb-14'>
          <div>
            <Image src='/assets/images/logo.svg' alt='logo' width={76} height={60}/>
          </div>
          <p className='text-gray-500 text-sm font-semibold ml-6'>
            &copy; Copyright 2022. CV. Dana Indo Agri (PPL Kelompok A10)
          </p>
        </div>
      </div>
    </footer>
  </>
}

function FooterCommonHeadingText({ text }) {
  return <>
    <h3 className='font-bold'>{text}</h3>
  </>
}

function FooterCommonLinkText({ text, url }) {
  return <>
    <Link href={url}>
      <a className='text-gray-500 hover:underline active:opacity-50'>
        {text}
      </a>
    </Link>
  </>
}
