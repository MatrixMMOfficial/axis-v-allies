import { actionTypes } from 'react-redux-firebase'
import { NEXT_TURN } from '../actions'

const currentPowerIndex = (state = 0, action) => {
  if (action.type === NEXT_TURN) {
    return (state + 1) % 7
  } else if (action.type === actionTypes.SET && action.path === 'currentPowerIndex') {
    return action.data
  } else {
    return state
  }
}

export default currentPowerIndex
