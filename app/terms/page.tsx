import Header from '@/components/Header'
import Footer from '@/components/Footer'

export default function TermsPage() {
    return (
        <main className="min-h-screen flex flex-col">
            <Header />
            <div className="flex-1">
                <section className="container mx-auto px-4 py-12 md:py-20">
                    <div className="max-w-4xl mx-auto">
                        <h1 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">Terms of Service</h1>
                        <p className="text-gray-600 dark:text-gray-400 mb-6">These Terms govern your use of TempusMail. By using the service you agree to these terms.</p>

                        <section className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm mb-6">
                            <h2 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">Acceptable Use</h2>
                            <p className="text-gray-600 dark:text-gray-400 text-sm">TempusMail is intended for lawful uses only. Users must not use the service for harassment, phishing, or illegal activities.</p>
                        </section>

                        <section className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
                            <h2 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">Limitation of Liability</h2>
                            <p className="text-gray-600 dark:text-gray-400 text-sm">We provide the service as-is and are not liable for lost or intercepted messages. Use at your own risk.</p>
                        </section>
                    </div>
                </section>
            </div>
            <Footer />
        </main>
    )
}
