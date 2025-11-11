import Header from '@/components/Header'
import Footer from '@/components/Footer'

export default function PrivacyPolicy() {
    return (
        <main className="min-h-screen flex flex-col">
            <Header />
            <div className="flex-1">
                <section className="container mx-auto px-4 py-12 md:py-20">
                    <div className="max-w-4xl mx-auto">
                        <h1 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">Privacy Policy</h1>
                        <p className="text-gray-600 dark:text-gray-400 mb-6">Your privacy is important to us. This page outlines how TempusMail collects, uses, and protects your information.</p>

                        <div className="space-y-6">
                            <p className="text-gray-600 dark:text-gray-400">TempusMail.com are committed to protecting your privacy. We will only use the information that we collect lawfully in accordance with the General Data Protection Regulation (GDPR) (Regulation (EU) 2016/679).</p>

                            <p className="text-gray-600 dark:text-gray-400">Information is saved for many years on your conventional e-mail. This may be exposed to hacking or lost due to failure of service.</p>

                            <p className="text-gray-600 dark:text-gray-400">Using the temporary mail allows you to completely protect your real mailbox against the loss of personal information. Your temporary e-mail address is completely anonymous. Your details: information about your person and users with whom you communicate, IP-address, e-mail address are protected and completely confidential.</p>

                            <p className="text-gray-600 dark:text-gray-400">TempusMail.com does not store your IP-address. This means you are reliably protected from all unauthorised actions that may endanger your information and compromise your privacy. All emails and data temporarily stored on our service are permanently deleted after the time expired. You can delete your temporary Email address at any time using the appropriate button 'Delete'.</p>

                            <p className="text-gray-600 dark:text-gray-400">Your privacy is the highest priority for us. You need not concern yourself about your data. We will provide full protection. Access to your data will only be provided to you personally and only for the lifetime of the temporary email address.</p>

                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">What does TempusMail.com do?</h3>
                            <p className="text-gray-600 dark:text-gray-400">TempusMail provides disposable email addresses that allow users to receive emails without exposing their main inbox. These addresses are temporary, anonymous, and intended to help protect users' privacy and reduce spam.</p>
                        </div>
                    </div>
                </section>
            </div>
            <Footer />
        </main>
    )
}
