// canvas
var WIDTH = 1080;
var HEIGHT = 720;

// game-logic
var gameOver = false;

// field
var fieldMarginTop = 10;
var fieldMarginLeft = 40;
var fieldHeight = HEIGHT - 2 * fieldMarginTop;
var fieldWidth = WIDTH - 2 * fieldMarginLeft;

// holes
var holeRowCount = 6;
var holeColumnCount = 7;
var holeWidth = fieldWidth / holeColumnCount;
var holeHeight = fieldHeight / holeRowCount;
var holeOffsetTop = holeHeight / 6;
var holeOffsetLeft = holeWidth / 6;
var holeRadius = holeWidth / 2 - holeOffsetLeft;

// player
var turnCount = 0;
var winner = "";

// holes and discs
var holes = [];
var discs = [];


function setup() {
  createCanvas(WIDTH, HEIGHT);
  initArrays();
  drawField();
  drawHoles();
}

function draw() {
  if(gameOver === true){
    clear();
    fill(0);
    textSize(40);
    text(winner.charAt(0).toUpperCase() + winner.slice(1) + " won the game!", 50, 100);
  }
}

function mousePressed(){
  for (var r=0; r<holeRowCount; r++){
    for (var c=0; c<holeColumnCount; c++){
      // distance between a hole-object and the mouse
      // d = sqrt(pow(abs(holes[r][c].x - mouseX), 2) + pow(abs(holes[r][c].y - mouseY), 2));
      d = dist(mouseX, mouseY, holes[r][c].x, holes[r][c].y);
      if (d <= holeRadius && (holes[r][c].row === holeRowCount || holes[r+1][c].isFilled === true) && holes[r][c].isFilled === false){
        holes[r][c].isFilled = true;
        // every second hole is filled red, the other are filled yellow
        if (turnCount % 2 === 0){
          holes[r][c].colored = "red";
        }
        else{
          holes[r][c].colored = "yellow";
        }
        turnCount++;
        drawHoles();
        updateDiscs();
        gameLogic();
      }
    }
  }
}

function initArrays(){
  for (var r=0; r<holeRowCount; r++){
      holes[r] = [];
      discs[r] = [];
      for (var c=0; c<holeColumnCount; c++){
          holes[r][c] = { x : fieldMarginLeft + holeWidth/2 + c*holeWidth,
                          y : fieldMarginTop + holeHeight/2 + r*holeHeight,
                          row : r + 1,
                          column : c + 1,
                          isFilled: false,
                          colored: 'white'};
          discs[r][c] = 0;
      }
  }
}

function drawField(){
  fill(0, 0, 255);
  strokeWeight(3);
  rect(fieldMarginLeft, fieldMarginTop, fieldWidth, fieldHeight, 50, 50, 0, 0);
}

function drawHoles(){
  for (var r=0; r<holeRowCount; r++){
    for (var c=0; c<holeColumnCount; c++){
      fill(holes[r][c].colored);
      ellipse(holes[r][c].x, holes[r][c].y, 2 * holeRadius, 2 * holeRadius);
    }
  }
}

function updateDiscs(){
  for (var r=0; r<holeRowCount; r++){
    for (var c=0; c<holeColumnCount; c++){
      switch(holes[r][c].colored){
        case 'white':
          discs[r][c] = 0;
          break;
        case 'red':
          discs[r][c] = 1;
          break;
        case 'yellow':
          discs[r][c] = 2;
          break;
      }
  }
}
}

function gameLogic(){
  // checks if there are 4 discs of the same color vertically
  for (var r=0; r<holeRowCount-3; r++){
    for (var c=0; c<holeColumnCount; c++){
      if (holes[r][c].isFilled === true &&
         (discs[r][c] === discs[r+1][c])&&
         (discs[r][c] === discs[r+2][c])&&
         (discs[r][c] === discs[r+3][c])){
        gameOver = true;
        winner = holes[r][c].colored;
      }
    }
  }
  // checks if there are 4 discs of the same color horizontally
  for (r=0; r<holeRowCount; r++){
    for (c=0; c<=holeColumnCount-4; c++){
      if (holes[r][c].isFilled === true &&
         (discs[r][c] === discs[r][c+1])&&
         (discs[r][c] === discs[r][c+2])&&
         (discs[r][c] === discs[r][c+3])){
        gameOver = true;
        winner = holes[r][c].colored;
      }
    }
  }
  // checks if there are 4 discs of the same color diagonally
  for (c=0; c<=holeColumnCount-4; c++){
    // check for left/top to right/bottom
    for (r=0; r<=holeRowCount-4; r++){
      if (holes[r][c].isFilled === true &&
         (discs[r][c] === discs[r+1][c+1])&&
         (discs[r][c] === discs[r+2][c+2])&&
         (discs[r][c] === discs[r+3][c+3])){
        gameOver = true;
        winner = holes[r][c].colored;
      }
    }
    // check for left/bottom to right/top
    for (r=holeRowCount-3; r<=holeRowCount-1; r++){
      if (holes[r][c].isFilled === true &&
         (discs[r][c] === discs[r-1][c+1])&&
         (discs[r][c] === discs[r-2][c+2])&&
         (discs[r][c] === discs[r-3][c+3])){
        gameOver = true;
        winner = holes[r][c].colored;
      }
    }
  }
}
