import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Image from 'next/image'

export default function AboutPage() {
    return (
        <main className="min-h-screen flex flex-col">
            <Header />
            <div className="flex-1">
                <section className="container mx-auto px-4 py-12 md:py-20">
                    <div className="max-w-4xl mx-auto">
                        <div className="mb-8 rounded-lg overflow-hidden shadow-lg">
                            <div className="relative h-56 md:h-80 w-full bg-gray-200">
                                <img src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=1600&auto=format&fit=crop&ixlib=rb-4.0.3&s=0a7b0b6e3d6b3b2f9f2fb9f7e0a7d3f9" alt="About hero" className="w-full h-full object-cover" />
                            </div>
                        </div>

                        <h1 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">About TempusMail</h1>
                        <p className="text-gray-600 dark:text-gray-400 mb-6">TempusMail provides disposable email addresses to help you protect your privacy and avoid spam. We believe in simple, fast, and anonymous tools to keep your main inbox clean.</p>

                        <section className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm mb-8">
                            <h2 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">Our Mission</h2>
                            <p className="text-gray-600 dark:text-gray-400">We make privacy accessible by giving anyone the ability to create temporary email addresses in seconds. Our goal is to reduce unwanted email and give users control over their digital footprint.</p>
                        </section>

                        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                                <h3 className="font-semibold mb-2 text-gray-900 dark:text-white">Fast</h3>
                                <p className="text-gray-600 dark:text-gray-400 text-sm">Generate an email in a single click.</p>
                            </div>
                            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                                <h3 className="font-semibold mb-2 text-gray-900 dark:text-white">Private</h3>
                                <p className="text-gray-600 dark:text-gray-400 text-sm">No registration required. Keep your real email private.</p>
                            </div>
                            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                                <h3 className="font-semibold mb-2 text-gray-900 dark:text-white">Free</h3>
                                <p className="text-gray-600 dark:text-gray-400 text-sm">Basic functionality is free to use.</p>
                            </div>
                        </section>

                    </div>
                </section>
            </div>
            <Footer />
        </main>
    )
}
