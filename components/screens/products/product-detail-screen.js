import Link from 'next/link';

export default function ProductDetailScreen({ Product }) {
  return <>
    <div className='bg-white/90 backdrop-blur-md'>
      <div className='py-6 pl-6 pr-10 h-full max-h-[calc(100vh-90px)] overflow-auto'>
        <h1 className='text-2xl sm:text-3xl mt-4 font-semibold'>
          {Product.name}
        </h1>
        <div className='mt-4 flex gap-8'>
          <div className='flex-1'>
            <h2>
              Informasi Produk
            </h2>
            <div className='flex flex-col mt-4'>
              <div className='flex py-4 border-b border-slate-500'>
                <p className='font-semibold w-40'>
                  Ukuran
                </p>
                <p>
                  {Product.size}
                </p>
              </div>
              <div className='flex py-4 border-b border-slate-500'>
                <p className='font-semibold w-40'>
                  Sisa stok
                </p>
                <p>
                  {Product.stock}
                </p>
              </div>
              <div className='py-4 border-b border-slate-500'>
                <p className='font-semibold w-40'>
                  Deskripsi
                </p>
                <p className='mt-1'>
                  {Product.desc}
                </p>
              </div>
            </div>
          </div>
          <div className='p-2 bg-white rounded-md shadow-md h-max'>
            <p className='font-semibold text-lg'>
              Harga
            </p>
            <div className='mt-2 flex items-center gap-8 justify-between'>
              <p>
                Harga Satuan
              </p>
              <p>
                Rp {Product.price}
              </p>
            </div>
            {
              Product.wsPrice.length > 0 &&
              <>
              <p className='mt-2'>
                Harga Grosir
              </p>
                {Product.wsPrice.map((price) => {
                  return <div key={price.id} className='ml-4 mt-1 flex items-center gap-8 justify-between'>
                    <p>
                      {price.minQty} - {price.maxQty}
                    </p>
                    <p>
                      Rp {price.price}
                    </p>
                  </div>
                })}
              </>
            }
          </div>
        </div>

        <div className='mt-8 flex items-center gap-8'>
          <Link href={`/products/${Product.id}/order`}>
            <a className='text-center bg-primary rounded-md py-3 text-white w-24
              hover:opacity-70 active:opacity-40 transition-all'>
              Beli
            </a>
          </Link>
          <Link href={`/products/${Product.id}/review`}>
            <a className='text-primary bg-white hover:underline p-2'>
              Lihat Ulasan
            </a>
          </Link>
        </div>
      </div>
    </div>
  </>
}