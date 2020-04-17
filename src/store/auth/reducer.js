import { RECEIVE_USER, RECEIVE_ADDRESS } from '../actionTypes';

//ESTADO INICIAL DO COMPONENTE
const INITIAL_STATE = {
  loaded: false,
  user: null,
};

export default function authReducer(state = INITIAL_STATE, action) {
  switch (action.type) {
    case RECEIVE_USER:
      return {
        ...state,
        user: action.payload,
      };
    case RECEIVE_ADDRESS:
      return {
        ...state,
        user: {
          ...state.user,
          adresses: [...(state.user.address || []), action.payload],
        },
      };
    default:
      return state;
  }
}
