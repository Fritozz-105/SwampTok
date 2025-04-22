import React, { useState } from 'react';
import Layout from '../components/Layout';
import { ChevronDown, ChevronUp, MessageCircle, Mail, Search, BookOpen, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

// FAQ data structure
interface FAQItem {
    question: string;
    answer: React.ReactNode;
}

// FAQ categories
const accountFAQs: FAQItem[] = [
    {
        question: 'How do I create an account?',
        answer: (
            <div>
                <p>You can create a SwampTok account in two ways:</p>
                <ol className="list-decimal list-inside mt-2 space-y-1">
                    <li>Click the "Sign up" button and create an account with your email address</li>
                    <li>Use the "Sign up with Google" option for a faster registration process</li>
                </ol>
                <p className="mt-2">Make sure to use your university email for the best experience.</p>
            </div>
        )
    },
    {
        question: 'How do I reset my password?',
        answer: (
            <div>
                <p>If you've forgotten your password:</p>
                <ol className="list-decimal list-inside mt-2 space-y-1">
                    <li>Go to the login page</li>
                    <li>Click on "Forget your password?"</li>
                    <li>Enter your email address</li>
                    <li>Follow the instructions sent to your email</li>
                </ol>
            </div>
        )
    },
    {
        question: 'How do I update my profile information?',
        answer: (
            <div>
                <p>You can easily update your profile information by:</p>
                <ol className="list-decimal list-inside mt-2 space-y-1">
                    <li>Going to the Settings page from the sidebar</li>
                    <li>Update your display name, bio, or interests</li>
                    <li>Upload a new profile picture if desired</li>
                    <li>Click "Update Profile" to save your changes</li>
                </ol>
            </div>
        )
    }
];

const contentFAQs: FAQItem[] = [
    {
        question: 'How do I create a post?',
        answer: (
            <div>
                <p>Creating a post on SwampTok is easy:</p>
                <ol className="list-decimal list-inside mt-2 space-y-1">
                    <li>Click on "Create Post" in the sidebar</li>
                    <li>Upload a video by clicking in the upload area</li>
                    <li>Add a caption to describe your post</li>
                    <li>Add relevant tags (separated by commas)</li>
                    <li>Click "Create Post" to publish</li>
                </ol>
            </div>
        )
    },
    {
        question: 'What type of content is allowed?',
        answer: (
            <div>
                <p>SwampTok is designed for campus community content. We encourage:</p>
                <ul className="list-disc list-inside mt-2 space-y-1">
                    <li>Campus events and activities</li>
                    <li>Academic resources and study tips</li>
                    <li>Student life and experiences</li>
                    <li>Organization announcements</li>
                </ul>
                <p className="mt-2">Please review our <Link to="/terms" className="text-blue-600 hover:underline">Terms of Service</Link> for full content guidelines.</p>
            </div>
        )
    },
    {
        question: 'Who can see my posts?',
        answer: (
            <p>Currently, all posts on SwampTok are public and can be seen by anyone on the platform. Users can find your content through the Explore page or by visiting your profile directly.</p>
        )
    }
];

const privacyFAQs: FAQItem[] = [
    {
        question: 'How is my data being used?',
        answer: (
            <div>
                <p>At SwampTok, we prioritize your privacy. We collect only necessary information to provide our services. For detailed information about how we handle your data, please review our <Link to="/privacy" className="text-blue-600 hover:underline">Privacy Policy</Link>.</p>
            </div>
        )
    },
    {
        question: 'Can I delete my account?',
        answer: (
            <p>Yes, you can delete your account at any time. Go to Settings, scroll to the bottom, and look for the "Delete Account" option. Please note that account deletion is permanent and all your data will be removed from our servers.</p>
        )
    }
];

const featureFAQs: FAQItem[] = [
    {
        question: 'How do I use the Calendar feature?',
        answer: (
            <div>
                <p>The Calendar feature helps you keep track of events:</p>
                <ol className="list-decimal list-inside mt-2 space-y-1">
                    <li>Navigate to the Calendar page from the sidebar</li>
                    <li>Click on any date to add an event</li>
                    <li>Enter the event name and save</li>
                    <li>Your events will be stored and displayed in the calendar</li>
                </ol>
            </div>
        )
    },
    {
        question: 'How do I follow other users?',
        answer: (
            <div>
                <p>To follow another user:</p>
                <ol className="list-decimal list-inside mt-2 space-y-1">
                    <li>Visit their profile page by clicking on their username or profile picture</li>
                    <li>Click the "Follow" button near their profile information</li>
                    <li>Their posts will now appear in your Home feed</li>
                </ol>
            </div>
        )
    }
];

// FAQ section component
interface FAQSectionProps {
    title: string;
    items: FAQItem[];
}

const FAQSection: React.FC<FAQSectionProps> = ({ title, items }) => {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    const toggleQuestion = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">{title}</h2>
            <div className="space-y-3">
                {items.map((faq, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg">
                        <button
                            className="w-full px-4 py-3 flex justify-between items-center text-left font-medium hover:bg-gray-50"
                            onClick={() => toggleQuestion(index)}
                        >
                            <span>{faq.question}</span>
                            {openIndex === index ? (
                                <ChevronUp size={20} className="flex-shrink-0 text-gray-500" />
                            ) : (
                                <ChevronDown size={20} className="flex-shrink-0 text-gray-500" />
                            )}
                        </button>
                        {openIndex === index && (
                            <div className="px-4 py-3 bg-gray-50 border-t border-gray-200">
                                {faq.answer}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

// Help Center component
const Help = () => {
    const { currentUser } = useAuth();
    const [searchQuery, setSearchQuery] = useState<string>('');

    return (
        <Layout>
            <div className="max-w-4xl mx-auto py-8 px-4">
                <h1 className="text-3xl font-bold mb-2">Help Center</h1>
                <p className="text-gray-600 mb-8">Find answers to common questions and learn how to make the most of SwampTok.</p>

                {/* Search */}
                <div className="mb-8">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Search for help topics..."
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>

                {/* Quick Help Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 hover:border-blue-500 transition-colors">
                        <div className="flex items-center mb-3">
                            <BookOpen size={20} className="text-blue-600 mr-2" />
                            <h3 className="font-semibold">Getting Started</h3>
                        </div>
                        <p className="text-sm text-gray-600">New to SwampTok? Learn the basics and set up your profile.</p>
                    </div>

                    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 hover:border-blue-500 transition-colors">
                        <div className="flex items-center mb-3">
                            <MessageCircle size={20} className="text-blue-600 mr-2" />
                            <h3 className="font-semibold">Contact Support</h3>
                        </div>
                        <p className="text-sm text-gray-600">Need personalized help? Reach out to our support team.</p>
                    </div>

                    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 hover:border-blue-500 transition-colors">
                        <div className="flex items-center mb-3">
                            <AlertCircle size={20} className="text-blue-600 mr-2" />
                            <h3 className="font-semibold">Report an Issue</h3>
                        </div>
                        <p className="text-sm text-gray-600">Found something that doesn't seem right? Let us know.</p>
                    </div>
                </div>

                {/* FAQ Sections */}
                <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
                    <h2 className="text-2xl font-semibold mb-6">Frequently Asked Questions</h2>

                    <FAQSection title="Account & Profile" items={accountFAQs} />
                    <FAQSection title="Posts & Content" items={contentFAQs} />
                    <FAQSection title="Features & Usage" items={featureFAQs} />
                    <FAQSection title="Privacy & Security" items={privacyFAQs} />
                </div>

                {/* Contact Section */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                    <h2 className="text-2xl font-semibold mb-4">Still Need Help?</h2>
                    <p className="mb-6">Our support team is available to assist you with any questions or issues.</p>

                    <div className="flex flex-col sm:flex-row gap-4">
                        <a
                            href="mailto:support@swamptok.com"
                            className="flex items-center justify-center bg-blue-600 text-white px-5 py-3 rounded-md hover:bg-blue-700 transition-colors"
                        >
                            <Mail size={18} className="mr-2" />
                            Email Support
                        </a>
                    </div>

                    <div className="mt-6 text-sm text-gray-500">
                        <p>Support hours: Monday-Friday, 9am-5pm EST</p>
                        <p>Typical response time: Within 72 hours</p>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default Help;
