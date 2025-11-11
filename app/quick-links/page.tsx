import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Link from 'next/link'

export default function QuickLinksPage() {
    return (
        <main className="min-h-screen flex flex-col">
            <Header />
            <div className="flex-1">
                <section className="container mx-auto px-4 py-12 md:py-20">
                    <div className="max-w-4xl mx-auto">
                        <h1 className="text-4xl font-bold mb-6 text-gray-900 dark:text-white">Quick Links</h1>
                        <p className="text-gray-600 dark:text-gray-400 mb-8">Useful links and policies for TempusMail.</p>

                        <ul className="space-y-4">
                            <li>
                                <Link href="/blog" className="text-lg text-blue-600 dark:text-blue-400 hover:underline">Blog</Link>
                                <p className="text-sm text-gray-600 dark:text-gray-400">Read our latest articles about temporary email, privacy and security.</p>
                            </li>

                            <li>
                                <Link href="/about" className="text-lg text-blue-600 dark:text-blue-400 hover:underline">About Us</Link>
                                <p className="text-sm text-gray-600 dark:text-gray-400">Learn more about TempusMail.</p>
                            </li>

                            <li>
                                <Link href="/privacy-policy" className="text-lg text-blue-600 dark:text-blue-400 hover:underline">Privacy Policy</Link>
                                <p className="text-sm text-gray-600 dark:text-gray-400">Privacy practices and how we handle data.</p>
                            </li>

                            <li>
                                <Link href="/terms" className="text-lg text-blue-600 dark:text-blue-400 hover:underline">Terms of Service</Link>
                                <p className="text-sm text-gray-600 dark:text-gray-400">Service terms and acceptable use.</p>
                            </li>
                        </ul>
                    </div>
                </section>
            </div>
            <Footer />
        </main>
    )
}
