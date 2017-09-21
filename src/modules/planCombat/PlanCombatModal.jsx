import React from 'react';
import ReactTooltip from 'react-tooltip';
import { unitMatch } from '../../lib/unit';
import { hasIndustrialComplex } from '../../lib/territory';
import Attacker from './AttackerContainer';
import Occupiers from './Occupiers';
import { STRATEGIC_BOMB } from '../../actions';

const PlanCombatModal = ({ territory, unitsInRange, planOtherAttack, combatants, landingSlots }) => {
  const attacker = (unit, key) => {
    let committed = territory.unitsFrom.find(u => unitMatch(u, unit, 'originIndex') && !u.mission) || { ids: [] };
    let strategicBombing = territory.unitsFrom.find(u => unitMatch(u, unit, 'originIndex') && u.mission === STRATEGIC_BOMB) || { ids: [] };
    return (
      <Attacker 
        key={key}
        unit={unit}
        hasIndustry={hasIndustrialComplex(territory)}
        destinationIndex={territory.index}
        landAttack={!territory.sea}
        landingSlots={landingSlots}
        committed={committed} 
        strategicBombing={strategicBombing} />
    )
  }
  return (
    <div>
      <a data-tip className="help">?</a>
      <h1>Plan Combat</h1>
      <p>Attacking: {territory.name}</p>
      <ReactTooltip place="bottom" type="info">
        <p>To attack this territory, move desired units in the "# Available" column to the "# Attacking" column by pressing the <button>>></button> or <button>></button> buttons below. Remove units from the "# Attacking" column by pressing the <button>&lt;&lt;</button> or <button>&lt;</button> buttons below. Defending units are shown in the "Committed Units" column.</p>
        <p>Note that some units may have several attack options, so be sure to choose the desired attack option for each unit.</p>
        <hr/>
        <p>When you are done choosing your attacking units for this territory, press <button>ok</button><a>Battle Odds</a><a>Preview Battle Board</a></p>
      </ReactTooltip>
      <div className="unitSelector">
        <div>
          <table
            className="outer scroll"
            cellSpacing={0} 
            cellPadding={1}>
            <thead>
              <tr>
                <th className="unit">Units Within Range:</th>
                <th className="available"># Available:</th>
                <th className="available"># Attacking:</th>
              </tr>
            </thead>
            <tbody>
              {unitsInRange.map(attacker)}
              {unitsInRange.length === 0 ? <tr><td>You have no units in range.</td></tr> : null}
            </tbody>
          </table>
        </div>
        <div className="committedUnits">
          <h3>Committed Units</h3>
          <Occupiers 
            combatants={combatants}
            sea={territory.sea} />
        </div>
      </div>
      <p>When you are done choosing your attacking units for this territory, press <button onClick={planOtherAttack}>ok</button></p>
    </div>
  )
}

// defenders doesn't account for all of WW2Defense.prototype.defenseEquals, specifically showing transports separately if their cargo differs
// the rest of territory.prototype.updateDefences, getDefences, and all of WW2Defenses is basically here though
export default PlanCombatModal
// resources 43,44

