'use client';

import { useMutation } from '@apollo/client';
import { useEffect } from 'react';
import { REGISTER_MUTATION } from '@/graphql/mutations';
import ProductList from '@/components/ProductList';
import Header from '@/components/Header';

export default function Home() {
  const token = localStorage.getItem('token');
  const [
    register,
    { data: registerData, loading: registerLoading, error: registerError },
  ] = useMutation(REGISTER_MUTATION);

  useEffect(() => {
    if (!token) {
      register()
        .then((res) => {
          const newToken = res?.data?.register?.token;
          if (newToken) localStorage.setItem('token', newToken);
        })
        .catch(console.error);
    }
  }, [register]);

  if (registerLoading) return <p>Registering Visitor...</p>;
  if (registerError) return <p>Error: {registerError.message}</p>;

  return (
    <div className="w-full h-full min-h-screen flex bg-gray-800 items-start justify-start">
      <Header />
      <div className="flex flex-col w-full h-full">
        <div className="w-full p-4 border-b-[1px] h-[54px] px-8 bg-gray-900 border-gray-700 sticky top-0 z-10">
          <p className="font-bold">Product Page</p>
        </div>
        <main className="flex-1 mb-12 p-8">
          <ProductList />
        </main>
      </div>
    </div>
  );
}
