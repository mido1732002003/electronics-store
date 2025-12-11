import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { HiOutlineLockClosed } from 'react-icons/hi';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

const CheckoutPage = () => {
    return (
        <>
            <Helmet>
                <title>Checkout - Electronics Store</title>
            </Helmet>

            <div className="bg-background min-h-screen py-12">
                <div className="container-custom">
                    <h1 className="text-3xl font-bold text-text-primary mb-8 font-heading">Checkout</h1>

                    <div className="grid lg:grid-cols-3 gap-8">
                        {/* Checkout Form */}
                        <div className="lg:col-span-2 space-y-8">
                            {/* Shipping Address */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-background-card border border-border rounded-xl p-6"
                            >
                                <h2 className="text-xl font-bold text-text-primary mb-6">Shipping Address</h2>
                                <div className="grid sm:grid-cols-2 gap-4">
                                    <Input label="First Name" placeholder="John" />
                                    <Input label="Last Name" placeholder="Doe" />
                                    <Input label="Email" type="email" placeholder="john@example.com" className="sm:col-span-2" />
                                    <Input label="Phone" type="tel" placeholder="+1 (555) 000-0000" className="sm:col-span-2" />
                                    <Input label="Address" placeholder="123 Main Street" className="sm:col-span-2" />
                                    <Input label="City" placeholder="New York" />
                                    <Input label="State" placeholder="NY" />
                                    <Input label="Postal Code" placeholder="10001" />
                                    <Input label="Country" placeholder="United States" />
                                </div>
                            </motion.div>

                            {/* Payment */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 }}
                                className="bg-background-card border border-border rounded-xl p-6"
                            >
                                <h2 className="text-xl font-bold text-text-primary mb-6">Payment Method</h2>
                                <div className="space-y-4">
                                    <label className="flex items-center gap-4 p-4 border border-accent bg-accent/10 rounded-lg cursor-pointer">
                                        <input type="radio" name="payment" defaultChecked className="text-accent focus:ring-accent" />
                                        <div className="flex-1">
                                            <p className="font-medium text-text-primary">Credit Card</p>
                                            <p className="text-sm text-text-muted">Pay securely with your credit card</p>
                                        </div>
                                        <div className="flex gap-2 text-2xl">💳</div>
                                    </label>
                                    <label className="flex items-center gap-4 p-4 border border-border rounded-lg cursor-pointer hover:border-accent transition-colors">
                                        <input type="radio" name="payment" className="text-accent focus:ring-accent" />
                                        <div className="flex-1">
                                            <p className="font-medium text-text-primary">PayPal</p>
                                            <p className="text-sm text-text-muted">Fast and secure PayPal checkout</p>
                                        </div>
                                        <div className="text-2xl">🅿️</div>
                                    </label>
                                </div>

                                <div className="mt-6 space-y-4">
                                    <Input label="Card Number" placeholder="1234 5678 9012 3456" />
                                    <div className="grid grid-cols-2 gap-4">
                                        <Input label="Expiry Date" placeholder="MM/YY" />
                                        <Input label="CVV" placeholder="123" />
                                    </div>
                                    <Input label="Cardholder Name" placeholder="JOHN DOE" />
                                </div>
                            </motion.div>
                        </div>

                        {/* Order Summary */}
                        <div>
                            <div className="bg-background-card border border-border rounded-xl p-6 sticky top-24">
                                <h2 className="text-xl font-bold text-text-primary mb-6">Order Summary</h2>

                                <div className="space-y-4 mb-6">
                                    <div className="flex gap-4">
                                        <img src="https://placehold.co/80x80/4f46e5/white?text=1" alt="" className="w-16 h-16 rounded-lg" />
                                        <div className="flex-1">
                                            <p className="font-medium text-sm text-text-primary">iPhone 15 Pro Max</p>
                                            <p className="text-text-muted text-sm">Qty: 1</p>
                                        </div>
                                        <p className="font-medium text-text-primary">$1,199.99</p>
                                    </div>
                                    <div className="flex gap-4">
                                        <img src="https://placehold.co/80x80/0a0a0a/white?text=2" alt="" className="w-16 h-16 rounded-lg" />
                                        <div className="flex-1">
                                            <p className="font-medium text-sm text-text-primary">Sony WH-1000XM5</p>
                                            <p className="text-text-muted text-sm">Qty: 2</p>
                                        </div>
                                        <p className="font-medium text-text-primary">$699.98</p>
                                    </div>
                                </div>

                                <hr className="border-border mb-4" />

                                <div className="space-y-3 text-sm">
                                    <div className="flex justify-between text-text-secondary">
                                        <span>Subtotal</span>
                                        <span>$1,899.97</span>
                                    </div>
                                    <div className="flex justify-between text-text-secondary">
                                        <span>Shipping</span>
                                        <span className="text-green-500">Free</span>
                                    </div>
                                    <div className="flex justify-between text-text-secondary">
                                        <span>Tax</span>
                                        <span>$152.00</span>
                                    </div>
                                </div>

                                <hr className="border-border my-4" />

                                <div className="flex justify-between text-xl font-bold text-text-primary mb-6">
                                    <span>Total</span>
                                    <span>$2,051.97</span>
                                </div>

                                <Button className="w-full" size="lg" leftIcon={<HiOutlineLockClosed />}>
                                    Place Order
                                </Button>

                                <p className="mt-4 text-center text-xs text-text-muted">
                                    By placing your order, you agree to our Terms of Service and Privacy Policy.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default CheckoutPage;
