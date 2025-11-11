import Header from '@/components/Header'
import Footer from '@/components/Footer'

export default function HelpCenterPage() {
    return (
        <main className="min-h-screen flex flex-col">
            <Header />
            <div className="flex-1">
                <section className="container mx-auto px-4 py-12 md:py-20">
                    <div className="max-w-5xl mx-auto">
                        <div className="mb-8 rounded-lg overflow-hidden shadow-lg">
                            <img src="https://images.unsplash.com/photo-1523961131990-5ea7c61b2107?q=80&w=1600&auto=format&fit=crop&ixlib=rb-4.0.3&s=abcd" alt="Help center" className="w-full h-56 object-cover rounded-lg" />
                        </div>

                        <h1 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">Help Center</h1>
                        <p className="text-gray-600 dark:text-gray-400 mb-8">Find articles, troubleshooting guides, and frequently asked questions to get the help you need.</p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                                <h3 className="font-semibold mb-2 text-gray-900 dark:text-white">Getting Started</h3>
                                <p className="text-gray-600 dark:text-gray-400 text-sm">Learn how to generate a temporary email and access messages.</p>
                            </div>
                            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                                <h3 className="font-semibold mb-2 text-gray-900 dark:text-white">Account & Billing</h3>
                                <p className="text-gray-600 dark:text-gray-400 text-sm">Information about premium features and billing.</p>
                            </div>
                        </div>

                    </div>
                </section>
            </div>
            <Footer />
        </main>
    )
}
