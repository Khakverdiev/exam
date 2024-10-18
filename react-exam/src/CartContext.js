import React, { createContext, useContext, useState, useEffect, useMemo } from "react";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState(() => {
        const savedCart = localStorage.getItem("cart");
        return savedCart ? JSON.parse(savedCart) : [];
    });

    useEffect(() => {
        localStorage.setItem("cart", JSON.stringify(cartItems));
    }, [cartItems]);

    const addItemToCart = (product) => {
        setCartItems((prevCartItems) => {
            const existingItem = prevCartItems.find(item => item.productId === product.productId);
            if (existingItem) {
                return prevCartItems.map(item =>
                    item.productId === product.productId
                        ? { ...item, quantity: item.quantity + product.quantity }
                        : item
                );
            }
            return [...prevCartItems, { 
                productId: product.productId, 
                name: product.name, 
                price: product.price, 
                imageUrl: product.imageUrl, 
                quantity: product.quantity
              }];
        });
    };

    const removeItemFromCart = (productId) => {
        setCartItems((prevCartItems) => prevCartItems.filter(item => item.productId !== productId));
    };

    const clearCart = () => {
        setCartItems([]);
    };

    const value = useMemo(() => ({
        cartItems,
        addItemToCart,
        removeItemFromCart,
        clearCart,
    }), [cartItems]);

    return (
        <CartContext.Provider value={value}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => useContext(CartContext);