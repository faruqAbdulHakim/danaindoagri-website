import Link from 'next/link';

import { motion } from 'framer-motion';

export default function HeroSection() {
  return (
    <>
      <section className="min-h-screen relative px-4 max-w-[1124px] lg:mx-auto">
        {/* content */}
        <div
          className="translate-y-20 max-w-sm sm:max-w-full sm:translate-y-0 sm:w-1/2 md:w-2/3 
      h-[78vh] flex flex-col justify-center"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.4 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1, duration: 0.6 }}
            className="origin-top-left"
          >
            <h1 className="font-bold text-3xl sm:text-4xl lg:text-5xl capitalize leading-tight mix-blend-color-dodge">
              A new way to grow <br className="hidden md:inline" /> your plant!
            </h1>
            <p className="mt-6">
              Pupuk buatan kami merupakan pupuk yang telah{' '}
              <br className="hidden md:inline" />
              diproses ketat dan melalui quality control yang baik,{' '}
              <br className="hidden md:inline" />
              sehingga dapat menunjang tanaman dengan sangat baik.
            </p>
            <div className="w-max mt-12">
              <Link href="/products">
                <a
                  className="border border-primary text-white bg-primary hover:text-primary 
              hover:bg-white active:opacity-50 px-4 py-3 rounded-md transition-all "
                >
                  Beli Sekarang
                </a>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
