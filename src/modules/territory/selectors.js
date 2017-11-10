import { createSelector } from 'reselect'
import classNames from 'classnames'
import { getCurrentPowerName } from '../../selectors/getCurrentPower'
import { 
  amphibOrigins,
  getTerritory, 
  getTerritoryData, 
  getTerritoryUnits, 
  getMovedUnitIds,
  getUnits,
  isFriendly,
  isEnemy 
} from '../../selectors/getTerritory'
import { air, canBombard, getAllUnits } from '../../selectors/units'
import { nonIndustry, airComplete } from '../../lib/unit'
import { allyOf, enemyOf } from '../../config/initialPowers'
import { RESOLVE_COMBAT, ORDER_UNITS, LAND_PLANES } from '../../actions'

export const getFill = createSelector(
  getTerritory,
  getTerritoryData,
  ({ currentPower }, { sea, original_power }) => {
    if (sea && original_power !== 'Oceans') {
      if (original_power === currentPower){
        return `url(#${original_power.toLowerCase()}_convoy)`
      } else {
        return 'none' //TODO: Needs to be convoy in distress image
      }
    } else {
      return 'none'
    }
  }
)

const snakeCase = name => name.toLowerCase().replace(/\s/,'_')

export const getTerritoryId = createSelector(
  getTerritoryData,
  ({ adjacentIndexes, name }) => adjacentIndexes ? null : snakeCase(name)
)
      
export const getTerritoryDimensions = createSelector(
  getTerritoryData,
  ({ dimensions }) => dimensions
)

const isConvoy = (sea, territoryPower) => (
  sea && territoryPower !== 'Oceans'
)

const hasAirComplete = (units = []) => (
  units.filter(airComplete).length
)

export const isOrdering = (phase, currentPowerName, territoryPower, units) => (
  phase === ORDER_UNITS && 
  ((currentPowerName === territoryPower && 
    units.filter(nonIndustry).length > 1) || 
  (territoryPower === 'Oceans' && units &&
    units.filter(u => u.power === currentPowerName)
         .filter(nonIndustry).length > 1
  ))
)

//TODO: active class shouldn't apply to land-planes spaces until that phase
export const getClasses = createSelector(
  getCurrentPowerName,
  getTerritory,
  getTerritoryData,
  getMovedUnitIds,
  state => state.phase.current,
  (state, index) => index,
  (currentPower, territory, { sea }, movedUnitIds, phase, territoryIndex) => {
    const territoryPower = territory.currentPower || ''
    const isOcean = sea && territoryPower === 'Oceans' 
    const isControlled = !sea && territoryPower.length
    return classNames({
      convoy: isConvoy(sea, territoryPower),
      [territoryPower.toLowerCase()]: isOcean || isControlled,
      active: (movedUnitIds[territoryIndex] || []).length && phase !== RESOLVE_COMBAT,
      //active: (hasAirComplete(units) && phase === LAND_PLANES) || (units.length && phase !== RESOLVE_COMBAT),
      //'active-combat': unitsFrom.length && phase === RESOLVE_COMBAT && territoryPower !== currentPowerName,
      //'active-order-units': isOrdering(phase, currentPower, territoryPower, units)
    })
  }
)

const isChina = ({ name }, original_power) => (
  original_power === 'China' || 
  ['Hong Kong', 'Shantung', 'Shansi', 'Peking', 'Chahar', 'Northern Manchuria', 'Manchuria', 'Korea', 'Burma'].includes(name)
)

export const isAttackable = createSelector(
  getCurrentPowerName,
  getTerritoryData,
  getTerritory,
  getAllUnits,
  (currentPower, { original_power, sea }, territory, units) => {
    const unfriendly = !isFriendly(territory, currentPower, units) 
                       || territory.newlyConquered
    if (currentPower === 'China') {
      return isChina(territory, original_power) && unfriendly
    } else {
      return sea || unfriendly
    }
  }
)

export const isCombat = createSelector(
  getCurrentPowerName,
  getUnits,
  (currentPower, units) => units.some(allyOf(currentPower)) && units.some(enemyOf(currentPower))
  // check to see if combat goes on
  //(territory.unitsFrom.length && territory.units.length) || isAmphib(territory)
)

export const awaitingNavalResolution = (state, territoryIndex) => {
  const { amphib, inboundUnits } = state
  return amphibOrigins(amphib, inboundUnits, territoryIndex).some(index => isCombat(state, index))
}

const getAirUnits = createSelector(
  getUnits,
  units => units.filter(air)
)

export const isDogfightable = createSelector(
  getCurrentPowerName,
  getAirUnits,
  (currentPower, units) => units.some(allyOf(currentPower)) && units.some(enemyOf(currentPower))
)

export const isBombed = createSelector(
  state => state.strategicBombing.targetTerritories,
  (territories, territoryIndex) => (territories[territoryIndex] || []).length
)

export const isBombardable = (state, territoryIndex) => {
  const { amphib, inboundUnits } = state
  return amphibOrigins(amphib, inboundUnits, territoryIndex)
    .map(index => getUnits(state, index))
    .some(units => units.some(canBombard))
}
