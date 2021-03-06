import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { push } from 'connected-react-router'
import { 
  getCurrentPower, 
  research, 
  currentPowerHasRockets
} from './selectors'
import researchOptions from '../../config/research'
import dice from '../../lib/numericalDieRolls'
import ResearchModal from './ResearchModal'
import { 
  DEVELOP_TECH,
  INCREASE_RESEARCH_BUDGET,
  DECREASE_RESEARCH_BUDGET,
  SET_TECH,
  ATTEMPT_RESEARCH,
  roll 
} from '../../actions'
import PATHS from '../../paths'

const mapStateToProps = (state) => {
  return {
    currentPower: getCurrentPower(state),
    hasRockets: currentPowerHasRockets(state),
    research: research(state)
  }
}

const attemptResearch = () => {
  return (dispatch, getState) => {
    const state = getState()
    const { research, currentPowerIndex } = state 
    const rolls = dice(research.attempts)
    dispatch(roll(PATHS.RESEARCH_RESULTS, rolls))
    dispatch({
      type: ATTEMPT_RESEARCH,
      cost: research.attempts * researchOptions.cost,
      currentPowerIndex
    })
    if (rolls.includes(6)) {
      dispatch({
        type: DEVELOP_TECH,
        currentPowerIndex,
        tech: research.selectedTech
      })
    }
    dispatch(push(PATHS.RESEARCH_RESULTS))
  }
}

const setTech = (tech) => {
  return {
    type: SET_TECH,
    tech
  }
}

const incrementResearch = () => ({ type: INCREASE_RESEARCH_BUDGET })

const decrementResearch = () => ({ type: DECREASE_RESEARCH_BUDGET })

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({ 
    setTech, 
    incrementResearch, 
    decrementResearch, 
    attemptResearch 
  }, dispatch)
}

const ResearchContainer = connect(mapStateToProps, mapDispatchToProps)(ResearchModal)

export default ResearchContainer

