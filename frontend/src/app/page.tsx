import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="flex justify-between items-center p-6 border-b">
        <div className="text-2xl font-bold text-blue-600">MailAI</div>
        <div className="space-x-4">
          <Link href="/login" className="text-gray-600 hover:text-gray-900">
            Sign In
          </Link>
          <Link
            href="/register"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Get Started
          </Link>
        </div>
      </header>

      {/* Hero */}
      <main className="max-w-6xl mx-auto px-6 py-20 text-center">
        <h1 className="text-5xl font-bold mb-6 text-gray-900">
          Write Better Emails, Faster
        </h1>
        <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
          AI-powered email assistant that helps you write professional emails and analyze incoming messages in seconds.
        </p>
        <Link
          href="/register"
          className="bg-blue-600 text-white text-lg px-8 py-4 rounded-lg hover:bg-blue-700 inline-block"
        >
          Start Your Free Trial
        </Link>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 mt-20">
          <div className="p-6 border rounded-lg hover:shadow-lg transition">
            <div className="text-4xl mb-4">✨</div>
            <h3 className="text-xl font-bold mb-2">Smart Generation</h3>
            <p className="text-gray-600">
              Generate professional emails from short bullet points or rough ideas.
            </p>
          </div>
          <div className="p-6 border rounded-lg hover:shadow-lg transition">
            <div className="text-4xl mb-4">📊</div>
            <h3 className="text-xl font-bold mb-2">Sentiment Analysis</h3>
            <p className="text-gray-600">
              Understand the tone and sentiment of received emails instantly.
            </p>
          </div>
          <div className="p-6 border rounded-lg hover:shadow-lg transition">
            <div className="text-4xl mb-4">⚡</div>
            <h3 className="text-xl font-bold mb-2">Quick Replies</h3>
            <p className="text-gray-600">
              Get suggested replies based on the context of the conversation.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-50 border-t py-12 text-center text-gray-600">
        <p>© 2026 MailAI. All rights reserved.</p>
      </footer>
    </div>
  );
}
