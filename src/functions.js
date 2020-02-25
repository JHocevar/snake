function doesContainElement(arr, element) {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i].x === element.x && arr[i].y === element.y) return true;
  }
  return false;
}

function getPathIndex(elem, path) {
  for (let i = 0; i < path.length; i++) {
    if (elem.x === path[i].x && elem.y === path[i].y) {
      return i;
    }
  }
}

export { doesContainElement, getPathIndex };
