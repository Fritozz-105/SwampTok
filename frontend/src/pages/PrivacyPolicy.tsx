import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const PrivacyPolicy: React.FC = () => {
    return (
        <main className="min-h-screen p-8 bg-gray-50">
            <div className="max-w-4xl mx-auto bg-white shadow-sm rounded-lg p-8">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Privacy Policy</h1>
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
                            <h2 className="text-xl font-semibold text-gray-900 mb-3">1. Introduction</h2>
                            <p className="text-gray-700 mb-4">
                                SwampTok ("we", "our", or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our website and services.
                            </p>
                            <p className="text-gray-700 mb-4">
                                Please read this Privacy Policy carefully. If you do not agree with the terms of this Privacy Policy, please do not access the site.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-gray-900 mb-3">2. Information We Collect</h2>

                            <h3 className="text-lg font-medium text-gray-800 mb-2">Personal Data</h3>
                            <p className="text-gray-700 mb-4">
                                We may collect personal information that you voluntarily provide to us when you register on our platform, including:
                            </p>
                            <ul className="list-disc list-inside text-gray-700 ml-4 mb-4">
                                <li className="mb-2">Name</li>
                                <li className="mb-2">Email address</li>
                                <li className="mb-2">Date of birth</li>
                                <li className="mb-2">Profile information</li>
                                <li className="mb-2">Content you post or share</li>
                            </ul>

                            <h3 className="text-lg font-medium text-gray-800 mb-2">Usage Data</h3>
                            <p className="text-gray-700 mb-4">
                                We may also collect information that your browser sends whenever you visit our service, such as:
                            </p>
                            <ul className="list-disc list-inside text-gray-700 ml-4 mb-4">
                                <li className="mb-2">IP address</li>
                                <li className="mb-2">Browser type and version</li>
                                <li className="mb-2">Pages of our service that you visit</li>
                                <li className="mb-2">Time and date of your visit</li>
                                <li className="mb-2">Time spent on those pages</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-gray-900 mb-3">3. How We Use Your Information</h2>
                            <p className="text-gray-700 mb-4">
                                We may use the information we collect for various purposes, including:
                            </p>
                            <ul className="list-disc list-inside text-gray-700 ml-4 mb-4">
                                <li className="mb-2">To provide and maintain our service</li>
                                <li className="mb-2">To notify you about changes to our service</li>
                                <li className="mb-2">To allow you to participate in interactive features</li>
                                <li className="mb-2">To provide customer support</li>
                                <li className="mb-2">To gather analysis or valuable information to improve our service</li>
                                <li className="mb-2">To monitor the usage of our service</li>
                                <li className="mb-2">To detect, prevent and address technical issues</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-gray-900 mb-3">4. Cookies and Tracking Technologies</h2>
                            <p className="text-gray-700 mb-4">
                                We use cookies and similar tracking technologies to track activity on our service and hold certain information. Cookies are files with small amount of data which may include an anonymous unique identifier.
                            </p>
                            <p className="text-gray-700 mb-4">
                                You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. However, if you do not accept cookies, you may not be able to use some portions of our service.
                            </p>
                            <p className="text-gray-700 mb-4">
                                Examples of cookies we use:
                            </p>
                            <ul className="list-disc list-inside text-gray-700 ml-4 mb-4">
                                <li className="mb-2">Session Cookies: We use Session Cookies to operate our service.</li>
                                <li className="mb-2">Preference Cookies: We use Preference Cookies to remember your preferences and settings.</li>
                                <li className="mb-2">Security Cookies: We use Security Cookies for security purposes.</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-gray-900 mb-3">5. Third-Party Services</h2>
                            <p className="text-gray-700 mb-4">
                                We may employ third-party companies and individuals to facilitate our service ("Service Providers"), to provide the service on our behalf, to perform service-related services or to assist us in analyzing how our service is used.
                            </p>
                            <p className="text-gray-700 mb-4">
                                These third parties have access to your Personal Data only to perform these tasks on our behalf and are obligated not to disclose or use it for any other purpose.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-gray-900 mb-3">6. Security of Data</h2>
                            <p className="text-gray-700 mb-4">
                                The security of your data is important to us, but remember that no method of transmission over the Internet, or method of electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your Personal Data, we cannot guarantee its absolute security.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-gray-900 mb-3">7. Your Data Protection Rights</h2>
                            <p className="text-gray-700 mb-4">
                                If you are a resident of the European Economic Area (EEA), you have certain data protection rights. SwampTok aims to take reasonable steps to allow you to correct, amend, delete, or limit the use of your Personal Data.
                            </p>
                            <p className="text-gray-700 mb-4">
                                You have the following data protection rights:
                            </p>
                            <ul className="list-disc list-inside text-gray-700 ml-4 mb-4">
                                <li className="mb-2">The right to access, update or delete the information we have on you</li>
                                <li className="mb-2">The right of rectification</li>
                                <li className="mb-2">The right to object</li>
                                <li className="mb-2">The right of restriction</li>
                                <li className="mb-2">The right to data portability</li>
                                <li className="mb-2">The right to withdraw consent</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-gray-900 mb-3">8. Children's Privacy</h2>
                            <p className="text-gray-700 mb-4">
                                Our service is not intended for use by children under the age of 17 ("Adult"). We do not knowingly collect personally identifiable information from Children under 17. If you become aware that a child has provided us with Personal Data, please contact us. If we become aware that we have collected Personal Data from children without verification of parental consent, we take steps to remove that information from our servers.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-gray-900 mb-3">9. Changes to This Privacy Policy</h2>
                            <p className="text-gray-700 mb-4">
                                We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page. You are advised to review this Privacy Policy periodically for any changes. Changes to this Privacy Policy are effective when they are posted on this page.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-gray-900 mb-3">10. Contact Us</h2>
                            <p className="text-gray-700 mb-4">
                                If you have any questions about this Privacy Policy, please contact us at <a href="mailto:swamptok.help@gmail.com" className="text-blue-600 hover:underline">swamptok.help@gmail.com</a>.
                            </p>
                        </section>
                    </div>
                </div>
            </div>
        </main>
    );
};

export default PrivacyPolicy;
