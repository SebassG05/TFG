import Cart from '../models/cartModel.js';
import Product from '../models/productModel.js';

export const addToCart = async (req, res) => {
    const { productId, quantity } = req.body;
    const userId = req.user._id;

    try {
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        let cart = await Cart.findOne({ userId });

        if (!cart) {
            cart = new Cart({ userId, items: [], totalPrice: 0 });
        }

        const existingItem = cart.items.find(item => item.productId.toString() === productId);

        if (existingItem) {
            existingItem.quantity += quantity;
            existingItem.price = product.price * existingItem.quantity;
        } else {
            cart.items.push({
                productId,
                quantity,
                price: product.price * quantity
            });
        }

        cart.totalPrice = cart.items.reduce((total, item) => total + item.price, 0);

        await cart.save();
        res.status(200).json(cart);
    } catch (error) {
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
