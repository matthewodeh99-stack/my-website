export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-6 py-20">
        <h1 className="text-6xl font-bold text-white mb-6">
          Welcome to My Website
        </h1>
        <p className="text-xl text-purple-200 mb-8">
          Built with Next.js, Supabase, and Vercel
        </p>
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 max-w-md">
          <h2 className="text-2xl font-semibold text-white mb-4">
            🚀 You did it!
          </h2>
          <p className="text-purple-100">
            Your website is now connected to all the tools.
          </p>
        </div>
      </div>
    </main>
  )
}