import React, { Component } from "react";
import "./App.css";
import Navbar from "./components/Navbar";
import "bootstrap/dist/css/bootstrap.css";

const drawGrid = true;
const width = 120;
const height = 120;
const cols = width / 20;
const rows = height / 20;

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

  updateGame = () => {
    let snake = this.state.snake;
    let fruit = this.state.fruit;

    let head = JSON.parse(JSON.stringify(snake[0]));
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
      fruit = {
        x: Math.floor(Math.random() * this.state.cols) * 20,
        y: Math.floor(Math.random() * this.state.rows) * 20
      };
    } else {
      snake.pop();
    }

    if (head.x >= 1000 || head.x < 0 || head.y >= 500 || head.y < 0) {
      this.setState({ gameover: true });
    }
    snake.filter((elem, index) => {
      if (elem.x === head.x && elem.y === head.y && index !== 0) {
        this.setState({ gameover: true });
      }
      return null;
    });

    this.setState({ snake: snake, fruit: fruit });
    this.updateCanvas();
    if (this.state.gameover || this.state.pause)
      setTimeout(this.gamePaused, 10);
    else setTimeout(this.updateGame, 100);
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
    if (this.state.path !== []) this.drawCycle();
    this.drawComponents();
  }

  generateHamCycle() {
    const grid = this.state.grid;
    // let index = Math.floor(Math.random() * grid.length);
    let index = 0;
    const randomTile = grid[index];
    let path = [];
    path[0] = randomTile;

    if (this.hamCycleLoop(path, randomTile, index))
      console.log("A PATH WAS FOUND", path);
    if (path.length > 1) this.setState({ path: path });
  }

  // generateNeighbors() {
  //   const grid = this.state.grid;
  //   let neighbors = [];
  //   for (let i = 0; i < grid.length; i++) {
  //     neighbors[i] = [];
  //     for (let j = 0; j < grid.length; j++) {
  //       neighbors[i][j] = -1;
  //     }
  //   }

  //   console.log("Pre modified neighbors", neighbors);
  //   for (let i = 0; i < grid.length; i++) {
  //     for (let j = 0; j < grid.length; j++) {
  //       if (this.isNeighbor(grid[i], grid[j])) neighbors[i][j] = 1;
  //       else neighbors[i][j] = 0;
  //     }
  //   }
  //   console.log("Updated neighbors", neighbors);
  // }

  isNeighbor(tile1, tile2) {
    if (tile1.x === tile2.x) {
      if (tile1.y + 20 === tile2.y || tile1.y - 20 === tile2.y) return true;
    } else if (tile1.y === tile2.y) {
      if (tile1.x + 20 === tile2.x || tile1.x - 20 === tile2.x) return true;
    }
    return false;
  }

  hamCycleLoop(path, currPos) {
    console.log(path);
    const grid = this.state.grid;

    if (path.length === grid.length) {
      if (this.isNeighbor(path[0], path[path.length - 1])) {
        return true;
      } else {
        return false;
      }
    }

    for (let index = 0; index < grid.length; index++) {
      let nextPos = grid[index];
      if (this.isNeighbor(currPos, nextPos)) {
        if (!path.includes(nextPos)) {
          path.push(nextPos);
          if (this.hamCycleLoop(path, nextPos)) return true;

          path.pop(); // If we cannot form a loop with this arrangement, remove the last element
        }
      }
    }

    return false;

    // outer: while (path.length < grid.length) {
    //   for (let index = 0; index < grid.length; index++) {
    //     if (index >= grid.length) index = 0;
    //     let nextPos = grid[index];
    //     if (this.isNeighbor(currPos, nextPos)) {
    //       if (!path.includes(nextPos)) {
    //         path.push(nextPos);
    //         currPos = nextPos;
    //         continue outer;
    //       }
    //     }
    //   }
    //   console.log("there is no valid Hamiltonian path");
    //   console.log(path);
    //   return [];
    // }
    // console.log("A PATH WAS FOUND", path);
    // return path;
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

  // updateSize = () => {
  //   this.setState({ myWidth: window.innerWidth, myHeight: window.innerHeight });
  // };

  render() {
    return (
      <div className="container-fluid">
        <Navbar onReset={this.handleReset} onGenerate={this.handleGenerate} />
        <br></br>
        <div className="row">
          <div className="col-1"></div>
          <div className="col-10">
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
