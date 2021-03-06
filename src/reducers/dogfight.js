import { omit } from 'ramda'
import { DOGFIGHT, VIEW_STRATEGIC_BOMBING_RESULTS, NEXT_TURN } from '../actions'

const dogfight = (state = {}, action) => {
  const { type, territoryIndex, targetIndex } = action
  switch (type) {
  case DOGFIGHT: 
    return { ...state, [territoryIndex]: true }
  case VIEW_STRATEGIC_BOMBING_RESULTS:
    return omit(String(targetIndex), state)
  case NEXT_TURN: 
    return {}
  default:
    return state
  }
}
export default dogfight

