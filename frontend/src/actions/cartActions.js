import Cookie from "js-cookie";
import { CART_ADD_ITEM, CART_REMOVE_ITEM, CART_SAVE_SHIPPING, CART_SAVE_PAYMENT } from "../constants/cartConstants";
import api from '../api';

const addToCart = (productId, qty) => async (dispatch, getState) => {
  try {
    // Validate the productId before sending the request
    if (!productId) {
      console.error('Invalid product ID');
      return;
    }
    
    const { data } = await api.get(`/api/products/${productId}`);
    if (!data) {
      console.error('No product data returned');
      return;
    }
    
    // Convert qty to a number to ensure it's the correct type
    const quantity = Number(qty);
    
    dispatch({
      type: CART_ADD_ITEM, payload: {
        product: data._id,
        name: data.name,
        image: data.image,
        price: data.price,
        countInStock: data.countInStock,
        qty: quantity
      }
    });
    
    // Get updated cart items and save to cookie
    const { cart: { cartItems } } = getState();
    Cookie.set("cartItems", JSON.stringify(cartItems));

  } catch (error) {
    console.error('Error adding to cart:', error.response?.data?.message || error.message);
  }
}
const removeFromCart = (productId) => (dispatch, getState) => {
  try {
    // Validate product ID
    if (!productId) {
      console.error('Invalid product ID for removal');
      return;
    }
    
    dispatch({ type: CART_REMOVE_ITEM, payload: productId });

    // Get updated cart items and save to cookie
    const { cart: { cartItems } } = getState();
    Cookie.set("cartItems", JSON.stringify(cartItems));
  } catch (error) {
    console.error('Error removing from cart:', error.message);
  }
}
const saveShipping = (data) => (dispatch) => {
  dispatch({ type: CART_SAVE_SHIPPING, payload: data });
}
const savePayment = (data) => (dispatch) => {
  dispatch({ type: CART_SAVE_PAYMENT, payload: data });
}
export { addToCart, removeFromCart, saveShipping, savePayment }