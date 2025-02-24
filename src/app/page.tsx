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

  return <ProductList />;
}
