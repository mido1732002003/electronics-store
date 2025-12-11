import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { HiOutlineTrash, HiOutlineMinus, HiOutlinePlus, HiOutlineArrowRight, HiOutlineShoppingCart } from 'react-icons/hi';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { selectCartItems, selectCartSubtotal, updateItemQuantity, removeItem, clearCart } from '@/store/slices/cartSlice';
import Button from '@/components/ui/Button';
import { formatCurrency } from '@/utils/helpers';


const CartPage = () => {
    const dispatch = useAppDispatch();
    const cartItems = useAppSelector(selectCartItems);
    const reduxSubtotal = useAppSelector(selectCartSubtotal);
    const subtotal = reduxSubtotal;
    const shipping = subtotal >= 100 ? 0 : 9.99;
    const tax = subtotal * 0.08;
    const total = subtotal + shipping + tax;

    const handleQuantityChange = (id: string, newQuantity: number) => {
        dispatch(updateItemQuantity({ id, quantity: newQuantity }));
    };

    const handleRemove = (id: string) => {
        dispatch(removeItem(id));
    };

    if (cartItems.length === 0) {
        return (
            <>
                <Helmet>
                    <title>Shopping Cart - Electronics Store</title>
                </Helmet>
                <div className="min-h-[60vh] flex items-center justify-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center"
                    >
                        <HiOutlineShoppingCart className="w-24 h-24 mx-auto text-text-muted mb-6" />
                        <h1 className="text-3xl font-bold text-text-primary mb-4 font-heading">Your Cart is Empty</h1>
                        <p className="text-text-muted mb-8">Looks like you haven't added any items yet.</p>
                        <Link to="/products">
                            <Button size="lg" rightIcon={<HiOutlineArrowRight />}>Continue Shopping</Button>
                        </Link>
                    </motion.div>
                </div>
            </>
        );
    }

    return (
        <>
            <Helmet>
                <title>{`Shopping Cart (${cartItems.length}) - Electronics Store`}</title>
            </Helmet>

            <div className="bg-background min-h-screen py-12">
                <div className="container-custom">
                    <h1 className="text-3xl font-bold text-text-primary mb-8 font-heading">Shopping Cart</h1>

                    <div className="grid lg:grid-cols-3 gap-8">
                        {/* Cart Items */}
                        <div className="lg:col-span-2 space-y-4">
                            {cartItems.map((item) => (
                                <motion.div
                                    key={item.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, x: -100 }}
                                    className="bg-background-card rounded-xl p-6 flex gap-6 border border-border"
                                >
                                    <Link to={`/products/${item.productId}`} className="flex-shrink-0">
                                        <img
                                            src={item.image}
                                            alt={item.name}
                                            className="w-24 h-24 object-cover rounded-lg"
                                        />
                                    </Link>

                                    <div className="flex-1">
                                        <Link to={`/products/${item.productId}`}>
                                            <h3 className="font-medium text-text-primary hover:text-accent transition-colors">{item.name}</h3>
                                        </Link>
                                        <p className="text-accent font-semibold mt-1">{formatCurrency(item.price)}</p>

                                        <div className="flex items-center justify-between mt-4">
                                            <div className="flex items-center border border-border rounded-lg">
                                                <button
                                                    onClick={() => handleQuantityChange(item.id, Math.max(1, item.quantity - 1))}
                                                    className="p-2 hover:bg-background-secondary rounded-l-lg text-text-secondary"
                                                    disabled={item.quantity <= 1}
                                                >
                                                    <HiOutlineMinus size={16} />
                                                </button>
                                                <span className="px-4 font-medium text-text-primary">{item.quantity}</span>
                                                <button
                                                    onClick={() => handleQuantityChange(item.id, Math.min(item.maxQuantity, item.quantity + 1))}
                                                    className="p-2 hover:bg-background-secondary rounded-r-lg text-text-secondary"
                                                    disabled={item.quantity >= item.maxQuantity}
                                                >
                                                    <HiOutlinePlus size={16} />
                                                </button>
                                            </div>

                                            <button
                                                onClick={() => handleRemove(item.id)}
                                                className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg"
                                            >
                                                <HiOutlineTrash size={20} />
                                            </button>
                                        </div>
                                    </div>

                                    <div className="text-right">
                                        <p className="font-bold text-text-primary">{formatCurrency(item.price * item.quantity)}</p>
                                    </div>
                                </motion.div>
                            ))}

                            <div className="flex justify-between items-center pt-4">
                                <Link to="/products">
                                    <Button variant="ghost">← Continue Shopping</Button>
                                </Link>
                                <Button variant="outline" onClick={() => dispatch(clearCart())}>Clear Cart</Button>
                            </div>
                        </div>

                        {/* Order Summary */}
                        <div>
                            <div className="bg-background-card rounded-xl p-6 sticky top-24 border border-border">
                                <h2 className="text-xl font-bold text-text-primary mb-6">Order Summary</h2>

                                <div className="space-y-4 mb-6">
                                    <div className="flex justify-between text-text-secondary">
                                        <span>Subtotal ({cartItems.reduce((sum, i) => sum + i.quantity, 0)} items)</span>
                                        <span>{formatCurrency(subtotal)}</span>
                                    </div>
                                    <div className="flex justify-between text-text-secondary">
                                        <span>Shipping</span>
                                        <span>{shipping === 0 ? 'Free' : formatCurrency(shipping)}</span>
                                    </div>
                                    <div className="flex justify-between text-text-secondary">
                                        <span>Tax (8%)</span>
                                        <span>{formatCurrency(tax)}</span>
                                    </div>
                                    <hr className="border-border" />
                                    <div className="flex justify-between text-xl font-bold text-text-primary">
                                        <span>Total</span>
                                        <span>{formatCurrency(total)}</span>
                                    </div>
                                </div>

                                {subtotal < 100 && (
                                    <div className="bg-accent/10 text-accent p-4 rounded-lg mb-6 text-sm">
                                        Add {formatCurrency(100 - subtotal)} more to get free shipping!
                                    </div>
                                )}

                                <Link to="/checkout">
                                    <Button className="w-full" size="lg" rightIcon={<HiOutlineArrowRight />}>
                                        Proceed to Checkout
                                    </Button>
                                </Link>

                                <div className="mt-6 text-center text-sm text-text-muted">
                                    <p>🔒 Secure checkout powered by Stripe</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default CartPage;
