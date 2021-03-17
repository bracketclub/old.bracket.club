import * as types from '../constants/sse'

const initialState = {
  sse: false,
}

export default (state = initialState, action) => {
  const { type } = action

  switch (type) {
    case types.SSE_ON:
      return {
        ...state,
        sse: true,
      }

    case types.SSE_OFF:
      return {
        ...state,
        sse: false,
      }

    default:
      return state
  }
}
