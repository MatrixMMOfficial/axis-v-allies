import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { push } from 'connected-react-router'
import CombatModal from './CombatModal'
import { combatants } from '../planCombat'
import { rollCount, getFocusTerritory, attackerCasualties } from './selectors'
import { strengths, defenderCasualties, attackerCasualtyCount } from '../combatRolls'
import dice from '../../lib/numericalDieRolls'

const mapStateToProps = (state) => ({
  territory: getFocusTerritory(state),
  combatants: combatants(state),
  strengths: strengths(state),
  rollCount: rollCount(state),
  defenderCasualties: defenderCasualties(state),
  attackerCasualties: attackerCasualties(state),
  attackerCasualtyCount: attackerCasualtyCount(state)
})

const rollForCombat = (combatantCount, territoryIndex) => {
  return (dispatch, getState) => {
    let state = getState()
    dispatch({
      type: 'REMOVE_CASUALTIES',
      defenderCasualties: defenderCasualties(state),
      territoryIndex
    });
    let rolls = dice(combatantCount);
    dispatch({
      type: 'ROLLS',
      phase: '/combat-rolls',
      rolls
    });
    dispatch(push('combat-rolls'));
  }
}

const toggleCasualtyStatus = (id, territoryIndex) => {
  return (dispatch) => {
    dispatch({
      type: 'TOGGLE_CASUALTY',
      id,
      territoryIndex
    })
  }
}

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({ 
    rollForCombat, 
    toggleCasualtyStatus
  }, dispatch)
}

const CombatContainer = connect(mapStateToProps, mapDispatchToProps)(CombatModal)

export default CombatContainer

