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
    <div className="w-full h-full min-h-screen flex flex-col bg-gray-900">
      <main className="flex-1 max-w-4xl m-auto">
        <ProductList />
      </main>
    </div>
  );
}
