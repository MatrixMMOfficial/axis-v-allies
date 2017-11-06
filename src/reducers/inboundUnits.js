import { omit } from 'ramda'
import { COMMIT_UNITS, UNCOMMIT_UNITS, LOAD_TRANSPORT } from '../actions'

const inboundUnits = (state = {}, action) => {
  const { destinationIndex, unitIds } = action
  switch (action.type) {
  case COMMIT_UNITS: {
    let inbound = { ...state }
    unitIds.forEach(id => { inbound[id] = destinationIndex })
    return inbound 
  }
  case UNCOMMIT_UNITS: {
    return omit(unitIds.map(String), state)
  }
  case LOAD_TRANSPORT: {
    const { transport, destinationIndex, unitIds } = action
    let inbound = { ...state }
    unitIds.concat(transport.id).forEach(id => inbound[id] = destinationIndex)
    return inbound
  }
  default:
    return state
  }
}

export default inboundUnits