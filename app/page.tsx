import Header from '@/components/Header'
import EmailGenerator from '@/components/EmailGenerator'
import Inbox from '@/components/Inbox'
import FAQ from '@/components/FAQ'
import PopularArticles from '@/components/PopularArticles'
import Footer from '@/components/Footer'

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col">
      <Header />
      <div className="flex-1">
        <section className="container mx-auto px-4 py-12 md:py-20">
          <div className="max-w-4xl mx-auto text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              TempInbox Pro
            </h1>
            <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300">
              Generate disposable email addresses instantly. No registration required.
            </p>
          </div>
          <EmailGenerator />
          <Inbox />
        </section>
        <FAQ />
        <PopularArticles />
      </div>
      <Footer />
    </main>
  )
}


