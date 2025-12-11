import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { HiOutlinePlus, HiOutlinePencil, HiOutlineTrash, HiOutlineSearch, HiOutlineFilter } from 'react-icons/hi';
import api from '@services/api';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import toast from 'react-hot-toast';
import ProductModal from '@/components/admin/ProductModal';

interface Product {
    _id: string;
    name: string;
    price: number;
    category: { name: string } | string; // Adjust for populated vs unpopulated
    brand: { name: string } | string;
    stock: number;
    images: { url: string }[];
    quantity?: number; // Backend schema consistency
}

const AdminProductsPage = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<Product | undefined>(undefined);
    const queryClient = useQueryClient();

    const { data, isLoading } = useQuery({
        queryKey: ['products', 'admin'],
        queryFn: async () => {
            const response = await api.get('/products?limit=100'); // Get all products for admin
            return response.data.data.products;
        },
    });

    const deleteMutation = useMutation({
        mutationFn: async (id: string) => {
            await api.delete(`/products/${id}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['products'] });
            toast.success('Product deleted successfully');
        },
        onError: () => {
            toast.error('Failed to delete product');
        }
    });

    const handleDelete = async (id: string) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            deleteMutation.mutate(id);
        }
    };

    const handleEdit = (product: Product) => {
        setSelectedProduct(product);
        setIsModalOpen(true);
    };

    const handleAdd = () => {
        setSelectedProduct(undefined);
        setIsModalOpen(true);
    };

    const filteredProducts = data?.filter((product: Product) =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (typeof product.category === 'object' && product.category.name.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    if (isLoading) return <LoadingSpinner size="lg" />;

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold font-heading">Products</h1>
                    <p className="text-text-muted">Manage your store's inventory</p>
                </div>
                <button
                    className="btn btn-primary flex items-center gap-2"
                    onClick={handleAdd}
                >
                    <HiOutlinePlus size={20} />
                    Add Product
                </button>
            </div>

            <div className="bg-background-card border border-border rounded-2xl overflow-hidden">
                <div className="p-4 border-b border-border flex gap-4">
                    <div className="relative flex-1">
                        <HiOutlineSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={20} />
                        <input
                            type="text"
                            placeholder="Search products..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-background-secondary border-none rounded-xl pl-10 pr-4 py-2 focus:ring-2 focus:ring-accent/50"
                        />
                    </div>
                    <button className="p-2 text-text-secondary hover:text-primary bg-background-secondary rounded-xl">
                        <HiOutlineFilter size={20} />
                    </button>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-background-secondary/50">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">Product</th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">Category</th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">Price</th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">Stock</th>
                                <th className="px-6 py-4 text-right text-xs font-medium text-text-secondary uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {filteredProducts?.map((product: Product) => (
                                <tr key={product._id} className="hover:bg-background-secondary/30 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-lg bg-background-secondary overflow-hidden">
                                                <img
                                                    src={product.images?.[0]?.url || 'https://via.placeholder.com/150'}
                                                    alt={product.name}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                            <div>
                                                <div className="font-medium text-text-primary">{product.name}</div>
                                                <div className="text-sm text-text-muted">
                                                    {typeof product.brand === 'object' ? product.brand.name : 'Unknown Brand'}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-accent/10 text-accent">
                                            {typeof product.category === 'object' ? product.category.name : 'Uncategorized'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-text-primary font-medium">
                                        ${product.price.toFixed(2)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-text-secondary">
                                        {product.quantity || product.stock || 0} units
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button
                                                onClick={() => handleEdit(product)}
                                                className="p-2 text-blue-400 hover:bg-blue-500/10 rounded-lg transition-colors"
                                            >
                                                <HiOutlinePencil size={18} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(product._id)}
                                                className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                                            >
                                                <HiOutlineTrash size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <ProductModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                product={selectedProduct}
            />
        </div>
    );
};

export default AdminProductsPage;
