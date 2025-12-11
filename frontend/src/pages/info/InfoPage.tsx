import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { HiOutlineArrowLeft } from 'react-icons/hi';

interface InfoPageProps {
    title: string;
    description: string;
    content: React.ReactNode;
}

const InfoPage = ({ title, description, content }: InfoPageProps) => {
    return (
        <>
            <Helmet>
                <title>{title} - Electronics Store</title>
                <meta name="description" content={description} />
            </Helmet>

            <div className="bg-background min-h-screen py-12">
                <div className="container-custom max-w-4xl">
                    <Link to="/" className="inline-flex items-center gap-2 text-text-muted hover:text-accent mb-8 transition-colors">
                        <HiOutlineArrowLeft size={20} />
                        Back to Home
                    </Link>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-background-card border border-border rounded-2xl p-8 md:p-12"
                    >
                        <h1 className="text-3xl md:text-4xl font-bold text-text-primary mb-4 font-heading">
                            {title}
                        </h1>
                        <p className="text-text-muted mb-8 text-lg">{description}</p>

                        <div className="prose prose-invert max-w-none text-text-secondary">
                            {content}
                        </div>
                    </motion.div>
                </div>
            </div>
        </>
    );
};

// Company Pages
export const AboutPage = () => (
    <InfoPage
        title="About Us"
        description="Learn more about ElectroStore and our mission"
        content={
            <div className="space-y-6">
                <p>ElectroStore is your premier destination for cutting-edge electronics and tech products. Founded with a passion for innovation, we've grown to become a trusted name in the electronics retail space.</p>
                <h2 className="text-xl font-bold text-text-primary">Our Mission</h2>
                <p>We believe everyone deserves access to the latest technology. Our mission is to provide high-quality electronics at competitive prices, backed by exceptional customer service.</p>
                <h2 className="text-xl font-bold text-text-primary">Why Choose Us?</h2>
                <ul className="list-disc pl-6 space-y-2">
                    <li>Curated selection of premium electronics</li>
                    <li>Competitive pricing with price-match guarantee</li>
                    <li>Expert customer support team</li>
                    <li>Fast and reliable shipping</li>
                    <li>30-day hassle-free returns</li>
                </ul>
            </div>
        }
    />
);

export const CareersPage = () => (
    <InfoPage
        title="Careers"
        description="Join our team and shape the future of tech retail"
        content={
            <div className="space-y-6">
                <p>We're always looking for talented individuals who share our passion for technology and customer service. At ElectroStore, you'll work with a dynamic team in a fast-paced environment.</p>
                <h2 className="text-xl font-bold text-text-primary">Current Openings</h2>
                <div className="space-y-4">
                    <div className="p-4 bg-background-secondary rounded-lg">
                        <h3 className="font-semibold text-text-primary">Senior Full-Stack Developer</h3>
                        <p className="text-text-muted text-sm">Remote • Full-time</p>
                    </div>
                    <div className="p-4 bg-background-secondary rounded-lg">
                        <h3 className="font-semibold text-text-primary">Customer Success Manager</h3>
                        <p className="text-text-muted text-sm">San Francisco, CA • Full-time</p>
                    </div>
                    <div className="p-4 bg-background-secondary rounded-lg">
                        <h3 className="font-semibold text-text-primary">Product Marketing Specialist</h3>
                        <p className="text-text-muted text-sm">Remote • Full-time</p>
                    </div>
                </div>
                <p>Interested? Send your resume to <span className="text-accent">careers@electrostore.com</span></p>
            </div>
        }
    />
);

export const BlogPage = () => (
    <InfoPage
        title="Blog"
        description="Tech news, product reviews, and industry insights"
        content={
            <div className="space-y-8">
                <div className="border-b border-border pb-6">
                    <p className="text-accent text-sm mb-2">December 10, 2024</p>
                    <h2 className="text-xl font-bold text-text-primary mb-2">Top 10 Tech Gadgets for 2024</h2>
                    <p>Discover the most innovative and must-have gadgets that defined this year in technology...</p>
                </div>
                <div className="border-b border-border pb-6">
                    <p className="text-accent text-sm mb-2">December 5, 2024</p>
                    <h2 className="text-xl font-bold text-text-primary mb-2">iPhone 15 Pro Max: A Comprehensive Review</h2>
                    <p>After months of testing, here's our detailed review of Apple's flagship smartphone...</p>
                </div>
                <div className="border-b border-border pb-6">
                    <p className="text-accent text-sm mb-2">November 28, 2024</p>
                    <h2 className="text-xl font-bold text-text-primary mb-2">The Future of Wearable Technology</h2>
                    <p>From smartwatches to AR glasses, we explore what's next in wearable tech...</p>
                </div>
            </div>
        }
    />
);

export const ContactPage = () => (
    <InfoPage
        title="Contact Us"
        description="Get in touch with our team"
        content={
            <div className="space-y-6">
                <p>Have questions? We're here to help! Reach out through any of the channels below.</p>
                <div className="grid md:grid-cols-2 gap-6">
                    <div className="p-6 bg-background-secondary rounded-lg">
                        <h3 className="font-semibold text-text-primary mb-2">📧 Email</h3>
                        <p className="text-accent">support@electrostore.com</p>
                    </div>
                    <div className="p-6 bg-background-secondary rounded-lg">
                        <h3 className="font-semibold text-text-primary mb-2">📞 Phone</h3>
                        <p className="text-accent">1-800-ELECTRONICS</p>
                    </div>
                    <div className="p-6 bg-background-secondary rounded-lg">
                        <h3 className="font-semibold text-text-primary mb-2">💬 Live Chat</h3>
                        <p className="text-text-muted">Available 24/7</p>
                    </div>
                    <div className="p-6 bg-background-secondary rounded-lg">
                        <h3 className="font-semibold text-text-primary mb-2">📍 Address</h3>
                        <p className="text-text-muted">123 Tech Blvd, Silicon Valley, CA</p>
                    </div>
                </div>
            </div>
        }
    />
);

// Support Pages
export const FAQsPage = () => (
    <InfoPage
        title="Frequently Asked Questions"
        description="Find answers to common questions"
        content={
            <div className="space-y-6">
                {[
                    { q: 'How long does shipping take?', a: 'Standard shipping typically takes 3-5 business days. Express shipping is available for 1-2 day delivery.' },
                    { q: 'What is your return policy?', a: 'We offer a 30-day hassle-free return policy on all unused items in original packaging.' },
                    { q: 'Do you ship internationally?', a: 'Yes! We ship to over 100 countries worldwide. International shipping times vary by destination.' },
                    { q: 'How can I track my order?', a: 'Once your order ships, you\'ll receive an email with tracking information. You can also track orders in your account.' },
                    { q: 'Are products covered by warranty?', a: 'All products come with manufacturer warranty. We also offer extended protection plans.' },
                ].map((faq, i) => (
                    <div key={i} className="border-b border-border pb-4">
                        <h3 className="font-semibold text-text-primary mb-2">{faq.q}</h3>
                        <p>{faq.a}</p>
                    </div>
                ))}
            </div>
        }
    />
);

export const ShippingPage = () => (
    <InfoPage
        title="Shipping Information"
        description="Learn about our shipping options and delivery times"
        content={
            <div className="space-y-6">
                <h2 className="text-xl font-bold text-text-primary">Shipping Options</h2>
                <div className="space-y-4">
                    <div className="p-4 bg-background-secondary rounded-lg flex justify-between">
                        <div>
                            <h3 className="font-semibold text-text-primary">Standard Shipping</h3>
                            <p className="text-text-muted text-sm">3-5 business days</p>
                        </div>
                        <p className="text-accent font-semibold">Free over $100</p>
                    </div>
                    <div className="p-4 bg-background-secondary rounded-lg flex justify-between">
                        <div>
                            <h3 className="font-semibold text-text-primary">Express Shipping</h3>
                            <p className="text-text-muted text-sm">1-2 business days</p>
                        </div>
                        <p className="text-accent font-semibold">$14.99</p>
                    </div>
                    <div className="p-4 bg-background-secondary rounded-lg flex justify-between">
                        <div>
                            <h3 className="font-semibold text-text-primary">Same-Day Delivery</h3>
                            <p className="text-text-muted text-sm">Select metro areas only</p>
                        </div>
                        <p className="text-accent font-semibold">$24.99</p>
                    </div>
                </div>
            </div>
        }
    />
);

export const ReturnsPage = () => (
    <InfoPage
        title="Returns & Refunds"
        description="Our hassle-free return policy"
        content={
            <div className="space-y-6">
                <p>We want you to be completely satisfied with your purchase. If you're not, we make returns easy.</p>
                <h2 className="text-xl font-bold text-text-primary">Return Policy</h2>
                <ul className="list-disc pl-6 space-y-2">
                    <li>30-day return window from delivery date</li>
                    <li>Items must be unused and in original packaging</li>
                    <li>Free return shipping on defective items</li>
                    <li>Refunds processed within 5-7 business days</li>
                </ul>
                <h2 className="text-xl font-bold text-text-primary">How to Return</h2>
                <ol className="list-decimal pl-6 space-y-2">
                    <li>Log into your account and go to Orders</li>
                    <li>Select the item you wish to return</li>
                    <li>Print the prepaid return label</li>
                    <li>Drop off at any authorized shipping location</li>
                </ol>
            </div>
        }
    />
);

export const WarrantyPage = () => (
    <InfoPage
        title="Warranty Information"
        description="Product warranties and protection plans"
        content={
            <div className="space-y-6">
                <p>All products sold by ElectroStore are covered by manufacturer warranties. We also offer extended protection.</p>
                <h2 className="text-xl font-bold text-text-primary">Standard Warranty</h2>
                <p>Most electronics come with a 1-year manufacturer warranty covering defects in materials and workmanship.</p>
                <h2 className="text-xl font-bold text-text-primary">ElectroStore Protection+</h2>
                <div className="p-6 bg-accent/10 border border-accent/30 rounded-lg">
                    <h3 className="font-semibold text-accent mb-2">Extended Protection Plans</h3>
                    <ul className="list-disc pl-6 space-y-1">
                        <li>2 or 3 year coverage options</li>
                        <li>Covers accidental damage</li>
                        <li>No deductibles</li>
                        <li>Fast replacement or repair</li>
                    </ul>
                </div>
            </div>
        }
    />
);

// Legal Pages
export const PrivacyPage = () => (
    <InfoPage
        title="Privacy Policy"
        description="How we protect and use your information"
        content={
            <div className="space-y-6">
                <p>Last updated: December 2024</p>
                <p>This Privacy Policy explains how ElectroStore collects, uses, and protects your personal information when you use our website and services.</p>
                <h2 className="text-xl font-bold text-text-primary">Information We Collect</h2>
                <p>We collect information you provide directly, such as your name, email, shipping address, and payment information when making a purchase.</p>
                <h2 className="text-xl font-bold text-text-primary">How We Use Your Information</h2>
                <p>We use your information to process orders, communicate with you, and improve our services. We never sell your personal data to third parties.</p>
                <h2 className="text-xl font-bold text-text-primary">Data Security</h2>
                <p>We implement industry-standard security measures to protect your data, including SSL encryption and secure payment processing.</p>
            </div>
        }
    />
);

export const TermsPage = () => (
    <InfoPage
        title="Terms of Service"
        description="Terms and conditions for using ElectroStore"
        content={
            <div className="space-y-6">
                <p>Last updated: December 2024</p>
                <p>By using ElectroStore, you agree to these Terms of Service. Please read them carefully.</p>
                <h2 className="text-xl font-bold text-text-primary">Use of Service</h2>
                <p>You must be at least 18 years old to make purchases. You agree to provide accurate information and keep your account secure.</p>
                <h2 className="text-xl font-bold text-text-primary">Orders & Payment</h2>
                <p>All orders are subject to availability. Prices are subject to change without notice. Payment is required at time of purchase.</p>
                <h2 className="text-xl font-bold text-text-primary">Limitation of Liability</h2>
                <p>ElectroStore's liability is limited to the purchase price of products. We are not liable for indirect or consequential damages.</p>
            </div>
        }
    />
);

export default InfoPage;
