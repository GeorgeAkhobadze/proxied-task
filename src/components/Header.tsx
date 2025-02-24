'use client';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

const Header = () => {
  const pathname = usePathname();

  return (
    <header className="bg-gray-900 sticky h-screen top-0 z-10 px-2 py-4 border-gray-700 border-b-2 flex flex-col items-center justify-start gap-2 border-r-[1px]">
      <Image
        width={26}
        height={26}
        alt="Proxied"
        src={'/logo.svg'}
        className="border-b-[1px] pb-3 border-gray-600"
      />
      <div className="flex flex-col justify-center items-center gap-3">
        <Link
          href="/"
          className={`rounded-lg p-1 cursor-pointer transition duration-200 group w-10 h-10 flex items-center justify-center ${
            pathname === '/' ? 'bg-gray-950' : 'hover:bg-gray-600'
          }`}
        >
          <Image
            className={`duration-200 ${pathname === '/' ? 'opacity-100' : 'opacity-70 group-hover:opacity-100'}`}
            src={'./home-icon.svg'}
            alt={'Home Page'}
            width={20}
            height={20}
          />
        </Link>
        <Link
          href="/cart"
          className={`rounded-lg p-1 cursor-pointer transition duration-200 group w-10 h-10 flex items-center justify-center ${
            pathname === '/cart' ? 'bg-gray-950' : 'hover:bg-gray-600'
          }`}
        >
          <Image
            className={`duration-200 ${pathname === '/cart' ? 'opacity-100' : 'opacity-70 group-hover:opacity-100'}`}
            src={'./cart-icon.svg'}
            alt={'Home Page'}
            width={20}
            height={20}
          />
        </Link>
      </div>
    </header>
  );
};

export default Header;
