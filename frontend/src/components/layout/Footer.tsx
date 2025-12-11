import { Link } from 'react-router-dom';
import { HiOutlineMail, HiOutlinePhone, HiOutlineLocationMarker } from 'react-icons/hi';
import { FaGithub, FaTwitter, FaLinkedin, FaDiscord } from 'react-icons/fa';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    const categories = [
        { name: 'Smartphones', slug: 'smartphones' },
        { name: 'Laptops', slug: 'laptops' },
        { name: 'Tablets', slug: 'tablets' },
        { name: 'Audio', slug: 'audio' },
        { name: 'Gaming', slug: 'gaming' },
    ];

    const company = [
        { name: 'About', path: '/about' },
        { name: 'Careers', path: '/careers' },
        { name: 'Blog', path: '/blog' },
        { name: 'Contact', path: '/contact' },
    ];

    const support = [
        { name: 'FAQs', path: '/faqs' },
        { name: 'Shipping', path: '/shipping' },
        { name: 'Returns', path: '/returns' },
        { name: 'Warranty', path: '/warranty' },
    ];

    return (
        <footer className="bg-background-secondary border-t border-border mt-20">
            <div className="container-custom py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
                    {/* Brand */}
                    <div className="lg:col-span-2">
                        <Link to="/" className="inline-block mb-4">
                            <h2 className="text-2xl font-bold text-accent font-heading">ElectroStore</h2>
                        </Link>
                        <p className="text-text-muted mb-6 max-w-sm leading-relaxed">
                            Building intelligent digital solutions that bridge creativity and technology. Your one-stop destination for premium electronics.
                        </p>
                        <div className="space-y-3">
                            <div className="flex items-center gap-3 text-text-muted">
                                <HiOutlinePhone className="flex-shrink-0 text-accent" size={18} />
                                <span className="text-sm">1-800-ELECTRONICS</span>
                            </div>
                            <div className="flex items-center gap-3 text-text-muted">
                                <HiOutlineMail className="flex-shrink-0 text-accent" size={18} />
                                <span className="text-sm">support@electrostore.com</span>
                            </div>
                            <div className="flex items-center gap-3 text-text-muted">
                                <HiOutlineLocationMarker className="flex-shrink-0 text-accent" size={18} />
                                <span className="text-sm">Silicon Valley, CA</span>
                            </div>
                        </div>
                    </div>

                    {/* Categories */}
                    <div>
                        <h4 className="font-semibold text-text-primary mb-4">Categories</h4>
                        <ul className="space-y-3">
                            {categories.map((category) => (
                                <li key={category.slug}>
                                    <Link
                                        to={`/products?category=${category.slug}`}
                                        className="text-text-muted hover:text-accent transition-colors text-sm"
                                    >
                                        {category.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Company */}
                    <div>
                        <h4 className="font-semibold text-text-primary mb-4">Company</h4>
                        <ul className="space-y-3">
                            {company.map((item) => (
                                <li key={item.path}>
                                    <Link
                                        to={item.path}
                                        className="text-text-muted hover:text-accent transition-colors text-sm"
                                    >
                                        {item.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Support */}
                    <div>
                        <h4 className="font-semibold text-text-primary mb-4">Support</h4>
                        <ul className="space-y-3">
                            {support.map((item) => (
                                <li key={item.path}>
                                    <Link
                                        to={item.path}
                                        className="text-text-muted hover:text-accent transition-colors text-sm"
                                    >
                                        {item.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>

            {/* Bottom bar */}
            <div className="border-t border-border">
                <div className="container-custom py-6">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                        <p className="text-text-muted text-sm">
                            © {currentYear} ElectroStore. All rights reserved.
                        </p>

                        {/* Social links */}
                        <div className="flex items-center gap-4">
                            <a href="#" className="p-2 text-text-muted hover:text-accent transition-colors">
                                <FaGithub size={18} />
                            </a>
                            <a href="#" className="p-2 text-text-muted hover:text-accent transition-colors">
                                <FaTwitter size={18} />
                            </a>
                            <a href="#" className="p-2 text-text-muted hover:text-accent transition-colors">
                                <FaLinkedin size={18} />
                            </a>
                            <a href="#" className="p-2 text-text-muted hover:text-accent transition-colors">
                                <FaDiscord size={18} />
                            </a>
                        </div>

                        {/* Legal links */}
                        <div className="flex items-center gap-6 text-sm text-text-muted">
                            <Link to="/privacy" className="hover:text-accent transition-colors">Privacy</Link>
                            <Link to="/terms" className="hover:text-accent transition-colors">Terms</Link>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
