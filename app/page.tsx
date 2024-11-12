"use client";

import dynamic from 'next/dynamic';

const SignatureCanvas = dynamic(() => import('./components/SignatureCanvas'), {
  ssr: false,
  loading: () => <p>Loading...</p>, // Show this while loading
});

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-1">
      <h1 className="text-4xl font-bold mb-8">eSign Website</h1>
      <SignatureCanvas />
    </main>
  );
}
