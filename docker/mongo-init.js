// MongoDB initialization script
// This script runs on first database initialization

// Switch to the main database
db = db.getSiblingDB('electronics_store');

// Create application user with read/write permissions
db.createUser({
    user: 'app_user',
    pwd: 'app_password',
    roles: [
        {
            role: 'readWrite',
            db: 'electronics_store'
        }
    ]
});

// Create indexes for better performance
// Users collection
db.users.createIndex({ email: 1 }, { unique: true });
db.users.createIndex({ role: 1 });
db.users.createIndex({ createdAt: -1 });

// Products collection
db.products.createIndex({ slug: 1 }, { unique: true });
db.products.createIndex({ sku: 1 }, { unique: true });
db.products.createIndex({ category: 1 });
db.products.createIndex({ brand: 1 });
db.products.createIndex({ status: 1 });
db.products.createIndex({ price: 1 });
db.products.createIndex({ createdAt: -1 });
db.products.createIndex({ name: 'text', description: 'text' }); // Text search

// Categories collection
db.categories.createIndex({ slug: 1 }, { unique: true });
db.categories.createIndex({ parent: 1 });
db.categories.createIndex({ order: 1 });

// Orders collection
db.orders.createIndex({ orderNumber: 1 }, { unique: true });
db.orders.createIndex({ user: 1 });
db.orders.createIndex({ status: 1 });
db.orders.createIndex({ createdAt: -1 });

// Reviews collection
db.reviews.createIndex({ product: 1, user: 1 }, { unique: true });
db.reviews.createIndex({ product: 1 });
db.reviews.createIndex({ rating: 1 });
db.reviews.createIndex({ isApproved: 1 });

// Carts collection
db.carts.createIndex({ user: 1 });
db.carts.createIndex({ sessionId: 1 });
db.carts.createIndex({ updatedAt: 1 }, { expireAfterSeconds: 604800 }); // 7 days TTL

// Coupons collection
db.coupons.createIndex({ code: 1 }, { unique: true });
db.coupons.createIndex({ expiresAt: 1 });

print('Database initialization completed successfully!');
