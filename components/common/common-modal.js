import { motion } from 'framer-motion'

export default function CommonModal({ children }) {
  return <>
    <div className='fixed inset-0 h-full w-full bg-slate-400/40 p-4'>
        <motion.div 
        animate={{opacity: [0, 1]}}
        transition={{duration: .6, ease: 'easeOut'}}
        className='relative top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 w-fit 
        p-4 bg-white rounded-md overflow-hidden shadow-md'
        >
          { children }
        </motion.div>
    </div>
  </>
}