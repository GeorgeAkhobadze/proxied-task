'use client';

import { useMutation } from '@apollo/client';
import { useEffect, useState } from 'react';
import { REGISTER_MUTATION } from '@/graphql/mutations';
import ProductList from '@/components/ProductList';

export default function Home() {
  const [hydrated, setHydrated] = useState(false);
  const [register, { loading: registerLoading, error: registerError }] =
    useMutation(REGISTER_MUTATION);

  useEffect(() => {
    setHydrated(true);
    const token = localStorage.getItem('token');
    if (!token) {
      register()
        .then((res) => {
          const newToken = res?.data?.register?.token;
          if (newToken) localStorage.setItem('token', newToken);
        })
        .catch(console.error);
    }
  }, [register]);

  if (!hydrated) return null; // Avoid mismatches during SSR

  if (registerLoading) return <p>Registering Visitor...</p>;
  if (registerError) return <p>Error: {registerError.message}</p>;

  return <ProductList />;
}
