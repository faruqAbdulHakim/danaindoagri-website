import { motion } from 'framer-motion'

export default function CommonModal({ children }) {
  return <>
    <div className='fixed inset-0 h-screen w-screen bg-slate-600/40 p-4 flex justify-center items-center'>
      <motion.div 
      animate={{opacity: [0, 1]}}
      transition={{duration: .6, ease: 'easeOut'}}
      className='bg-white p-4 rounded-md shadow-md'
      >
        { children }
      </motion.div>
    </div>
  </>
}