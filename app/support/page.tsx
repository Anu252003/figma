import Header from '@/components/Header'
import Footer from '@/components/Footer'
import FAQ from '@/components/FAQ'

export default function SupportPage() {
    return (
        <main className="min-h-screen flex flex-col">
            <Header />
            <div className="flex-1">
                <section className="container mx-auto px-4 py-12 md:py-20">
                    <div className="max-w-4xl mx-auto">
                        <h1 className="text-4xl font-bold mb-4 text-gray-900 dark:text-white">Support</h1>
                        <p className="text-gray-600 dark:text-gray-400 mb-8">How can we help you? Browse the FAQ below, contact us, or visit our Help Center.</p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                                <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Contact Us</h2>
                                <p className="text-gray-600 dark:text-gray-400 mb-4">Have a question or need help? Send us a message and we'll get back to you.</p>
                                <form action="/api/contact" method="post" className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Name</label>
                                        <input name="name" required className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
                                        <input name="email" type="email" required className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Message</label>
                                        <textarea name="message" rows={5} required className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"></textarea>
                                    </div>
                                    <div>
                                        <button type="submit" className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg">Send Message</button>
                                    </div>
                                </form>
                            </div>

                            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                                <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Help Center</h2>
                                <p className="text-gray-600 dark:text-gray-400 mb-4">Troubleshooting guides, account help, and developer documentation will appear here.</p>
                                <ul className="list-disc list-inside text-gray-600 dark:text-gray-400">
                                    <li>Account & Billing</li>
                                    <li>Using TempusMail</li>
                                    <li>Developer/API</li>
                                </ul>
                            </div>
                        </div>

                        <FAQ />
                    </div>
                </section>
            </div>
            <Footer />
        </main>
    )
}
