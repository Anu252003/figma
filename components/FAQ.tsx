'use client'

import { useState } from 'react'

interface FAQItem {
    id: number
    question: string
    answer: string
}

const faqItems: FAQItem[] = [
    {
        id: 1,
        question: 'What is TempusMail and how does it work?',
        answer: 'TempusMail is a temporary email service that generates disposable email addresses instantly. It works by creating unique, anonymous email accounts that you can use for signing up on websites without revealing your real email address. Once you generate an email, you can receive messages sent to that address for a limited time.'
    },
    {
        id: 2,
        question: 'How is TempusMail different from regular email services?',
        answer: 'Unlike regular email services like Gmail or Outlook, TempusMail focuses on privacy and anonymity. You don\'t need to provide personal information or create a permanent account. The email addresses are temporary and automatically expire, making it perfect for protecting your privacy.'
    },
    {
        id: 3,
        question: 'Is TempusMail anonymous and secure?',
        answer: 'Yes, TempusMail is completely anonymous. You don\'t need to provide any personal information to use our service. All emails are encrypted and our servers follow strict security protocols to protect your data.'
    },
    {
        id: 4,
        question: 'When should I use TempusMail instead of my real email?',
        answer: 'Use TempusMail when signing up for websites you\'re unsure about, online shopping platforms, free trial services, forums, or any service where you want to protect your privacy and avoid spam emails on your main inbox.'
    },
    {
        id: 5,
        question: 'How long does an email stay in my TempusMail inbox?',
        answer: 'Temporary email addresses are typically active for 1 hour by default. You can use our "Refresh" feature to extend the time or generate a new email address whenever needed. The exact duration may vary based on the email provider.'
    },
    {
        id: 6,
        question: 'Can I reply or send emails using TempusMail?',
        answer: 'TempusMail is designed for receiving emails only. You cannot send or reply to emails using temporary email addresses. It\'s optimized for one-way communication where you receive verification codes, newsletters, or confirmations.'
    }
]

export default function FAQ() {
    const [expandedId, setExpandedId] = useState<number | null>(null)

    const toggleExpand = (id: number) => {
        setExpandedId(expandedId === id ? null : id)
    }

    return (
        <section className="bg-gradient-to-b from-blue-50 to-blue-100 dark:from-gray-900 dark:to-gray-800 py-16 md:py-24">
            <div className="container mx-auto px-4">
                <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 text-blue-600 dark:text-blue-400">
                    Frequently Asked Questions
                </h2>

                <div className="max-w-3xl mx-auto space-y-4">
                    {faqItems.map((item) => (
                        <div
                            key={item.id}
                            className="bg-gradient-to-r from-blue-100 to-blue-50 dark:from-gray-700 dark:to-gray-600 border-l-4 border-blue-500 dark:border-blue-400 rounded-lg overflow-hidden transition-all duration-300"
                        >
                            <button
                                onClick={() => toggleExpand(item.id)}
                                className="w-full px-6 py-4 flex items-center justify-between hover:bg-blue-200 dark:hover:bg-gray-600 transition-colors"
                            >
                                <span className="text-left text-lg font-semibold text-gray-900 dark:text-white">
                                    {item.question}
                                </span>
                                <svg
                                    className={`w-6 h-6 text-blue-600 dark:text-blue-400 flex-shrink-0 ml-4 transition-transform duration-300 ${expandedId === item.id ? 'rotate-180' : ''
                                        }`}
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M9 5l7 7-7 7"
                                    />
                                </svg>
                            </button>

                            {expandedId === item.id && (
                                <div className="px-6 py-4 bg-white dark:bg-gray-800 border-t border-blue-300 dark:border-gray-600">
                                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                                        {item.answer}
                                    </p>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
