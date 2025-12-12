import { HiOutlineShoppingBag } from 'react-icons/hi';

const AdminOrdersPage = () => {
    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold font-heading">Orders</h1>
                    <p className="text-text-muted">Manage customer orders</p>
                </div>
            </div>

            <div className="bg-background-card border border-border rounded-2xl p-12 text-center">
                <div className="w-16 h-16 bg-background-secondary rounded-full flex items-center justify-center mx-auto mb-4 text-text-secondary">
                    <HiOutlineShoppingBag size={32} />
                </div>
                <h3 className="text-xl font-bold text-text-primary mb-2">No Orders Yet</h3>
                <p className="text-text-muted max-w-md mx-auto">
                    When customers place orders, they will appear here. You can manage order status, shipping, and more.
                </p>
            </div>
        </div>
    );
};

export default AdminOrdersPage;
