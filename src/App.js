import React, { Component } from "react";
import "./App.css";
import Navbar from "./components/Navbar";
import Menu from "./components/Menu";
import "bootstrap/dist/css/bootstrap.css";
import generateHamCycle from "./hamiltonian";
import { doesContainElement, getPathIndex } from "./functions";

const width = 600;
const height = 600;
const cols = width / 20;
const rows = height / 20;
const gamespeeds = [500000, 400, 200, 150, 80, 50, 40, 30, 20, 10, 1];

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
      gamestate: "playing",
      drawGrid: false,
      menu: false,
      followGrid: false,
      gamespeed: 5
    };
  }

  resetGameboard() {
    console.log("Resetting game board");
    let grid = [];
    for (let x = 0; x < width; x += 20) {
      for (let y = 0; y < height; y += 20) {
        grid.push({
          x: x,
          y: y
        });
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
      gamestate: "playing",
      path: [],
      menu: this.state.menu,
      followGrid: false,
      gamespeed: 5
    });
  }

  // Run the snake game functions
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
    let headIndex = getPathIndex(snake[0], path);
    let fruitIndex = getPathIndex(fruit, path);
    let dirIndex = getPathIndex(dir, path);

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
          let bodyIndex = getPathIndex(snake[i], path);
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
    let dir = {
      x: snake[0].x - 20,
      y: snake[0].y
    }; // LEFT
    distance = this.checkDirection(dir);
    if (distance !== false) {
      dir.distance = distance;
      directions.push(dir);
    }

    dir = {
      x: snake[0].x + 20,
      y: snake[0].y
    }; // RIGHT
    distance = this.checkDirection(dir);
    if (distance !== false) {
      dir.distance = distance;
      directions.push(dir);
    }

    dir = {
      x: snake[0].x,
      y: snake[0].y - 20
    }; // UP
    distance = this.checkDirection(dir);
    if (distance !== false) {
      dir.distance = distance;
      directions.push(dir);
    }

    dir = {
      x: snake[0].x,
      y: snake[0].y + 20
    }; // DOWN
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
    let headIndex = getPathIndex(head, path);
    let nextLocation;
    if (headIndex === path.length - 1) nextLocation = path[0];
    else nextLocation = path[headIndex + 1];

    if (this.state.followGrid && this.state.path.length > 0) {
      let bestChoice = false;
      let dir = "";

      if (snake.length < cols * rows * 0.8) {
        // Only allow snake to make jumps if it takes up less than 80% of available tiles
        bestChoice = this.getBestPath();
      }

      if (bestChoice !== false) {
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
      this.setState({
        direction: dir
      });
    }

    console.log("directions", this.state.direction);
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

    if (this.state.direction !== "none") snake.unshift(head);

    if (head.x === fruit.x && head.y === fruit.y) {
      do {
        fruit = {
          x: Math.floor(Math.random() * this.state.cols) * 20,
          y: Math.floor(Math.random() * this.state.rows) * 20
        };
      } while (
        doesContainElement(snake, fruit) &&
        snake.length < this.state.grid.length
      );
    } else if (this.state.direction !== "none") {
      snake.pop();
    }

    if (snake.length >= this.state.grid.length)
      this.setState({ gamestate: "won" });

    if (head.x >= width || head.x < 0 || head.y >= height || head.y < 0) {
      this.setState({
        gamestate: "lost"
      });
    }
    snake.filter((elem, index) => {
      if (elem.x === head.x && elem.y === head.y && index !== 0) {
        this.setState({
          gamestate: "lost"
        });
      }
      return null;
    });

    this.setState({
      snake: snake,
      fruit: fruit
    });
    this.updateCanvas();
    if (this.state.gamestate !== "playing") setTimeout(this.gamePaused, 10);
    else setTimeout(this.updateGame, gamespeeds[this.state.gamespeed]);
  };

  gamePaused = () => {
    if (this.state.gamestate !== "playing") {
      const canvas = document.getElementById("GameCanvas");
      const context = canvas.getContext("2d");
      context.fillStyle = "#FFFFFF";
      let size = 100;
      let font = size + "px Arial";
      console.log(font);
      context.font = font;
      context.textAlign = "center";
      switch (this.state.gamestate) {
        case "lost":
          context.fillText("GAME OVER", width / 2, height / 2);
          break;
        case "paused":
          context.fillText("PAUSED", width / 2, height / 2);
          break;
        case "won":
          context.fillText("YOU WON!", width / 2, height / 2);
          break;
        default:
          break;
      }
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
    if (this.state.drawGrid) this.drawGrid();

    this.drawComponents();
    if (this.state.path !== [] && this.state.drawGrid) this.drawCycle();
  }

  handleGenerate() {
    let grid = JSON.parse(JSON.stringify(this.state.grid));
    let path = generateHamCycle(grid, width, height);
    this.setState({
      path: path
    });
  }

  // Even handling functions
  handleMenu = e => {
    e.target.blur();
    this.setState({ menu: !this.state.menu });
  };

  handleReset = e => {
    e.target.blur();
    this.resetGameboard();
  };

  handleKeypress = key => {
    let gamestate;
    switch (key.code) {
      case "ArrowDown":
        this.setState({
          direction: "down"
        });
        break;
      case "ArrowUp":
        this.setState({
          direction: "up"
        });
        break;
      case "ArrowRight":
        this.setState({
          direction: "right"
        });
        break;
      case "ArrowLeft":
        this.setState({
          direction: "left"
        });
        break;
      case "Space":
      case "KeyP":
        if (this.state.gamestate !== "paused") gamestate = "paused";
        else gamestate = "playing";
        this.setState({ gamestate: gamestate });
        break;
      default:
        break;
    }
  };

  handleDisplay = e => {
    e.target.blur();
    this.setState({ drawGrid: !this.state.drawGrid });
  };

  handleAutoplay = e => {
    e.target.blur();
    this.setState({ followGrid: !this.state.followGrid, direction: "none" });
    if (this.state.path.length === 0) {
      this.handleGenerate();
    }
  };

  handleGamespeed = value => {
    let gamespeed = this.state.gamespeed;
    gamespeed += value;
    if (gamespeed > gamespeeds.length - 1) gamespeed = gamespeeds.length - 1;
    if (gamespeed < 1) gamespeed = 1; // Cap it at 1, gamespeed of 0 doesnt make much sense;
    this.setState({ gamespeed: gamespeed });
  };

  // Render functions
  displayMenu() {
    if (this.state.menu) {
      return (
        <Menu
          onAutoplay={this.handleAutoplay}
          on={this.state.followGrid}
          gamespeed={this.state.gamespeed}
          onGamespeed={this.handleGamespeed}
        />
      );
    }
  }

  render() {
    return (
      <div className="container-fluid">
        <Navbar
          onReset={this.handleReset}
          onDisplay={this.handleDisplay}
          onMenu={this.handleMenu}
          display={this.state.drawGrid}
        />
        <br></br>
        <div className="row">
          <div className="col-2">{this.displayMenu()}</div>
          <div className="col-8">
            <span> Score: {this.state.snake.length} </span> <br></br>
            <canvas id="GameCanvas" width={width} height={height}></canvas>
          </div>
        </div>
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
