import Header from '@/components/Header'
import Footer from '@/components/Footer'
import FAQ from '@/components/FAQ'

export default function FAQPage() {
    return (
        <main className="min-h-screen flex flex-col">
            <Header />
            <div className="flex-1">
                <section className="container mx-auto px-4 py-12 md:py-20">
                    <div className="max-w-4xl mx-auto">
                        <h1 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900 dark:text-white">FAQ</h1>
                        <FAQ />
                    </div>
                </section>
            </div>
            <Footer />
        </main>
    )
}
