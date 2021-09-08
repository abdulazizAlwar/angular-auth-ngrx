import { User } from '../../models/user'
// import { AuthActionTypes } from '../actions/auth.actions'
import { AuthActionTypes, All } from '../actions/auth.actions';
export interface State {
  // is a user authenticated?
  isAuthenticated: boolean
  // If authenticated, there should be a user objcet
  user: User | null
  // error message
  errorMessage: string | null
}

export const initialState: State = {
  isAuthenticated: false,
  user: null,
  errorMessage: null,
}

export function reducer(state = initialState, action: All): State {
  switch (action.type) {

    case AuthActionTypes.LOGIN_SUCCESS: {
      console.table(state)
      return {
        ...state,
        isAuthenticated: true,
        user: {
          token: action.payload.token,
          email: action.payload.email,
        },
        errorMessage: null
      }
    }

    case AuthActionTypes.LOGIN_FAILURE: {
      return {
        ...state,
        errorMessage: 'Incorrect email and/or password.'
      };
    }

    default: {
      return state
    }

  }
}
