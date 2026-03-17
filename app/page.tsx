import ImageGenerator from '@/components/ImageGenerator';

export default function Home() {
  return (
    <main className="container mx-auto px-4 py-12 flex flex-col items-center">
      <header className="text-center mb-12">
        <h1 className="text-5xl font-bold tracking-tighter mb-4 bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500 bg-clip-text text-transparent">
          ruDALL-E Malevich
        </h1>
        <p className="text-zinc-400 max-w-lg">
          Free, unlimited high-fidelity image generation. Powered by the Malevich engine.
          Licensed under Apache 2.0.
        </p>
      </header>

      <ImageGenerator />

      <footer className="mt-24 text-zinc-600 text-sm">
        <p>© 2023 Open Source Malevich Tool. Model: rudalle-Malevich (No Quota Limits).</p>
      </footer>
    </main>
  );
}