import { createContext, useReducer } from 'react';

const addCartItem = (cartItems, productToAdd) => {
  const existingCartItem = cartItems.find(
    (cartItem) => cartItem.id === productToAdd.id
  );

  if (existingCartItem) {
    return cartItems.map((cartItem) =>
      cartItem.id === productToAdd.id
        ? { ...cartItem, quantity: cartItem.quantity + 1 }
        : cartItem
    );
  }

  return [...cartItems, { ...productToAdd, quantity: 1 }];
};

const removeCartItem = (cartItems, cartItemToRemove) => {
  // find the cart item to remove
  const existingCartItem = cartItems.find(
    (cartItem) => cartItem.id === cartItemToRemove.id
  );

  // check if quantity is equal to 1, if it is remove that item from the cart
  if (existingCartItem.quantity === 1) {
    return cartItems.filter((cartItem) => cartItem.id !== cartItemToRemove.id);
  }

  // return back cartitems with matching cart item with reduced quantity
  return cartItems.map((cartItem) =>
    cartItem.id === cartItemToRemove.id
      ? { ...cartItem, quantity: cartItem.quantity - 1 }
      : cartItem
  );
};

const clearCartItem = (cartItems, cartItemToClear) =>
  cartItems.filter((cartItem) => cartItem.id !== cartItemToClear.id);

export const CartContext = createContext({
  isCartOpen: false,
  setIsCartOpen: () => {},
  cartItems: [],
  addItemToCart: () => {},
  removeItemFromCart: () => {},
  clearItemFromCart: () => {},
  cartCount: 0,
  cartTotal: 0,
});

const INITIAL_STATE = {
  isCartOpen: false,
  cartItems: [],
  cartCount: 0,
  cartTotal: 0,
};

const CART_ACTION_TYPES = {
  SET_IS_CART_OPEN: 'SET_IS_CART_OPEN',
  SET_CART_ITEMS: 'SET_CART_ITEMS',
  // SET_CART_COUNT: 'SET_CART_COUNT',
  // SET_CART_TOTAL: 'SET_CART_TOTAL'
};

const getCartCountAndTotal = (cartItems) => {
  const cartTotal = cartItems.reduce(
    (total, cartItem) => total + cartItem.quantity * cartItem.price,
    0
  );

  const cartCount = cartItems.reduce(
    (total, cartItem) => total + cartItem.quantity,
    0
  );

  return { cartCount, cartTotal}
}

const cartReducer = (state, action) => {
  const { payload, type } = action;

  switch(type) {
    case CART_ACTION_TYPES.SET_IS_CART_OPEN:
      return {
        ...state,
        isCartOpen: payload
      };
    case CART_ACTION_TYPES.SET_CART_ITEMS:
      const { cartCount, cartTotal, cartItems } = payload;

      return {
        ...state,
        cartItems,
        cartCount,
        cartTotal,
      };
    default:
      throw new Error(`Unhandled type ${type} in cartReducer`);
  }
}

export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, INITIAL_STATE);

  const setIsCartOpen = (isCartOpen) => {
    dispatch({ type: CART_ACTION_TYPES.SET_IS_CART_OPEN, payload: isCartOpen});
  }

  const setCartItems = (cartItems) => {
    const { cartTotal, cartCount } = getCartCountAndTotal(cartItems);

    dispatch({
      type: CART_ACTION_TYPES.SET_CART_ITEMS,
      payload: { cartItems, cartCount, cartTotal }
    });
  }

  const {
    isCartOpen,
    cartItems,
    cartCount,
    cartTotal,
  } = state;

  const addItemToCart = (productToAdd) => {
    setCartItems(addCartItem(cartItems, productToAdd));
  };

  const removeItemToCart = (cartItemToRemove) => {
    setCartItems(removeCartItem(cartItems, cartItemToRemove));
  };

  const clearItemFromCart = (cartItemToClear) => {
    setCartItems(clearCartItem(cartItems, cartItemToClear));
  };

  const value = {
    isCartOpen,
    setIsCartOpen,
    addItemToCart,
    removeItemToCart,
    clearItemFromCart,
    cartItems,
    cartCount,
    cartTotal,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
