let grid;

let ctx;
const setup = (width, heigth, cellSize) => {
  newCanvas(width, heigth);
  grid = new Grid(width / cellSize, heigth / cellSize, cellSize);
  setInterval(update, millis);
};

const update = () => {
  grid.display();
};

class Grid {
  cells = [];
  constructor(width, height, cellSize) {
    this.width = width;
    this.height = height;
    this.cellSize = cellSize;
    this.initCells();
    this.display();
  }

  initCells() {
    for (let i = 0; i < this.width; i++) {
      let newCol = [];
      for (let j = 0; j < this.height; j++) {
        let newCell = new Cell(
          i * this.cellSize,
          j * this.cellSize,
          this.cellSize
        );
        newCol.push(newCell);
      }
      this.cells.push(newCol);
    }

    // asign neighbors
    const iLen = this.cells.length;
    const jLen = this.cells[0].length;
    for (let i = 0; i < this.width; i++) {
      for (let j = 0; j < this.height; j++) {
        const upI = j == 0 ? jLen - 1 : j - 1;
        const doI = j == jLen - 1 ? 0 : j + 1;
        const leI = i == 0 ? iLen - 1 : i - 1;
        const riI = i == iLen - 1 ? 0 : i + 1;

        const UP = this.cells[i][upI];
        const DOWN = this.cells[i][doI];
        const LEFT = this.cells[leI][j];
        const RIGHT = this.cells[riI][j];
        const UPLEFT = this.cells[leI][upI];
        const UPRIGHT = this.cells[riI][upI];
        const DOLEFT = this.cells[leI][doI];
        const DOWNRIGHT = this.cells[riI][doI];

        this.cells[i][j].neighbors.push(UP);
        this.cells[i][j].neighbors.push(DOWN);
        this.cells[i][j].neighbors.push(LEFT);
        this.cells[i][j].neighbors.push(RIGHT);
        this.cells[i][j].neighbors.push(UPLEFT);
        this.cells[i][j].neighbors.push(UPRIGHT);
        this.cells[i][j].neighbors.push(DOLEFT);
        this.cells[i][j].neighbors.push(DOWNRIGHT);
      }
    }
  }

  display() {
    this.cells.forEach((row) => {
      row.forEach((cell) => {
        cell.display();
      });
    });

    this.cells.forEach((row) => {
      row.forEach((cell) => {
        cell.calulateNextGen();
      });
    });

    this.cells.forEach((row) => {
      row.forEach((cell) => {
        cell.displayNextGen();
      });
    });
  }
}

class Cell {
  state = false;
  neighbors = [];
  nextGen = false;
  constructor(x, y, size) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.state = false;
    this.rVal = Math.random() * 155 + 100;
    this.gVal = Math.random() * 155 + 100;
    this.bVal = Math.random() * 155 + 100;
  }

  display() {
    if (this.state) {
      ctx.fillStyle = `rgba(${this.rVal}, ${this.gVal}, ${this.bVal}, 1)`;
    } else {
      ctx.fillStyle = "white";
    }
    ctx.beginPath();
    ctx.lineWidth = "1";
    ctx.rect(this.x, this.y, this.size, this.size);
    // ctx.fillStyle = "blue";
    ctx.fill();
  }

  calulateNextGen() {
    let nCount = 0;
    this.neighbors.forEach((neigh) => {
      neigh.state == true ? nCount++ : null;
    });
    if (this.state) {
      if (nCount < 2) {
        this.nextGen = false;
      } else if (nCount == 2 || nCount == 3) {
        this.nextGen = true;
      } else {
        this.nextGen = false;
      }
    } else {
      if (nCount == 3) {
        this.nextGen = true;
      }
    }
  }

  displayNextGen() {
    this.state = this.nextGen;
  }
}

const newCanvas = (width, height) => {
  const body = document.getElementsByTagName("body")[0];
  body.style.margin = "0";
  body.style.padding = "0";
  const cnv = document.createElement("canvas");
  cnv.width = width;
  cnv.height = height;
  body.appendChild(cnv);
  ctx = cnv.getContext("2d");
};

const lerp = (a, b, t) => {
  return (1 - t) * a + t * b;
};

let millis = 30;

setup(500, 500, 10);

grid.cells[19][21].state = true;
grid.cells[20][21].state = true;
grid.cells[20][22].state = true;
grid.cells[21][22].state = true;
grid.cells[20][23].state = true;
