import Cart from '../models/cartModel.js';
import Product from '../models/productModel.js';

export const addToCart = async (req, res) => {
    const { productId, quantity } = req.body;
    const userId = req.user._id;

    try {
        console.log('[addToCart] userId:', userId, '| productId:', productId, '| quantity:', quantity);
        const product = await Product.findById(productId);
        if (!product) {
            console.log('[addToCart] Product not found:', productId);
            return res.status(404).json({ message: 'Product not found' });
        }

        let cart = await Cart.findOne({ userId });
        if (!cart) {
            console.log('[addToCart] No cart found for user, creating new cart');
            cart = new Cart({ userId, items: [], totalPrice: 0 });
        } else {
            console.log('[addToCart] Existing cart found:', cart._id);
        }

        const existingItem = cart.items.find(item => item.productId.toString() === productId);

        if (existingItem) {
            existingItem.quantity += quantity;
            existingItem.price = product.price * existingItem.quantity;
            console.log('[addToCart] Updated existing item:', existingItem);
        } else {
            cart.items.push({
                productId,
                quantity,
                price: product.price * quantity
            });
            console.log('[addToCart] Added new item to cart:', productId);
        }

        cart.totalPrice = cart.items.reduce((total, item) => total + item.price, 0);
        console.log('[addToCart] Cart total price:', cart.totalPrice);

        await cart.save();
        console.log('[addToCart] Cart saved:', cart._id);
        res.status(200).json(cart);
    } catch (error) {
        console.error('[addToCart] Error:', error);
        res.status(400).json({ message: error.message });
    }
};

export const removeFromCart = async (req, res) => {
    const { productId } = req.params;
    const userId = req.user._id;

    try {
        let cart = await Cart.findOne({ userId });

        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        const itemIndex = cart.items.findIndex(item => item.productId.toString() === productId);

        if (itemIndex === -1) {
            return res.status(404).json({ message: 'Product not found in cart' });
        }

        // ❌ Eliminar el producto del array
        cart.items.splice(itemIndex, 1);
        
        // 🔄 Recalcular el total
        cart.totalPrice = cart.items.reduce((total, item) => total + item.price, 0);

        console.log("Items después de eliminar:", cart.items); // Debug
        console.log("TotalPrice después de eliminar:", cart.totalPrice); // Debug

        // 🛑 Si no quedan productos en el carrito, eliminarlo
        if (cart.items.length === 0) {
            console.log("El carrito está vacío. Eliminando...");
            await Cart.findByIdAndDelete(cart._id);  // Forzar eliminación
            return res.status(200).json({ message: 'Cart deleted successfully' });
        }

        // Si aún tiene productos, lo guardamos
        await cart.save();
        res.status(200).json(cart);
    } catch (error) {
        console.error("Error en removeFromCart:", error);
        res.status(500).json({ message: error.message });
    }
};

export const getCart = async (req, res) => {
    const userId = req.user._id;
    try {
        const cart = await Cart.findOne({ userId }).populate('items.productId');
        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }
        res.status(200).json(cart);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const clearCart = async (req, res) => {
    const userId = req.user._id;
    try {
        const cart = await Cart.findOne({ userId });
        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }
        await Cart.findByIdAndDelete(cart._id);
        res.status(200).json({ message: 'Cart cleared successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
