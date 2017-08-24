import { 
  isNeutral, 
  isLand, 
  isSea, 
  isFriendly, 
  passableByLandUnit, 
  passableBySeaUnit, 
} from '../../lib/territory';

export const territoriesInRange = (board, currentPower, territory, accessible, n) => {
  let territories = { 0: [territory] };
  let allTerritories = [territory];
  for (let range = 1; range <= n; range ++) {
    territories[range] = territories[range - 1].reduce((all, last) => {
      let newAdjacents = last.adjacentIndexes.reduce((adjacents, i) => {
        let current = board[i];
        if (allTerritories.includes(current) || !accessible(current, currentPower)) {
          return adjacents
        } else {
          allTerritories.push(current);
          return adjacents.concat(current)
        }
      }, []);
      return all.concat(newAdjacents);
    }, []);
  }
  return territories;
}

const nonNeutral = (territory) => !isNeutral(territory);

const unitsInRange = (territories, currentPowerName, type, returnFlight) => {
  return Object.keys(territories).reduce((units, range) => {
    let unitsAtRange = territories[range].reduce((units, territory) => {
      let territoryUnits = territory.units.filter(unit => {
        let effectiveRange = type === 'air' ? unit.movement - returnFlight : unit.movement;
        return unit[type] && unit.power === currentPowerName && 
          effectiveRange >= range; 
      });
      return [...units, ...territoryUnits.map(unit => ({ ...unit, originName: territory.name, originIndex: territory.index, distance: parseInt(range, 10) }))]
    }, []);
    return [...units, ...unitsAtRange];
  }, []);
}

const airUnitsInRange = (board, currentPower, territory) => {
  if (territory.units.length) {
    let territories = territoriesInRange(board, currentPower, territory, nonNeutral, 6);
    let returnFlight = Object.keys(territories).reduce((min, range) => {
      return territories[range].some(ter => {
        return isLand(ter) && isFriendly(ter, currentPower)}) ? Math.min(min, range) : min;
    }, 8);
    return unitsInRange(territories, currentPower.name, 'air', returnFlight)
  } else {
    return []
  }
}

const landUnitsInRange = (board, currentPower, territory) => {
  let territories = territoriesInRange(board, currentPower, territory, passableByLandUnit, 2);
  return unitsInRange(territories, currentPower.name, 'land');
}

const transportOrMovedTo = (territory, unit) => {
  return unit.originIndex !== territory.index || 
         unit.name === 'transport'
}

const amphibUnitsInRange = (board, currentPower, territory) => {
  let territories = territory.adjacentIndexes.map(index => board[index]).filter(isSea);
  let transports = territories.reduce((transports, territory) => {
    let territoryTransports = territory.unitsFrom.filter(unit => {
      return unit.cargo && unit.power === currentPower.name
    })
    return [...transports, ...territoryTransports.map(unit => ({ ...unit, originName: territory.name, originIndex: territory.index }))]
  }, []);
  return transports;
}

const seaUnitsInRange = (board, currentPower, territory) => {
  let territories = territoriesInRange(board, currentPower, territory, passableBySeaUnit, 2);
  let units = unitsInRange(territories, currentPower.name, 'ship');
  return units.filter(unit => transportOrMovedTo(territory, unit));
}

const unitSort = (a, b) => {
  if (a.distance > b.distance) {
    return 1
  } else if (b.distance > a.distance) {
    return -1
  } else {
    return a.originName.localeCompare(b.originName)
  }
}

export const combatUnitsInRange = (board, currentPower, territory) => {
  if (isLand(territory)) {
    return [
      ...landUnitsInRange(board, currentPower, territory),
      ...amphibUnitsInRange(board, currentPower, territory),
      ...airUnitsInRange(board, currentPower, territory)
    ].sort(unitSort)

  } else if (isFriendly(territory, currentPower)) {
    return seaUnitsInRange(board, currentPower, territory).sort(unitSort)
  } else {
    return [
      ...seaUnitsInRange(board, currentPower, territory),
      ...airUnitsInRange(board, currentPower, territory)
    ].sort(unitSort)
  }
}

