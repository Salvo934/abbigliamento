import { createContext, useContext, useReducer } from "react";

const CartContext = createContext(null);

const cartReducer = (state, action) => {
  switch (action.type) {
    case "ADD": {
      const existing = state.find(
        (item) => item.id === action.payload.id && item.size === action.payload.size
      );
      if (existing) {
        return state.map((item) =>
          item.id === action.payload.id && item.size === action.payload.size
            ? { ...item, quantity: item.quantity + (action.payload.quantity || 1) }
            : item
        );
      }
      return [...state, { ...action.payload, quantity: action.payload.quantity || 1 }];
    }
    case "REMOVE":
      return state.filter(
        (item) => !(item.id === action.payload.id && item.size === action.payload.size)
      );
    case "UPDATE_QUANTITY": {
      if (action.payload.quantity <= 0) {
        return state.filter(
          (item) =>
            !(item.id === action.payload.id && item.size === action.payload.size)
        );
      }
      return state.map((item) =>
        item.id === action.payload.id && item.size === action.payload.size
          ? { ...item, quantity: action.payload.quantity }
          : item
      );
    }
    case "CLEAR":
      return [];
    default:
      return state;
  }
};

export function CartProvider({ children }) {
  const [cart, dispatch] = useReducer(cartReducer, []);

  const addToCart = (product, size, quantity = 1) => {
    dispatch({
      type: "ADD",
      payload: { ...product, size, quantity },
    });
  };

  const removeFromCart = (id, size) => {
    dispatch({ type: "REMOVE", payload: { id, size } });
  };

  const updateQuantity = (id, size, quantity) => {
    dispatch({ type: "UPDATE_QUANTITY", payload: { id, size, quantity } });
  };

  const clearCart = () => dispatch({ type: "CLEAR" });

  const cartTotal = cart.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );
  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartTotal,
        cartCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
