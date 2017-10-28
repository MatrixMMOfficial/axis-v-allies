import React from 'react';
import { Route } from 'react-router-dom';
import { groupWith } from 'ramda';
import { ImgAndQty } from '../../../components/UnitFigure';
import { matchingUnit } from '../../../lib/Parser';
import { consolidateUnits, unitCount } from '../../../lib/unit';
import { powerData } from '../../../config/initialPowers';
import '../../../assets/styles/tooltip.css';
import industryImg from '../../../assets/images/industrial_complex.png';
import PATHS from '../../../paths';

const Units = ({ units, unitsFrom }) => {
  const combatUnits = units.filter(u => u.name !== 'industrial complex');
  const reducedUnitsFrom = groupWith(matchingUnit, unitsFrom).reduce((units, group) => {
    let ids = group.reduce((ids, u) => ids.concat(u.ids), []);
    let unit = { ...group[0], ids }
    return units.concat(unit)
  }, [])
  const consolidatedCombatUnits = consolidateUnits(combatUnits.concat(reducedUnitsFrom))
  return (
    <div>
      {consolidatedCombatUnits.map((unit, index) => (
        <ImgAndQty key={index} unit={unit} />
       ))}
    </div>
  )
}

const StartTooltip = ({ playing, currentPower }) => {
  if (playing) {
    return (
      <div>
        <p>This is the start of your turn. You are playing <strong>{currentPower.name}</strong> for the <strong>{powerData[currentPower.name].side}</strong>.</p>
        <p>Click anywhere on the map to start.</p>
      </div>
    )
  } else {
    return (
      <div>
        <p>It is <strong>{currentPower.name}</strong>'s turn.</p>
        <p>You may send messages to other players while you wait for your next turn.</p>
      </div>
    )
  }
}

const RepairTooltip = () => {
  return (
    <table style={{ border: '2px solid #000000', backgroundColor: '#ffffff' }} cellPadding="0" width="300">
      <tbody>
        <tr><td></td></tr>
        <tr><td>resource</td></tr>
      </tbody>
    </table>
  )
}

const PlanCombatTooltip = () => {
  return (
    <div>
      <p><strong>Make your combat moves.</strong> Click on an enemy territory or sea zone you wish to attack, any sea zone you need to move supporting units to, or friendly territory you wish to blitz to.</p> 
      <p><strong>When you are done making your combat moves, click the &quot;Done&quot; button in the Indian Ocean.</strong></p>
    </div>
  )
}

const ResolveCombatTooltip = () => {
  return (
    <div>
      <p><strong>Resolve all combat.</strong> Click on an enemy territory or sea zone you are attacking. Territories with combat needing to be resolved are on fire, "The World at War"-style.</p>
      <p>You can choose the order in which the battles are fought, but you will not be able to fight more than one battle at a time. Each battle will need to be fully resolved in order to begin the next one. Amphibious assault units will need to have their sea zone battle resolved before the land battle can begin.</p>
    </div>
  )
}
 
const LandPlanesTooltip = () => {
  return (
    <div>
      <p><strong>Land all combat aircraft.</strong> Territories with combat aircraft needing to be landed are blinking.</p>
      <p>When you have landed all your combat aircraft and are ready to move to the next phase, click the &quot;Done&quot; button in the Indian Ocean.</p>
    </div>
  )
}

const NonCombatMovementTooltip = () => {
  return (
    <div>
      <p><strong>Make your non-combat moves.</strong> Click on any friendly territory or sea zone you wish to move units to.</p>
      <p>When you are done making your non-combat moves, click the <strong>Done</strong> button in the compass rose.</p>
      <p>You cannot move units used in combat this turn.</p>
      <p>Territories <strong>to</strong> which you have made non-combat moves will blink. You may click on those territories to change your moves.</p>
    </div>
  )
}

const OrderUnitsTooltip = () => {
  return (
    <div>
      <p><strong>Order combat units for defense.</strong>Click on any territory or sea zone in which you have combat units to set the order in which they will be eliminated when defending.</p>
      <p>Territories with multiple combat unit types whose defenses you have not reviewed this turn are blinking. Manually set the order for the units in as many territories as you like, then click the "Order by Cost" button.</p>
    </div>
  )
}

const ConfirmFinishTooltip = () => {
  return (
    <div>
      <p><strong>Click the Done button.</strong> If you are satisfied with your defensive assignments, click the <strong>Done</strong> button in the compass rose to end your turn.</p>
      <p>Click a territory to change defensive assignments for combat units.</p>
      <p><strong><span className="warning">Warning:</span> When you click the Done button, your turn will be over and you will not be able to undo any of your non-combat moves or change defensive assignments until your next turn.</strong></p>
    </div>
  )
}

const Tooltip = ({ playing, territory, currentPower }) => {
  const { units = [], unitsFrom = [] } = territory
  const industry = units.find(unit => unit.name === 'industrial complex')
  return (
    <div>
      <h1>{territory.name}{industry ? <img src={industryImg} alt="industrial complex" style={{height: 20}}/> : null}</h1>
      <Units units={units} unitsFrom={unitsFrom} />
      <Route exact path="/" 
        render={() => <StartTooltip playing={playing} currentPower={currentPower} />} />
      <Route path={PATHS.REPAIR} component={RepairTooltip} />
      <Route path={PATHS.PLAN_ATTACKS} component={PlanCombatTooltip} />
      <Route path={PATHS.RESOLVE_COMBAT} component={ResolveCombatTooltip} />
      <Route path={PATHS.LAND_PLANES} component={LandPlanesTooltip} />
      <Route path={PATHS.PLAN_MOVEMENT} component={NonCombatMovementTooltip} />
      <Route path={PATHS.ORDER_UNITS} component={OrderUnitsTooltip} />
      <Route path={PATHS.CONFIRM_FINISH} component={ConfirmFinishTooltip} />
    </div>
  )
}

export default Tooltip
// 2 resources for repairRender
      //"370":"<b>Repair damaged capital ships.</b> Click on any sea zone in which you have damaged capital ships (battleships or aircraft carriers) in a friendly naval base to repair the damage. <p style=\"margin-top:5pxmargin-bottom:5px\">Territories with ships you can repair this turn are blinking. After you have reviewed each of these territories, you will be able to proceed to R&D.",
      //"371":"<b>Click the Done button.</b> If you are satisfied with your choices for repair, click the <b>Done</b> button in the compass rose to proceed with your turn.<p style=\"margin-top:5pxmargin-bottom:5px\">Click a sea zone to change repair decisions for capital ships.",
