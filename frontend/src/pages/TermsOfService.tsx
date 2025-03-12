import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const TermsOfService: React.FC = () => {
    return (
        <main className="min-h-screen p-8 bg-gray-50">
            <div className="max-w-4xl mx-auto bg-white shadow-sm rounded-lg p-8">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Terms of Service</h1>
                    <Link
                        to="/signup"
                        className="flex items-center px-4 py-2 text-gray-700 hover:text-black transition-colors"
                    >
                        <ArrowLeft size={20} strokeWidth={2} />
                        <span className="ml-2">Back to Sign Up</span>
                    </Link>
                </div>

                <div className="prose max-w-none">
                    <p className="text-gray-600 mb-6">
                        Last Updated: March 12, 2025
                    </p>

                    <div className="space-y-6">
                        <section>
                            <h2 className="text-xl font-semibold text-gray-900 mb-3">1. Acceptance of Terms</h2>
                            <p className="text-gray-700 mb-4">
                                By accessing or using SwampTok, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing this site.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-gray-900 mb-3">2. Use License</h2>
                            <p className="text-gray-700 mb-4">
                                Permission is granted to temporarily access the materials on SwampTok's website for personal, non-commercial viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
                            </p>
                            <ul className="list-disc list-inside text-gray-700 ml-4 mb-4">
                                <li className="mb-2">Modify or copy the materials</li>
                                <li className="mb-2">Use the materials for any commercial purpose</li>
                                <li className="mb-2">Attempt to decompile or reverse engineer any software contained on SwampTok</li>
                                <li className="mb-2">Remove any copyright or other proprietary notations from the materials</li>
                                <li className="mb-2">Transfer the materials to another person or "mirror" the materials on any other server</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-gray-900 mb-3">3. User Account and Privacy</h2>
                            <p className="text-gray-700 mb-4">
                                To access certain features of the platform, you may be required to create an account. You are responsible for maintaining the confidentiality of your account information, including your password, and for all activity that occurs under your account.
                            </p>
                            <p className="text-gray-700 mb-4">
                                SwampTok collects and uses personal information according to our <Link to="/privacy" className="text-blue-600 hover:underline">Privacy Policy</Link>, which is incorporated into these Terms of Service.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-gray-900 mb-3">4. User Content</h2>
                            <p className="text-gray-700 mb-4">
                                By posting, uploading, or submitting content to SwampTok, you grant SwampTok a non-exclusive, royalty-free, worldwide, perpetual license to use, modify, publicly perform, publicly display, reproduce, and distribute such content on and through the service.
                            </p>
                            <p className="text-gray-700 mb-4">
                                You represent and warrant that you own or control all rights to the content you post, that the content is accurate, and that use of the content does not violate these Terms and will not cause injury to any person or entity.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-gray-900 mb-3">5. Prohibited Activities</h2>
                            <p className="text-gray-700 mb-4">
                                Users of SwampTok are prohibited from:
                            </p>
                            <ul className="list-disc list-inside text-gray-700 ml-4 mb-4">
                                <li className="mb-2">Using the service for any illegal purpose or in violation of any local, state, national, or international law</li>
                                <li className="mb-2">Harassing, abusing, or harming another person</li>
                                <li className="mb-2">Posting or sharing inappropriate, offensive, or explicit material</li>
                                <li className="mb-2">Impersonating another user or person</li>
                                <li className="mb-2">Using the service in a manner that could disable, overburden, damage, or impair the service</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-gray-900 mb-3">6. Termination</h2>
                            <p className="text-gray-700 mb-4">
                                SwampTok reserves the right to terminate or suspend your account and access to the service immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-gray-900 mb-3">7. Limitation of Liability</h2>
                            <p className="text-gray-700 mb-4">
                                In no event shall SwampTok, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the service.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-gray-900 mb-3">8. Changes to Terms</h2>
                            <p className="text-gray-700 mb-4">
                                SwampTok reserves the right to modify or replace these Terms at any time. It is your responsibility to check these Terms periodically for changes. Your continued use of the service following the posting of any changes constitutes acceptance of those changes.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-gray-900 mb-3">9. Contact Information</h2>
                            <p className="text-gray-700 mb-4">
                                If you have any questions about these Terms, please contact us at <a href="mailto:swamptok.help@gmail.com" className="text-blue-600 hover:underline">swamptok.help@gmail.com</a>.
                            </p>
                        </section>
                    </div>
                </div>
            </div>
        </main>
    );
};

export default TermsOfService;
