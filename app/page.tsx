"use client";

import dynamic from 'next/dynamic';

const SignatureCanvas = dynamic(() => import('./components/SignatureCanvas'), {
  ssr: false,
  loading: () => <p>Loading...</p>, 
});

export default function Home() {
  return (
    <main className="flex h-[95vh] flex-col items-center lg:justify-center p-1 pt-10 lg:pt-0 ">
      <h1 className="text-4xl font-bold mb-8">eSign Website</h1>
      <SignatureCanvas />
    </main>
  );
}
