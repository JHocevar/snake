import { doesContainElement, getPathIndex } from "./functions";

function isHamiltonian(path, grid) {
  if (path.length !== grid.length) return false;
  if (!isNeighbor(path[0], path[path.length - 1])) return false;
  return true;
}

function getNeighbors(current, width, height) {
  let neighbors = [];
  let left = { x: current.x - 20, y: current.y };
  if (left.x >= 0) neighbors.push(left);
  let right = { x: current.x + 20, y: current.y };
  if (right.x < width) neighbors.push(right);
  let up = { x: current.x, y: current.y - 20 };
  if (up.y >= 0) neighbors.push(up);
  let down = { x: current.x, y: current.y + 20 };
  if (down.y < height) neighbors.push(down);
  return neighbors;
}

function getRandomUnvisitedNeighbor(current, path, maxWidth, maxHeight) {
  let neighbors = getNeighbors(current, maxWidth, maxHeight);
  let neighbor;
  do {
    neighbor = neighbors[Math.floor(Math.random() * neighbors.length)];
  } while (doesContainElement(path, neighbor));
  return neighbor;
}

function hasUnvisitdNeighbor(current, path, maxWidth, maxHeight) {
  let neighbors = getNeighbors(current, maxWidth, maxHeight);
  for (let i = 0; i < neighbors.length; i++) {
    if (!doesContainElement(path, neighbors[i])) return true;
  }
  return false;
}

function findEdgeToRemove(elem1, elem2, path) {
  for (let i = path.length - 1; i > 0; i--) {
    if (elem1.x === path[i].x && elem1.y === path[i].y) return elem1;
    if (elem2.x === path[i].x && elem2.y === path[i].y) return elem2;
  }
}

function isNeighbor(tile1, tile2) {
  if (tile1.x === tile2.x) {
    if (tile1.y + 20 === tile2.y || tile1.y - 20 === tile2.y) return true;
  } else if (tile1.y === tile2.y) {
    if (tile1.x + 20 === tile2.x || tile1.x - 20 === tile2.x) return true;
  }
  return false;
}

function generateHamCycle(grid, maxWidth, maxHeight) {
  let current = grid[0];
  let path = [];
  path[0] = current;

  while (!isHamiltonian(path, grid)) {
    if (path.length > grid.length) break;
    if (hasUnvisitdNeighbor(current, path, maxWidth, maxHeight)) {
      let next = getRandomUnvisitedNeighbor(current, path, maxWidth, maxHeight);
      path.push(next);
      current = next;
    } else {
      // We need to modify the edges
      let neighbors = getNeighbors(current, maxWidth, maxHeight);
      let next = neighbors[Math.floor(Math.random() * neighbors.length)];
      let index = getPathIndex(next, path);
      if (index === 0) {
        // Only has 1 edge
        console.log("EDIT WITH 1 EDGE");
        path.splice(0, 1);
        path.push(next);
        current = next;
      } else {
        // Has 2 edge
        let pointToRemove = findEdgeToRemove(
          path[index - 1],
          path[index + 1],
          path
        );
        let indexToRemove = getPathIndex(pointToRemove, path);
        let temp = path.slice(indexToRemove, path.length);
        temp.reverse();
        temp.pop();
        path.splice(indexToRemove, path.length - 1);
        path.push(...temp);
        path.push(pointToRemove);
        current = pointToRemove;
      }
    }
  }
  console.log("The path is hamiltonian");
  for (let i = 0; i < path.length; i++) {
    path[i].index = i;
  }
  return path;
}

export default generateHamCycle;
