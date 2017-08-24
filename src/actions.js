const PLAN_COMBAT = 'PLAN_COMBAT';
const PLAN_LAND_PLANES = 'PLAN_LAND_PLANES';
const RESOLVE_COMBAT = 'RESOLVE_COMBAT';
const TOGGLE_CASUALTY = 'TOGGLE_CASUALTY';
const REMOVE_CASUALTIES = 'REMOVE_CASUALTIES';
const ROLLS = 'ROLLS';
const COMMIT_UNITS = 'COMMIT_UNITS';
const UNCOMMIT_UNITS = 'UNCOMMIT_UNITS';
const COMMIT_AMPHIB_UNITS = 'COMMIT_AMPHIB_UNITS';
const UNCOMMIT_AMPHIB_UNITS = 'UNCOMMIT_AMPHIB_UNITS';
const VIEW_TRANSPORT_LOAD_OPTIONS = 'VIEW_TRANSPORT_LOAD_OPTIONS';
const LOAD_TRANSPORT = 'LOAD_TRANSPORT';
const PLAN_ATTACK = 'PLAN_ATTACK';
const WIN_ATTACK = 'WIN_ATTACK';
const LOSE_ATTACK = 'LOSE_ATTACK';
const PLAN_MOVEMENT = 'PLAN_MOVEMENT';

export const resolveCombat = (territory) => {
  return { type: RESOLVE_COMBAT, territory }
}

const removeCasualties = (defenderCasualties, territoryIndex, currentPower) => {
  return {
    type: REMOVE_CASUALTIES,
    defenderCasualties,
    territoryIndex,
    currentPower
  }
}

const roll = (phase, rolls) => {
  return {
    type: ROLLS,
    phase,
    rolls
  }
}

const planAttack = (territory) => {
  return {
    type: PLAN_ATTACK,
    territory
  }
}

const planLandPlanes = (territory) => {
  return {
    type: PLAN_LAND_PLANES,
    territory
  }
}

const winAttack = (territoryIndex, currentPower) => {
  return { 
    type: WIN_ATTACK, 
    territoryIndex,
    currentPower
  }
}

const planMovement = (territory) => {
  return {
    type: PLAN_MOVEMENT,
    territory
  }
}

export {
  PLAN_ATTACK,
  PLAN_COMBAT,
  PLAN_LAND_PLANES,
  RESOLVE_COMBAT,
  TOGGLE_CASUALTY,
  REMOVE_CASUALTIES,
  ROLLS,
  COMMIT_UNITS,
  UNCOMMIT_UNITS,
  COMMIT_AMPHIB_UNITS,
  UNCOMMIT_AMPHIB_UNITS,
  VIEW_TRANSPORT_LOAD_OPTIONS,
  LOAD_TRANSPORT,
  WIN_ATTACK,
  LOSE_ATTACK,
  roll,
  removeCasualties,
  planAttack,
  winAttack,
  planMovement,
  planLandPlanes
}
