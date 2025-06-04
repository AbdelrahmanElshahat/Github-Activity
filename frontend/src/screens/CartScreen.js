import React, { useEffect, useState } from 'react';
import { addToCart, removeFromCart } from '../actions/cartActions';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

function CartScreen(props) {
  const [error, setError] = useState(null);
  const cart = useSelector(state => state.cart);
  const { cartItems } = cart;

  const productId = props.match.params.id;
  const qty = props.location.search ? Number(props.location.search.split("=")[1]) : 1;
  const dispatch = useDispatch();
  
  const removeFromCartHandler = (productId) => {
    try {
      dispatch(removeFromCart(productId));
    } catch (err) {
      setError('Could not remove item from cart. Please try again.');
      console.error('Error removing item:', err);
    }
  }
  
  useEffect(() => {
    if (productId) {
      try {
        dispatch(addToCart(productId, qty));
      } catch (err) {
        setError('Could not add item to cart. Please try again.');
        console.error('Error adding item:', err);
      }
    }
  }, [productId, qty, dispatch]);

  const checkoutHandler = () => {
    props.history.push("/signin?redirect=shipping");
  }

  return <div className="cart">
    {error && <div className="error-message">{error}</div>}
    <div className="cart-list">
      <ul className="cart-list-container">
        <li>
          <h3>
            Shopping Cart
          </h3>
          <div>
            Price
          </div>
        </li>
        {
          cartItems.length === 0 ?
            <div>
              Cart is empty
            </div>
            :
            cartItems.map(item =>
              <li key={item.product}>
                <div className="cart-image">
                  <img src={item.image} alt="product" />
                </div>
                <div className="cart-name">
                  <div>
                    <Link to={"/product/" + item.product}>
                      {item.name}
                    </Link>

                  </div>
                  <div>
                    Qty:
                    <select 
                      value={item.qty} 
                      onChange={(e) => {
                        try {
                          dispatch(addToCart(item.product, Number(e.target.value)));
                        } catch (err) {
                          setError('Could not update item quantity. Please try again.');
                          console.error('Error updating quantity:', err);
                        }
                      }}
                    >
                      {[...Array(item.countInStock).keys()].map(x =>
                        <option key={x + 1} value={x + 1}>{x + 1}</option>
                      )}
                    </select>
                    <button 
                      type="button" 
                      className="button" 
                      onClick={() => removeFromCartHandler(item.product)} 
                    >
                      Delete
                    </button>
                  </div>
                </div>
                <div className="cart-price">
                  ${item.price}
                </div>
              </li>
            )
        }
      </ul>
    </div>
    <div className="cart-action">
      <h3>
        Subtotal ({cartItems.reduce((a, c) => a + Number(c.qty), 0)} items)
        :
        ${cartItems.reduce((a, c) => a + Number(c.price) * Number(c.qty), 0).toFixed(2)}
      </h3>
      <button 
        onClick={checkoutHandler} 
        className="button primary full-width" 
        disabled={cartItems.length === 0}
      >
        Proceed to Checkout
      </button>
    </div>
  </div>
}

export default CartScreen;