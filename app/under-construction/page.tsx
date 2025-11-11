import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export default function UnderConstruction() {
  return (
    <main className="min-h-screen flex flex-col">
      <Header />
      <div className="flex-1 flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="mb-8">
            <svg className="w-24 h-24 mx-auto text-gray-400 dark:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
            </svg>
          </div>
          <h1 className="text-4xl font-bold mb-4 text-gray-900 dark:text-white">
            Page Under Construction
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            We're working hard to bring you something amazing. Please check back soon!
          </p>
          <Link
            href="/"
            className="inline-block px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            Go Back Home
          </Link>
        </div>
      </div>
      <Footer />
    </main>
  )
}

