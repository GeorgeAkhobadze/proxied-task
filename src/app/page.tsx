"use client";

import { gql, useMutation } from "@apollo/client";
import { useEffect } from "react";

const REGISTER_MUTATION = gql`
  mutation {
    register {
      _id
      token
    }
  }
`;

export default function Home() {
  const [register, { data, loading, error }] = useMutation(REGISTER_MUTATION);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      handleRegister()
          .then(r => console.log(r))
          .catch(err => console.log(err));
    }
  }, []);

  const handleRegister = async () => {
    try {
      const response = await register();
      localStorage.setItem("token", response.data.register.token);
      return response
    } catch (err) {
      return err
    }
  };

  if (loading) return <p>Registering Visitor...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
      <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
        <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
          {data && <p>Registered as Visitor ID: {data.register._id}</p>}
        </main>
      </div>
  );
}
