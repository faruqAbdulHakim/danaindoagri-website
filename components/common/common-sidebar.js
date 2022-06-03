import Link from 'next/link';
import { useRouter } from 'next/router';

import { AiOutlineLineChart, AiOutlineFileText } from 'react-icons/ai';
import { RiDashboardLine } from 'react-icons/ri';
import { BiUserCircle } from 'react-icons/bi';
import { BsBoxSeam, BsCart2, BsBank, BsCheck2All } from 'react-icons/bs';
import { HiOutlineUserGroup } from 'react-icons/hi';
import { MdOutlineConfirmationNumber } from 'react-icons/md';
import { IoWalletOutline } from 'react-icons/io5';

import CONFIG from '@/global/config';

const { ROLE_NAME } = CONFIG.SUPABASE;

export default function CommonSidebar({ User }) {
  const router = useRouter();
  const { pathname } = router;

  const roleName = User?.role?.roleName;
  const NavLinkList = getNavLinkList(roleName);
  const OwnerNavLinkList = getOwnerNavLinkList();

  return (
    <>
      <div>
        <div className="flex justify-between bg-primary rounded-l-3xl h-full">
          {/* content */}
          <div className="flex-1 flex flex-col pl-4 pt-4 text-white">
            <h2 className="text-lg px-6 font-semibold hidden lg:inline">
              {roleName === ROLE_NAME.MARKETING
                ? 'Divisi Marketing'
                : roleName === ROLE_NAME.PRODUCTION
                ? 'Divisi Produksi'
                : roleName === ROLE_NAME.OWNER && 'Pemilik Usaha'}
            </h2>
            <div className="flex flex-col gap-8 justify-between lg:mt-6 mb-4 h-[calc(100vh-170px)] overflow-scroll no-scroll">
              <div className="space-y-1">
                {generateNavLink(NavLinkList, pathname)}
              </div>

              {/* Owner only */}
              {roleName === ROLE_NAME.OWNER && (
                <div className="space-y-1">
                  {generateNavLink(OwnerNavLinkList, pathname)}
                </div>
              )}
            </div>
          </div>
          {/* decor */}
          <div className="w-6 bg-white rounded-l-3xl"></div>
        </div>
      </div>
    </>
  );
}

function generateNavLink(NavLink, pathname) {
  return (
    <>
      {NavLink.map((navlink) => {
        const isActive = pathname.includes(navlink.location);

        return (
          <div key={navlink.text} className="relative">
            {isActive && (
              <>
                <div className="bg-white h-2 w-full absolute -top-2 left-0">
                  <div className="bg-primary h-full w-full rounded-br-3xl"></div>
                </div>
                <div className="bg-white h-2 w-full absolute -bottom-2 left-0">
                  <div className="bg-primary h-full w-full rounded-tr-3xl"></div>
                </div>
              </>
            )}
            <Link href={navlink.location}>
              <a
                className={`flex items-center py-3 pl-3 lg:pl-6 pr-1 lg:pr-10
              ${
                isActive
                  ? 'bg-white text-primary rounded-l-3xl'
                  : 'hover:opacity-70 active:opacity-40 transition-all'
              }
            `}
              >
                <navlink.Icon size={20} className="mr-2" />
                <span className="hidden lg:block">{navlink.text}</span>
              </a>
            </Link>
          </div>
        );
      })}
    </>
  );
}

function customLink(location, text, Icon) {
  return {
    location,
    text,
    Icon,
  };
}

function getNavLinkList(roleName) {
  const dashboard = customLink('/org/dashboard', 'Dashboard', RiDashboardLine);
  const profile = customLink('/org/profile', 'Profil', BiUserCircle);
  const products = customLink('/org/products', 'Produk', BsBoxSeam);
  const orders = customLink('/org/orders', 'Pemesanan', BsCart2);
  const confirmation = customLink(
    '/org/confirmation',
    'Konfirmasi',
    BsCheck2All
  );
  const receiptNumber = customLink(
    '/org/receipt-number',
    'Nomor Resi',
    MdOutlineConfirmationNumber
  );
  const customerData = customLink(
    '/org/customer-data',
    'Data Customer',
    HiOutlineUserGroup
  );
  const revenue = customLink('/org/revenue', 'Pendapatan', AiOutlineLineChart);
  const expenses = customLink(
    '/org/expenses',
    'Pengeluaran',
    AiOutlineFileText
  );
  const finances = customLink('/org/finances', 'Keuangan', IoWalletOutline);

  if (roleName === ROLE_NAME.MARKETING) {
    return [
      dashboard,
      profile,
      products,
      orders,
      confirmation,
      customerData,
      revenue,
      expenses,
      finances,
    ];
  }
  if (roleName === ROLE_NAME.PRODUCTION) {
    return [dashboard, profile, products, orders, receiptNumber];
  }
  if (roleName === ROLE_NAME.OWNER) {
    return [
      dashboard,
      profile,
      products,
      orders,
      customerData,
      revenue,
      expenses,
      finances,
    ];
  }
}

function getOwnerNavLinkList() {
  const manageMarketing = customLink(
    '/org/owner/manage-marketing',
    'Div. Marketing',
    BsBank
  );
  const manageProduction = customLink(
    '/org/owner/manage-production',
    'Div. Produksi',
    BsBank
  );
  return [manageMarketing, manageProduction];
}
