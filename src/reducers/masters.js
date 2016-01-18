import * as mastersSelectors from '../selectors/masters';
import * as mastersTypes from '../constants/masters';

// This reducer only updates the index of masters since that depends
// on the rest of the state tree. The specifc dependent bits have been
// implemented in the selectors for masters
export default (state, action) => {
  const {index} = state.masters;

  const updateState = (newIndex) => ({
    ...state,
    masters: {...state.masters, index: newIndex}
  });

  switch (action.type) {

  case mastersTypes.GOTO_FIRST:
    return updateState(0);

  case mastersTypes.GOTO_LAST:
  case mastersTypes.FETCH_SUCCESS:
    // A successful fetch also sets the current index to the last one
    return updateState(mastersSelectors.brackets(state).length - 1);

  case mastersTypes.GOTO_NEXT:
    return updateState(Math.min(index + 1, mastersSelectors.brackets(state).length - 1));

  case mastersTypes.GOTO_PREVIOUS:
    return updateState(Math.max(0, index - 1));

  default:
    return state;
  }
};
