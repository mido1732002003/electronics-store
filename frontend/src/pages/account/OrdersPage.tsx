import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { formatCurrency, formatDate } from '@/utils/helpers';

const mockOrders = [
    { id: '1', orderNumber: 'ORD-2024-001', date: '2024-01-15', status: 'delivered', total: 1549.98, items: 2 },
    { id: '2', orderNumber: 'ORD-2024-002', date: '2024-01-20', status: 'shipped', total: 349.99, items: 1 },
    { id: '3', orderNumber: 'ORD-2024-003', date: '2024-01-25', status: 'processing', total: 2499.99, items: 1 },
];

const statusColors: Record<string, string> = {
    pending: 'bg-yellow-500/20 text-yellow-400',
    processing: 'bg-blue-500/20 text-blue-400',
    shipped: 'bg-purple-500/20 text-purple-400',
    delivered: 'bg-green-500/20 text-green-400',
    cancelled: 'bg-red-500/20 text-red-400',
};

const OrdersPage = () => {
    return (
        <>
            <Helmet>
                <title>My Orders - Electronics Store</title>
            </Helmet>

            <div className="bg-background min-h-screen py-12">
                <div className="container-custom max-w-4xl">
                    <h1 className="text-3xl font-bold text-text-primary mb-8 font-heading">My Orders</h1>

                    <div className="space-y-4">
                        {mockOrders.map((order, index) => (
                            <motion.div
                                key={order.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="bg-background-card border border-border rounded-xl p-6"
                            >
                                <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                                    <div>
                                        <h3 className="font-bold text-text-primary">{order.orderNumber}</h3>
                                        <p className="text-sm text-text-muted">{formatDate(order.date)}</p>
                                    </div>
                                    <span className={`px-3 py-1 rounded-full text-sm font-medium capitalize ${statusColors[order.status]}`}>
                                        {order.status}
                                    </span>
                                </div>

                                <div className="flex items-center justify-between">
                                    <div className="text-text-secondary">
                                        {order.items} item{order.items > 1 ? 's' : ''} • {formatCurrency(order.total)}
                                    </div>
                                    <Link to={`/account/orders/${order.orderNumber}`} className="text-accent hover:text-accent-400 font-medium">
                                        View Details →
                                    </Link>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {mockOrders.length === 0 && (
                        <div className="text-center py-12">
                            <p className="text-text-muted">You haven't placed any orders yet.</p>
                            <Link to="/products" className="text-accent font-medium mt-2 inline-block">
                                Start Shopping →
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default OrdersPage;
