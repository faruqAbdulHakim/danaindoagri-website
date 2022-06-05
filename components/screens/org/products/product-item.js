import Image from 'next/image';
import Link from 'next/link';
import Router from 'next/router';

import CONFIG from '@/global/config';

const { ROLE_NAME, BUCKETS } = CONFIG.SUPABASE;
const { PRODUCTS_BASE_URL } = BUCKETS.PRODUCTS;

export default function ProductItem({ Product, userRole, setEditStockModal }) {
  return (
    <>
      <div className="shadow-md rounded-lg p-6 max-w-[280px] w-full border">
        <div className="h-32 w-32 relative rounded-full overflow-hidden mx-auto bg-white">
          <Image
            src={`${PRODUCTS_BASE_URL}/${Product.imgUrl}`}
            alt=""
            layout="fill"
            objectFit="cover"
            objectPosition="center"
            unoptimized={true}
          />
        </div>
        <h2 className="text-center mt-8 font-semibold">{Product.name}</h2>
        <div className="mt-4">
          <p>{Product.size} gram</p>
          <div className="mt-2 flex flex-wrap justify-between">
            <p>Stok: {Product.stock}</p>
            <p className="text-primary">Rp {Product.price}</p>
          </div>
        </div>
        <hr className="mt-4" />
        <div className="mt-4 mx-auto w-max flex items-center gap-4">
          <Link href={`/org/products/${Product.id}`}>
            <a className="hover:text-primary hover:opacity-70 active:opacity-40 transition-all">
              Detail
            </a>
          </Link>
          {userRole === ROLE_NAME.MARKETING && (
            <Link href={`/org/products/${Product.id}/edit-product`}>
              <a className="bg-primary text-white px-8 py-3 rounded-full hover:opacity-70 active:opacity-40 transition-all">
                Ubah
              </a>
            </Link>
          )}
          {userRole === ROLE_NAME.PRODUCTION && (
            <button
              type="button"
              className="bg-primary text-white px-4 py-3 rounded-full 
              hover:opacity-70 active:opacity-40 transition-all"
              onClick={() => {
                setEditStockModal(Product.id);
              }}
            >
              Ubah Stok
            </button>
          )}
        </div>
      </div>
    </>
  );
}
