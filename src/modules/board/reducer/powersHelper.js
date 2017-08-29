import { omit } from 'ramda';

const updateObject = (object, newValues) => {
  return Object.assign({}, object, newValues)
}

const updateCurrentPower = (powers, updateCallback, callbackArg) => {
  return powers.map(power => power.current ? updateCallback(power, callbackArg) : power)
}

const spendIPCs = (power, amount) => {
  return updateObject(power, { ipc: power.ipc - amount })
}

const gainIPCs = (power, amount) => {
  return updateObject(power, { ipc: power.ipc +  amount })
}

const powers = (state, action) => {
  switch (action.type) {
    case 'NEXT_TURN':
      const currentPower = state.powers.find(power => power.current)
      const nextPowerIndex = currentPower.name === 'China' ? 0 : state.indexOf(currentPower) + 1
      return state.powers.map((power, n) => {
        if(power.current) {
          return omit('current', power) 
        } else if (n === nextPowerIndex) {
          return {...power, current: true}
        } else {
          return power
        }
      })
    case 'DEVELOP_TECH':
      const assignTech = (power) => {
        return updateObject(power, { tech: power.tech.concat(action.tech) })
      }
      return updateCurrentPower(state.powers, assignTech)
    case 'ATTEMPT_RESEARCH':
      return updateCurrentPower(state.powers, spendIPCs, action.cost)
    case 'INCREMENT_PURCHASE':
      return updateCurrentPower(state.powers, spendIPCs, action.unit.cost)
    case 'DECREMENT_PURCHASE':
      return updateCurrentPower(state.powers, gainIPCs, action.unit.cost)
    default:
      return state.powers
  }
}

export default powers

