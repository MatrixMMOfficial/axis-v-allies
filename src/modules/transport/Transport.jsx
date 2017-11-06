import React from 'react'
import { UnitFigTableData } from '../../components/UnitFigure'

const Transport = ({ 
  unit, 
  available,
  cargo,
  destinationIndex, 
  unitIds,
  viewTransportLoadOptions,
  commitUnits,
  unCommitUnits
}) => (
  <tr>
    <UnitFigTableData unit={unit} />
    <td className="available">
      <input readOnly size={2} value={available ? 1 : 0} />
      <button 
        onClick={e => { viewTransportLoadOptions(unit, destinationIndex)}}
        disabled={!available}
      >Load</button>
      <button 
        onClick={e => commitUnits(unit.originIndex, destinationIndex, [unit.id])}
        disabled={!available || unit.originIndex === destinationIndex}
      >&gt;</button>
      {cargo.length ? <span title={cargo.map(u => `${u.type} from ${u.originName}`)}>carrying ...</span> : ''}
    </td>
    <td className="available">
      <input readOnly size={2} value={available ? 0 : 1} />
      <button 
        onClick={e => unCommitUnits(destinationIndex, unitIds)}
        disabled={available}
      >&lt;</button>
    </td>
  </tr>
)

export default Transport