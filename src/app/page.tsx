'use client';

import { useMutation } from '@apollo/client';
import { useEffect } from 'react';
import { REGISTER_MUTATION } from '@/app/graphql/mutations';
import ProductList from '@/app/components/ProductList';

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
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        {registerData && (
          <p>Registered as Visitor ID: {registerData.register._id}</p>
        )}
        <ProductList />
      </main>
    </div>
  );
}
