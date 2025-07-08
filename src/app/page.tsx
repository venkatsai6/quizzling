import Quiz from '@/components/quiz';

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <h1 className="text-4xl font-bold text-gray-800 mb-8">Quiz Game</h1>
      <Quiz />
    </main>
  );
}