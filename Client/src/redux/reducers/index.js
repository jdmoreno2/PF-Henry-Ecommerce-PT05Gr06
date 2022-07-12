import {
  GET_PRODUCTS,
  PRODUCT_DETAIL,
  GET_PRODUCTS_FILTER,
  POST_REVIEW,
  NEW_CATEGORY,
  GET_CATEGORIES,
  CHANGE_ORDER,
  NEW_PRODUCT,
  GET_PRODUCT,
} from "../types";

const initialState = {
  products: [],
  detail: {},
  resultPost: {},
  categories: [],
  order: {
    type: "",
    by: "",
  },
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_PRODUCTS: {
      return {
        ...state,
        products: action.payload,
      };
    }

    case PRODUCT_DETAIL: {
      return {
        ...state,
        detail: action.payload,
      };
    }

    case CHANGE_ORDER: {
      return {
        ...state,
        order: {
          type: action.payload.type,
          by: action.payload.by,
        },
      };
    }

    case GET_PRODUCTS_FILTER: {
      return {
        ...state,
        products: action.payload,
      };
    }

    case POST_REVIEW: {
      return {
        ...state,
        resultPost: action.payload,
      };
    }
    case GET_CATEGORIES:
    case NEW_CATEGORY: {
      return {
        ...state,
        categories: action.payload,
      };
    }

    case NEW_PRODUCT: {
      return {
        ...state,
        detail: action.payload,
      };
    }

    case GET_PRODUCT: {
      return {
        ...state,
        product: action.payload,
      };
    }

    default:
      return state;
  }
};

export default reducer;
