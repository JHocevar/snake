import React, { Component } from "react";
import "./App.css";
import Navbar from "./components/Navbar";
import "bootstrap/dist/css/bootstrap.css";

const drawGrid = true;
const followGrid = true;
const width = 1200;
const height = 500;
const cols = width / 20;
const rows = height / 20;
const gamespeed = 1;

class App extends Component {
  constructor() {
    super();
    this.state = {
      grid: [],
      snake: [],
      fruit: {},
      path: [],
      direction: "none",
      pause: false,
      gameover: false
    };
  }

  resetGameboard() {
    console.log("Resetting game board");
    let grid = [];
    for (let x = 0; x < width; x += 20) {
      for (let y = 0; y < height; y += 20) {
        grid.push({ x: x, y: y });
      }
    }
    let snake = [];
    snake[0] = {
      x: Math.floor(Math.random() * cols) * 20,
      y: Math.floor(Math.random() * rows) * 20
    };

    let fruit = {};
    fruit = {
      x: Math.floor(Math.random() * cols) * 20,
      y: Math.floor(Math.random() * rows) * 20
    };

    this.setState({
      grid: grid,
      fruit: fruit,
      snake: snake,
      direction: "none",
      cols: cols,
      rows: rows,
      pause: false,
      gameover: false,
      path: this.state.path === [] ? [] : this.state.path
    });
  }

  snakeContains(location) {
    let snake = this.state.snake;
    for (let i = 0; i < snake.length; i++) {
      if (snake[i].x === location.x && snake[i].y === location.y) {
        // console.log(
        //   "Snake contains",
        //   location,
        //   this.getPathIndex(location, this.state.path)
        // );
        return true;
      }
    }
    return false;
  }

  getDistance(point1, point2) {
    let path = this.state.path;
    if (point1 > point2) {
      return path.length - point1 + point2;
    } else if (point2 >= point1) {
      return point2 - point1;
    }
  }

  checkDirection(dir) {
    let { snake, fruit, path } = this.state;
    let headIndex = this.getPathIndex(snake[0], path);
    let fruitIndex = this.getPathIndex(fruit, path);
    let dirIndex = this.getPathIndex(dir, path);

    if (dir.x >= 0 && dir.x < width && dir.y >= 0 && dir.y < height) {
      // The direction is in the grid
      if (dirIndex !== headIndex - 1 && !this.snakeContains(dir)) {
        // We will not allow the snake to travel to the path backwards (the path directly before the head)
        let distance = this.getDistance(dirIndex, fruitIndex);
        // console.log(
        //   "Distance to fruit: ",
        //   distance,
        //   "index ",
        //   dirIndex,
        //   " to ",
        //   fruitIndex
        // );

        // Loop through the snake and see if there if this distance is valid
        for (let i = 0; i < snake.length; i++) {
          let bodyIndex = this.getPathIndex(snake[i], path);
          let distanceToSnake = this.getDistance(dirIndex, bodyIndex);
          if (distanceToSnake < snake.length + 2 - i)
            // Also account for the snake growing
            return false;
        }

        return distance;
      }
    }
    return false;
  }

  getBestPath() {
    let { snake, path } = this.state;
    let directions = [];
    let distance;

    // Add any dirictions that are valid to an array
    let dir = { x: snake[0].x - 20, y: snake[0].y }; // LEFT
    distance = this.checkDirection(dir);
    if (distance !== false) {
      dir.distance = distance;
      directions.push(dir);
    }

    dir = { x: snake[0].x + 20, y: snake[0].y }; // RIGHT
    distance = this.checkDirection(dir);
    if (distance !== false) {
      dir.distance = distance;
      directions.push(dir);
    }

    dir = { x: snake[0].x, y: snake[0].y - 20 }; // UP
    distance = this.checkDirection(dir);
    if (distance !== false) {
      dir.distance = distance;
      directions.push(dir);
    }

    dir = { x: snake[0].x, y: snake[0].y + 20 }; // DOWN
    distance = this.checkDirection(dir);
    if (distance !== false) {
      dir.distance = distance;
      directions.push(dir);
    }

    // Choose the option with the smallest distance
    let bestIndex = -1;
    let bestDistance = path.length;
    for (let i = 0; i < directions.length; i++) {
      if (directions[i].distance < bestDistance) {
        bestIndex = i;
        bestDistance = directions[i].distance;
      }
    }

    // Return the value if we found one
    if (bestIndex > -1) return directions[bestIndex];
    else return false;
  }

  updateGame = () => {
    let { snake, fruit, path } = this.state;
    let head = JSON.parse(JSON.stringify(snake[0]));
    let headIndex = this.getPathIndex(head, path);
    let nextLocation;
    if (headIndex === path.length - 1) nextLocation = path[0];
    else nextLocation = path[headIndex + 1];

    if (followGrid && this.state.path.length > 0) {
      let bestChoice = false;
      let dir = "";

      if (snake.length < cols * rows * 0.8) {
        // Only allow snake to make jumps if it takes up less than 80% of available tiles
        bestChoice = this.getBestPath();
      }

      if (bestChoice !== false) {
        console.log(bestChoice, this.getPathIndex(bestChoice, path));
        if (bestChoice.x > head.x) dir = "right";
        else if (bestChoice.x < head.x) dir = "left";
        else if (bestChoice.y > head.y) dir = "down";
        else if (bestChoice.y < head.y) dir = "up";
      }

      // If we did not find a direction, or snake is too long, travel to the next direction in the path
      if (dir === "") {
        if (nextLocation.x > head.x) dir = "right";
        else if (nextLocation.x < head.x) dir = "left";
        else if (nextLocation.y > head.y) dir = "down";
        else dir = "up";
      }
      this.setState({ direction: dir });
    }

    switch (this.state.direction) {
      case "up":
        head.y -= 20;
        break;
      case "down":
        head.y += 20;
        break;
      case "left":
        head.x -= 20;
        break;
      case "right":
        head.x += 20;
        break;
      default:
        break;
    }

    snake.unshift(head);

    if (head.x === fruit.x && head.y === fruit.y) {
      do {
        fruit = {
          x: Math.floor(Math.random() * this.state.cols) * 20,
          y: Math.floor(Math.random() * this.state.rows) * 20
        };
      } while (this.doesContainElement(snake, fruit));
    } else {
      snake.pop();
    }

    if (head.x >= width || head.x < 0 || head.y >= height || head.y < 0) {
      this.setState({ gameover: true });
    }
    snake.filter((elem, index) => {
      if (elem.x === head.x && elem.y === head.y && index !== 0) {
        console.log(
          "crash happened at ",
          head.x,
          head.y,
          "index",
          this.getPathIndex(head, path)
        );
        this.setState({ gameover: true });
      }
      return null;
    });

    this.setState({ snake: snake, fruit: fruit });
    this.updateCanvas();
    if (this.state.gameover || this.state.pause)
      setTimeout(this.gamePaused, 10);
    else setTimeout(this.updateGame, gamespeed);
    // console.log("Updated game");
  };

  gamePaused = () => {
    if (this.state.pause || this.state.gameover) {
      const canvas = document.getElementById("GameCanvas");
      const context = canvas.getContext("2d");
      context.fillStyle = "#FFFFFF";
      context.font = "100px Arial";
      context.textAlign = "center";
      this.state.gameover
        ? context.fillText("GAME OVER", 500, 250)
        : context.fillText("PAUSED", 500, 250);
      setTimeout(this.gamePaused, 10);
    } else setTimeout(this.updateGame, 100);
  };

  drawGrid() {
    const context = document.getElementById("GameCanvas").getContext("2d");
    this.state.grid.map((elem, index) => {
      context.beginPath();
      context.rect(elem.x, elem.y, 20, 20);
      context.stroke();
      return null;
    });
  }

  drawCycle() {
    const context = document.getElementById("GameCanvas").getContext("2d");
    const path = this.state.path;
    if (path.length <= 1) return;
    path.map((elem, index) => {
      context.font = "8px Arial";
      context.fillStyle = "#FFFFFF";
      context.textAlign = "start";
      context.textBaseline = "top";
      context.fillText(index, elem.x, elem.y);
      return null;
    });
  }

  drawComponents() {
    const canvas = document.getElementById("GameCanvas");
    const context = canvas.getContext("2d");
    context.fillStyle = "#F00000";
    context.fillRect(this.state.fruit.x, this.state.fruit.y, 20, 20);
    this.state.snake.map((elem, index) => {
      if (index === 0) context.fillStyle = "#568203";
      else context.fillStyle = "#00FF00";
      context.beginPath();
      context.fillRect(elem.x, elem.y, 20, 20);
      context.stroke();
      return null;
    });
  }

  updateCanvas() {
    const canvas = document.getElementById("GameCanvas");
    const context = canvas.getContext("2d");
    context.clearRect(0, 0, canvas.width, canvas.height);
    if (drawGrid) this.drawGrid();

    this.drawComponents();
    if (this.state.path !== []) this.drawCycle();
  }

  isHamiltonian(path) {
    if (path.length !== this.state.grid.length) return false;
    if (!this.isNeighbor(path[0], path[path.length - 1])) return false;
    return true;
  }

  getNeighbors(current) {
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

  doesContainElement(arr, element) {
    for (let i = 0; i < arr.length; i++) {
      if (arr[i].x === element.x && arr[i].y === element.y) return true;
    }
    return false;
  }

  getRandomUnvisitedNeighbor(current, path) {
    let neighbors = this.getNeighbors(current);
    let neighbor;
    do {
      neighbor = neighbors[Math.floor(Math.random() * neighbors.length)];
    } while (this.doesContainElement(path, neighbor));
    // console.log("path is", JSON.parse(JSON.stringify(path)));
    // console.log(neighbor, "is an unvisited neighbor of ", current);
    return neighbor;
  }

  hasUnvisitdNeighbor(current, path) {
    let neighbors = this.getNeighbors(current);
    for (let i = 0; i < neighbors.length; i++) {
      if (!this.doesContainElement(path, neighbors[i])) return true;
    }
    return false;
  }

  findEdgeToRemove(elem1, elem2, path) {
    for (let i = path.length - 1; i > 0; i--) {
      if (elem1.x === path[i].x && elem1.y === path[i].y) return elem1;
      if (elem2.x === path[i].x && elem2.y === path[i].y) return elem2;
    }
  }

  getPathIndex(elem, path) {
    for (let i = 0; i < path.length; i++) {
      if (elem.x === path[i].x && elem.y === path[i].y) {
        return i;
      }
    }
  }

  generateHamCycle() {
    const grid = this.state.grid;
    let current = grid[0];
    let path = [];
    path[0] = current;

    while (!this.isHamiltonian(path)) {
      if (path.length > grid.length) break;
      if (this.hasUnvisitdNeighbor(current, path)) {
        let next = this.getRandomUnvisitedNeighbor(current, path);
        path.push(next);
        current = next;
      } else {
        // We need to modify the edges
        let neighbors = this.getNeighbors(current);
        let next = neighbors[Math.floor(Math.random() * neighbors.length)];
        let index = this.getPathIndex(next, path);
        if (index === 0) {
          // Only has 1 edge
          console.log("EDIT WITH 1 EDGE");
          path.splice(0, 1);
          path.push(next);
          current = next;
        } else {
          // Has 2 edge
          let pointToRemove = this.findEdgeToRemove(
            path[index - 1],
            path[index + 1],
            path
          );
          let indexToRemove = this.getPathIndex(pointToRemove, path);
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
    this.setState({ path: path });
  }

  isNeighbor(tile1, tile2) {
    if (tile1.x === tile2.x) {
      if (tile1.y + 20 === tile2.y || tile1.y - 20 === tile2.y) return true;
    } else if (tile1.y === tile2.y) {
      if (tile1.x + 20 === tile2.x || tile1.x - 20 === tile2.x) return true;
    }
    return false;
  }

  handleGenerate = () => {
    this.generateHamCycle();
  };

  handleReset = e => {
    e.target.blur();
    this.resetGameboard();
  };

  handleKeypress = key => {
    switch (key.code) {
      case "ArrowDown":
        this.setState({ direction: "down" });
        break;
      case "ArrowUp":
        this.setState({ direction: "up" });
        break;
      case "ArrowRight":
        this.setState({ direction: "right" });
        break;
      case "ArrowLeft":
        this.setState({ direction: "left" });
        break;
      case "Space":
      case "KeyP":
        this.setState({ pause: !this.state.pause });
        break;
      default:
        break;
    }
  };

  render() {
    return (
      <div className="container-fluid">
        <Navbar onReset={this.handleReset} onGenerate={this.handleGenerate} />
        <br></br>
        <div className="row">
          <div className="col-1"></div>
          <div className="col-10">
            <span>Score: {this.state.snake.length} </span> <br></br>
            <canvas id="GameCanvas" width={width} height={height}></canvas>
          </div>
        </div>
        {/* <Gamebox width={this.state.myWidth} height={this.state.myHeight} /> */}
      </div>
    );
  }

  componentDidMount() {
    window.addEventListener("resize", this.updateSize);
    document.addEventListener("keydown", this.handleKeypress);
    this.resetGameboard();
    setTimeout(this.updateGame, 10);
  }
}

export default App;
