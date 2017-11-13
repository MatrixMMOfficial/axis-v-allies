import { createSelector } from 'reselect'
import { combatants as combatantsWithoutDamage } from '../planCombat'
import { 
  getFocusTerritory, 
  idsToUnits, 
} from '../../selectors/getTerritory'
import { 
  attack, 
  attacks,
  defend, 
  survivors,
  withAttack, 
  withDefend 
} from '../../selectors/units'
import PATHS from '../../paths'
export { getFocusTerritory }

export const attackerCasualties = state => state.casualties

export const bombardingUnits = ({ bombardment, phase, units })=> (
  idsToUnits(bombardment.targetTerritories[phase.territoryIndex] || [], units)
)

const artillery = unit => unit.type === 'artillery'
const infantry = unit => unit.type === 'infantry'

const modify = (units) => {
  const supportable = units.filter(artillery).length
  if (supportable) {
    return [ ...units.filter(infantry).slice(0, supportable).map(u => ({ ...u, attack: 2 })),
      ...units.filter(infantry).slice(supportable).map(withAttack),
      ...units.filter(u => u.type !== 'infantry').map(withAttack)]
  } else {
    return units.map(withAttack)
  }
}

export const preCasualtyCombatants = createSelector(
  combatantsWithoutDamage,
  bombardingUnits,
  ({ attackers, defenders }, bombardingUnits) => (
    { 
      attackers: modify(attackers), 
      defenders: defenders.map(withDefend), 
      bombardingUnits: bombardingUnits.map(withAttack) 
    }
  )
)

export const combatants = createSelector(
  preCasualtyCombatants,
  attackerCasualties,
  ({ attackers, defenders, bombardingUnits }, casualties) => (
    { 
      attackers: survivors(attackers, casualties), 
      defenders, 
      bombardingUnits 
    }
  )
)

const strengthRange = ({ attackers, defenders, bombardingUnits }) => {
  const supportedAttackers = [ ...attackers, ...bombardingUnits ]
  const dieMax = Math.max(...supportedAttackers.filter(attack).map(attack), 
    ...defenders.filter(defend).map(defend))
  return Array(dieMax).fill().map((n, i) => i + 1)
}

export const strengths = createSelector(
  combatants,
  strengthRange
)
//TODO: ensure territory has continued conflict and no amphib presence
export const allowRetreat = createSelector(
  getFocusTerritory,
  combatants,
  (territory, { attackers }) => territory.continueCombat && (!territory.amphib)
)

const attacksAt = n => unit => unit.attack === n
const defendsAt = n => unit => defend(unit) === n
const totalAttacks = (total, unit) => total + attacks(unit)
const totalDefends = (total, unit) => total + 1

const arrangeRolls = (combatants, bombardingUnits, strengths, rolls = []) => {
  const { attackers, defenders } = combatants
  const supportedAttackers = [ ...modify(attackers), ...bombardingUnits ]
  let rollClone = rolls.slice(0)
  const rollsByStrength = { attackers: [], defenders: [] }
  strengths.forEach(n => {
    let attackRolls = supportedAttackers.filter(attacksAt(n)).reduce(totalAttacks, 0)
    rollsByStrength.attackers[n] = rollClone.splice(0, attackRolls)
    let defendRolls = defenders.filter(defendsAt(n)).reduce(totalDefends, 0)
    rollsByStrength.defenders[n] = rollClone.splice(0, defendRolls)
  })
  return rollsByStrength
}

export const combatRolls = createSelector(
  combatantsWithoutDamage,
  bombardingUnits,
  strengths,
  state => state.rolls[PATHS.COMBAT_ROLLS],
  (combatants, bombardingUnits, strengths, rolls) => arrangeRolls(combatants, bombardingUnits, strengths, rolls)
)

const hits = (rolls, side) => {
  return rolls[side].reduce((total, _rolls, i) => {
    return total + _rolls.filter(n => n <= i).length
  }, 0)
}

export const attackerCasualtyCount = createSelector(
  combatRolls,
  (rolls) => hits(rolls, 'defenders')
)

const byDefense = (a, b) => defend(a) - defend(b)

const _casualties = (combatants, rolls) => (
  combatants.defenders.sort(byDefense)
  .map(unit => unit.id).slice(0, hits(rolls, 'attackers'))
)

export const defenderCasualties = createSelector(
  combatantsWithoutDamage,
  combatRolls,
  (combatants, rolls) => _casualties(combatants, rolls)
)

export const rollCount = createSelector(
  combatantsWithoutDamage,
  bombardingUnits,
  ({ attackers, defenders }, bombardingUnits) => (
    attackers.concat(bombardingUnits).reduce(totalAttacks, 0)
    + defenders.reduce(totalDefends, 0)
  )
)

