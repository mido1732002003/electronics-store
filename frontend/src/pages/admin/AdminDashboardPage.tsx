import { motion } from 'framer-motion';
import { HiOutlineCurrencyDollar, HiOutlineShoppingBag, HiOutlineUsers, HiOutlineCube } from 'react-icons/hi';

const AdminDashboardPage = () => {
    const stats = [
        { name: 'Total Revenue', value: '$45,231.89', change: '+20.1%', icon: HiOutlineCurrencyDollar, color: 'text-green-500', bg: 'bg-green-500/10' },
        { name: 'Active Orders', value: '23', change: '+15%', icon: HiOutlineShoppingBag, color: 'text-blue-500', bg: 'bg-blue-500/10' },
        { name: 'Total Customers', value: '2,420', change: '+5.4%', icon: HiOutlineUsers, color: 'text-purple-500', bg: 'bg-purple-500/10' },
        { name: 'Total Products', value: '48', change: '+12%', icon: HiOutlineCube, color: 'text-orange-500', bg: 'bg-orange-500/10' },
    ];

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold font-heading">Dashboard Overview</h1>
                <p className="text-text-muted">Welcome back, here's what's happening with your store today.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat) => (
                    <motion.div
                        key={stat.name}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-background-card border border-border p-6 rounded-2xl"
                    >
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-sm font-medium text-text-muted">{stat.name}</p>
                                <h3 className="text-2xl font-bold mt-2 font-heading">{stat.value}</h3>
                            </div>
                            <div className={`p-3 rounded-xl ${stat.bg} ${stat.color}`}>
                                <stat.icon size={24} />
                            </div>
                        </div>
                        <div className="mt-4 flex items-center text-sm">
                            <span className="text-green-500 font-medium">{stat.change}</span>
                            <span className="text-text-muted ml-2">from last month</span>
                        </div>
                    </motion.div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-background-card border border-border p-6 rounded-2xl">
                    <h2 className="text-lg font-bold font-heading mb-4">Recent Orders</h2>
                    <div className="h-64 flex items-center justify-center text-text-muted border-2 border-dashed border-border rounded-xl">
                        Chart Placeholder
                    </div>
                </div>
                <div className="bg-background-card border border-border p-6 rounded-2xl">
                    <h2 className="text-lg font-bold font-heading mb-4">Top Products</h2>
                    <div className="h-64 flex items-center justify-center text-text-muted border-2 border-dashed border-border rounded-xl">
                        List Placeholder
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboardPage;
