import { Fragment, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { useForm } from 'react-hook-form';
import { HiOutlineX, HiOutlineUpload } from 'react-icons/hi';
import { toast } from 'react-hot-toast';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@services/api';

interface ProductModalProps {
    isOpen: boolean;
    onClose: () => void;
    product?: any; // To be typed properly later
}

interface Category {
    id: string; // or _id
    _id: string;
    name: string;
}

export default function ProductModal({ isOpen, onClose, product }: ProductModalProps) {
    const queryClient = useQueryClient();
    const { register, handleSubmit, reset, formState: { errors } } = useForm();

    // Fetch Categories
    const { data: categories } = useQuery<Category[]>({
        queryKey: ['categories'],
        queryFn: async () => {
            const res = await api.get('/categories');
            // Check structure: usually res.data.data.categories or res.data
            return res.data.data?.categories || res.data || [];
        }
    });

    useEffect(() => {
        if (product) {
            reset(product);
        } else {
            reset({});
        }
    }, [product, reset, isOpen]);

    const mutation = useMutation({
        mutationFn: async (data: any) => {
            // Transform data to match strict backend schema
            const payload = {
                ...data,
                // Required Arabic fields - copying English for now
                nameAr: data.name,
                descriptionAr: data.description,
                shortDescription: data.description.substring(0, 100),
                shortDescriptionAr: data.description.substring(0, 100),
                // Required SKU - generate if missing
                sku: data.sku || `SKU-${Date.now()}`,
                // Required Image format
                images: [{
                    url: data.imageUrl || 'https://via.placeholder.com/300',
                    publicId: `temp-${Date.now()}`,
                    alt: data.name,
                    isPrimary: true
                }],
                // Ensure numbers
                price: Number(data.price),
                quantity: Number(data.quantity),
                stock: Number(data.quantity), // map quantity to stock? Schema has 'quantity' and 'lowStockThreshold' but interface in Page had 'stock'? Schema has 'quantity'.
                // Category needs to be ID
                category: data.categoryId,
            };

            if (product) {
                return api.put(`/products/${product._id}`, payload);
            }
            return api.post('/products', payload);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['products'] });
            toast.success(product ? 'Product updated' : 'Product created');
            reset();
            onClose();
        },
        onError: (err: any) => {
            console.error(err);
            toast.error(err.response?.data?.message || 'Failed to save product');
        }
    });

    const onSubmit = (data: any) => {
        mutation.mutate(data);
    };

    return (
        <Transition appear show={isOpen} as={Fragment}>
            <Dialog as="div" className="relative z-50" onClose={onClose}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
                </Transition.Child>

                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4 text-center">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-background-card border border-border p-6 text-left align-middle shadow-xl transition-all">
                                <div className="flex justify-between items-center mb-6">
                                    <Dialog.Title as="h3" className="text-xl font-bold font-heading text-text-primary">
                                        {product ? 'Edit Product' : 'Add New Product'}
                                    </Dialog.Title>
                                    <button onClick={onClose} className="text-text-secondary hover:text-text-primary">
                                        <HiOutlineX size={24} />
                                    </button>
                                </div>

                                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-text-secondary mb-1">Product Name</label>
                                            <input
                                                type="text"
                                                {...register('name', { required: 'Name is required' })}
                                                className="w-full bg-background-secondary border-none rounded-xl px-4 py-2 focus:ring-2 focus:ring-accent/50"
                                                placeholder="e.g. Wireless Headphones"
                                            />
                                            {errors.name && <span className="text-red-500 text-xs">{String(errors.name.message)}</span>}
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-text-secondary mb-1">Price ($)</label>
                                            <input
                                                type="number"
                                                step="0.01"
                                                {...register('price', { required: 'Price is required' })}
                                                className="w-full bg-background-secondary border-none rounded-xl px-4 py-2 focus:ring-2 focus:ring-accent/50"
                                                placeholder="0.00"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-text-secondary mb-1">Category</label>
                                            <select
                                                {...register('categoryId', { required: 'Category is required' })}
                                                className="w-full bg-background-secondary border-none rounded-xl px-4 py-2 focus:ring-2 focus:ring-accent/50"
                                            >
                                                <option value="">Select Category</option>
                                                {categories?.map((cat) => (
                                                    <option key={cat._id || cat.id} value={cat._id || cat.id}>
                                                        {cat.name}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-text-secondary mb-1">Stock Quantity</label>
                                            <input
                                                type="number"
                                                {...register('quantity', { required: 'Quantity is required', min: 0 })}
                                                className="w-full bg-background-secondary border-none rounded-xl px-4 py-2 focus:ring-2 focus:ring-accent/50"
                                                placeholder="0"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-text-secondary mb-1">Description</label>
                                        <textarea
                                            rows={4}
                                            {...register('description', { required: 'Description is required' })}
                                            className="w-full bg-background-secondary border-none rounded-xl px-4 py-2 focus:ring-2 focus:ring-accent/50"
                                            placeholder="Product description..."
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-text-secondary mb-1">Image URL</label>
                                        <div className="flex gap-2">
                                            <input
                                                type="url"
                                                {...register('imageUrl')}
                                                className="w-full bg-background-secondary border-none rounded-xl px-4 py-2 focus:ring-2 focus:ring-accent/50"
                                                placeholder="https://..."
                                            />
                                            <div className="p-2 bg-background-secondary rounded-xl flex items-center justify-center text-text-secondary">
                                                <HiOutlineUpload size={20} />
                                            </div>
                                        </div>
                                        <p className="text-xs text-text-muted mt-1">Provide a direct link to an image.</p>
                                    </div>

                                    <div className="flex justify-end gap-3 pt-4 border-t border-border">
                                        <button
                                            type="button"
                                            onClick={onClose}
                                            className="px-4 py-2 rounded-xl text-text-secondary hover:bg-background-secondary transition-colors"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={mutation.isPending}
                                            className="px-6 py-2 rounded-xl bg-accent text-white font-medium hover:bg-accent-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {mutation.isPending ? 'Saving...' : (product ? 'Update Product' : 'Create Product')}
                                        </button>
                                    </div>
                                </form>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
}
