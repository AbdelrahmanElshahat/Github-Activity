import {
  PRODUCT_LIST_REQUEST,
  PRODUCT_LIST_SUCCESS,
  PRODUCT_LIST_FAIL,
  PRODUCT_DETAILS_REQUEST,
  PRODUCT_DETAILS_SUCCESS,
  PRODUCT_DETAILS_FAIL,
  PRODUCT_SAVE_REQUEST,
  PRODUCT_SAVE_SUCCESS,
  PRODUCT_SAVE_FAIL,
  PRODUCT_DELETE_SUCCESS,
  PRODUCT_DELETE_FAIL,
  PRODUCT_DELETE_REQUEST,
  PRODUCT_REVIEW_SAVE_REQUEST,
  PRODUCT_REVIEW_SAVE_FAIL,
  PRODUCT_REVIEW_SAVE_SUCCESS,
} from '../constants/productConstants';
import api from '../api';

const listProducts = (
  category = '',
  searchKeyword = '',
  sortOrder = ''
) => async (dispatch) => {
  try {
    dispatch({ type: PRODUCT_LIST_REQUEST });
    
    const { data } = await api.get(
      `/api/products?category=${encodeURIComponent(category)}&searchKeyword=${encodeURIComponent(searchKeyword)}&sortOrder=${encodeURIComponent(sortOrder)}`
    );
    
    dispatch({ type: PRODUCT_LIST_SUCCESS, payload: data });
  } catch (error) {
    dispatch({ 
      type: PRODUCT_LIST_FAIL, 
      payload: error.response && error.response.data.message
        ? error.response.data.message
        : error.message 
    });
  }
};

const saveProduct = (product) => async (dispatch, getState) => {
  try {
    // Validate product data
    if (!product) {
      throw new Error('Product data is required');
    }
    
    dispatch({ type: PRODUCT_SAVE_REQUEST, payload: product });
    
    const {
      userSignin: { userInfo },
    } = getState();
    
    if (!userInfo || !userInfo.token) {
      throw new Error('You must be logged in to perform this action');
    }
    
    let data;
    const headers = {
      headers: {
        Authorization: 'Bearer ' + userInfo.token,
      },
    };
    
    if (!product._id) {
      // Create new product
      const response = await api.post('/api/products', product, headers);
      data = response.data;
    } else {
      // Update existing product
      const response = await api.put(`/api/products/${product._id}`, product, headers);
      data = response.data;
    }
    
    dispatch({ type: PRODUCT_SAVE_SUCCESS, payload: data });
    return data;
  } catch (error) {
    dispatch({ 
      type: PRODUCT_SAVE_FAIL, 
      payload: error.response && error.response.data.message
        ? error.response.data.message
        : error.message 
    });
    throw error;
  }
};

const detailsProduct = (productId) => async (dispatch) => {
  try {
    dispatch({ type: PRODUCT_DETAILS_REQUEST, payload: productId });
    
    // Validate product ID
    if (!productId) {
      throw new Error('Invalid product ID');
    }
    
    const { data } = await api.get(`/api/products/${productId}`);
    dispatch({ type: PRODUCT_DETAILS_SUCCESS, payload: data });
  } catch (error) {
    dispatch({ 
      type: PRODUCT_DETAILS_FAIL, 
      payload: error.response && error.response.data.message
        ? error.response.data.message
        : error.message 
    });
  }
};

const deleteProdcut = (productId) => async (dispatch, getState) => {
  try {
    const {
      userSignin: { userInfo },
    } = getState();
    
    dispatch({ type: PRODUCT_DELETE_REQUEST, payload: productId });
    
    // Validate product ID
    if (!productId) {
      throw new Error('Invalid product ID');
    }
    
    const { data } = await api.delete(`/api/products/${productId}`, {
      headers: {
        Authorization: 'Bearer ' + userInfo.token,
      },
    });
    
    dispatch({ type: PRODUCT_DELETE_SUCCESS, payload: data, success: true });
  } catch (error) {
    dispatch({ 
      type: PRODUCT_DELETE_FAIL, 
      payload: error.response && error.response.data.message
        ? error.response.data.message
        : error.message 
    });
  }
};

const saveProductReview = (productId, review) => async (dispatch, getState) => {
  try {
    const {
      userSignin: {
        userInfo: { token },
      },
    } = getState();
    
    // Validate inputs
    if (!productId) {
      throw new Error('Invalid product ID');
    }
    if (!review) {
      throw new Error('Review data is required');
    }
    
    dispatch({ type: PRODUCT_REVIEW_SAVE_REQUEST, payload: review });
    
    const { data } = await api.post(
      `/api/products/${productId}/reviews`,
      review,
      {
        headers: {
          Authorization: 'Bearer ' + token,
        },
      }
    );
    
    dispatch({ type: PRODUCT_REVIEW_SAVE_SUCCESS, payload: data });
  } catch (error) {
    dispatch({ 
      type: PRODUCT_REVIEW_SAVE_FAIL, 
      payload: error.response && error.response.data.message
        ? error.response.data.message
        : error.message 
    });
  }
};

export {
  listProducts,
  detailsProduct,
  saveProduct,
  deleteProdcut,
  saveProductReview,
};
