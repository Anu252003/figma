import Header from '@/components/Header'
import Footer from '@/components/Footer'

export default function AdvertisingPage() {
    return (
        <main className="min-h-screen flex flex-col">
            <Header />
            <div className="flex-1">
                <section className="container mx-auto px-4 py-12 md:py-20">
                    <div className="max-w-4xl mx-auto">
                        <h1 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">Advertising with TempusMail</h1>
                        <p className="text-gray-600 dark:text-gray-400 mb-6">Reach privacy-conscious users and promote relevant offers without compromising user trust. TempusMail provides tasteful, privacy-first advertising opportunities designed for temporary-email users.</p>

                        <section className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm mb-6">
                            <h2 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">Why advertise here?</h2>
                            <ul className="list-disc list-inside text-gray-600 dark:text-gray-400">
                                <li>Access to users who value privacy and quick interactions.</li>
                                <li>Contextual placements near inbox and generator flows.</li>
                                <li>Low-friction ad formats that don't require signups.</li>
                            </ul>
                        </section>

                        <section className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm mb-6">
                            <h2 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">Ad formats</h2>
                            <p className="text-gray-600 dark:text-gray-400 mb-3">We support several lightweight ad formats:</p>
                            <ul className="list-disc list-inside text-gray-600 dark:text-gray-400">
                                <li>Native sponsor cards</li>
                                <li>Small banner placements</li>
                                <li>Sponsored listings in the blog and help center</li>
                            </ul>
                            {/* Example advertiser preview */}
                            <div className="mt-6">
                                <h3 className="text-md font-semibold mb-3 text-gray-900 dark:text-white">Example advertiser preview</h3>
                                <div className="rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
                                    <div className="md:flex">
                                        <div className="md:w-1/3 bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center h-40 md:h-auto">
                                            <div className="text-center text-white p-4">
                                                <p className="text-sm font-semibold">Acme Privacy</p>
                                                <p className="text-xs mt-2">Email Protection</p>
                                            </div>
                                        </div>
                                        <div className="p-4 md:w-2/3 bg-white dark:bg-gray-800">
                                            <h4 className="font-semibold text-gray-900 dark:text-white">Acme Privacy Tools</h4>
                                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">Protect your inbox with Acme — a privacy-first email blocker that helps you stay in control. Learn more with a one-click sign-up.</p>
                                            <div className="mt-4">
                                                <a href="#" className="inline-block px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm">Learn more</a>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>

                        <section className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
                            <h2 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">Get started</h2>
                            <p className="text-gray-600 dark:text-gray-400 mb-4">Interested in advertising? Contact our team and we'll share pricing and placement options tailored to your campaign.</p>
                            <a href="/contact" className="inline-block px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg">Contact Sales</a>
                        </section>
                    </div>
                </section>
            </div>
            <Footer />
        </main>
    )
}
