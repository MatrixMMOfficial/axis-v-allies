import { 
  INCREMENT_PURCHASE, 
  DECREMENT_PURCHASE, 
  NEXT_TURN 
} from '../../actions';
  
const origin = {}

const purchases = (state = origin, action) => {
  switch (action.type) {
    case INCREMENT_PURCHASE: {
      const unitName = action.unit.name
      if (state[unitName]) {
        return { ...state, [unitName]: state[unitName] + 1}
      } else {
        return { ...state, [unitName]: 1 }
      }
    }
    case DECREMENT_PURCHASE: {
      const unitName = action.unit.name
      return { ...state, [unitName]: state[unitName] - 1 }
    }
    case NEXT_TURN:
      return origin
    default:
      return state
  }
}
export default purchases
