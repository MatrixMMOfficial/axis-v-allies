import { createSelector } from 'reselect';
import { getCurrentPower } from '../../selectors/getCurrentPower';
import { mergeBoardAndTerritories, getFocusTerritory } from '../../selectors/mergeBoardAndTerritories';
import { territoriesInRange } from '../planCombat';
import { nonNeutral, isLand } from '../../lib/territory';
import { airComplete, flightRange } from '../../lib/unit';
export { getFocusTerritory }

const territoryAir = (units = []) => (
  units.filter(airComplete)
)

export const airUnits = createSelector(
  getFocusTerritory,
  territory => territoryAir(territory.units).map(u => ({ ...u, options: `${u.name}-${u.originName}` }))
)

export const landingOptions = createSelector(
  mergeBoardAndTerritories,
  getCurrentPower,
  getFocusTerritory,
  airUnits,
  (board, currentPower, territory, airUnits) => landingOptionsByUnit(board, currentPower, territory, airUnits)
)

export const selectedOptions = createSelector(
  state => state.landPlanes,
  getFocusTerritory,
  (landPlanes, territory) => landPlanes[territory.index] || {}
)

const availableForLanding = (currentPower) => (territory) => (
  isLand(territory) && !territory.newlyConquered && territory.currentPower === currentPower.name
)

const landingOptionsByUnit = (board, currentPower, territory, airUnits) => {
  let landingOptions = {};
  airUnits.forEach(unit => {
    const range = flightRange(unit)
    const territories = Object.values(territoriesInRange(board, currentPower, territory, nonNeutral, range)).reduce((all, elm) => [...all, ...elm], [])
    landingOptions[`${unit.name}-${unit.originName}`] = territories.filter(availableForLanding(currentPower))
  })
  return landingOptions;
}

export const planesInAir = state => (
  state.board.territories.filter(t => territoryAir(t.units).length).length
)

export const allLandingsPlanned = state => (
  planesInAir(state) === Object.keys(state.landPlanes).length
)
