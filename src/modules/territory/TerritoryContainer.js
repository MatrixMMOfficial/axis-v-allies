import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { push } from 'connected-react-router'
import Territory from './Territory'
import { getFill, getClasses, isOrdering } from './selectors'
import { getCurrentPower } from '../../selectors/getCurrentPower'
import { hasDamagedShipsInHarbor } from '../repair'
import { overlayPhase } from '../board'
import { isAttackable } from '../../lib/territory'
import { 
  planAttack, 
  resolveCombat, 
  planLandPlanes,
  planMovement,
  orderUnits
} from '../../actions';

const mapStateToProps = (state, ownProps) => {
  return {
    fill: getFill(ownProps.territory),
    classNames: getClasses(state, ownProps.territory),
    ...ownProps
  }
}

const territoryThunk = (territory) => {
  return (dispatch, getState) => {
    const state = getState()
    if (overlayPhase(state)) {
      return
    }
    const { router, phase } = state 
    const currentPowerName = getCurrentPower(state).name
    const routes = {
      '/': () => {
        if (currentPowerName === 'China') {
          dispatch(push('/plan-combat'))
        } else {
          const nextUrl = hasDamagedShipsInHarbor(state) ? 'repair' : 'research'
          dispatch(push(nextUrl)) 
        }
      }, 
      '/plan-combat': () => {
        if (isAttackable(territory, currentPowerName)) {
          dispatch(planAttack(territory))
        }
      },
      '/resolve-combat': () => {
        // need logic to prevent dispatch if no combat
        if (territory.unitsFrom.length && territory.units.length) {
          dispatch(resolveCombat(territory))
        }
      },
      '/land-planes': () => {
        if (territory.newlyConquered && territory.units.filter(u => u.air).length) {
          dispatch(planLandPlanes(territory))
        }
      },
      '/move-units': () => dispatch(planMovement(territory)),
      '/order-units': () => {
        const { currentPower, units } = territory;
        if (isOrdering(phase.current, currentPowerName, currentPower, units)) {
          dispatch(orderUnits(territory)) 
        }
      }
    }
    routes[router.location.pathname]()
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    handleClick: bindActionCreators(territoryThunk, dispatch)
  }
}

const TerritoryContainer = connect(mapStateToProps, mapDispatchToProps)(Territory)

export default TerritoryContainer