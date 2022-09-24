"use strict";


let requestId = null; 

let time = { start: 0, elasped: 0, level: 700 };
let board = null;

const playPauseButton = document.getElementById("toggle-pause");

let paused = false;

let gameStarted = false;

let accountValues = {
    score: 0,
    lines: 0,
    level: 0
};

let scoreHandler = {
    set: (target, key, value) => {
        target[key] = value;
        updateAccount(key, value);
        return true;
    }
};

let account = new Proxy(accountValues, scoreHandler); //proxy handler, the updateAccount automatically updates score, lines and level on board whenever a new value is assigned

function updateAccount(key, value) {
    let element = document.getElementById(key);
    if (element) element.textContent = value;
}

function play() {
    board = new Board(cntxt, cntxtNext);
    listenforKeyDown();

    if (requestId) {
        cancelAnimationFrame(requestId);
    }
    gameStarted = true;
    paused = false;
    playPauseButton.textContent = "Pause";

    while(history.length > 0) {
        history.pop();
    }

   resetGame();

   time.start = performance.now();
   animate(0);
}

function animate(now) {
    if (!paused) { 
     time.elasped = now - time.start;
 
     if (time.elasped > time.level) {
         time.start = now;
         
         if(!board.drop()) {
             gameOver();
             return;
         }
     }
    }
 
     paint();
 
     requestId = requestAnimationFrame(animate); //renders the frame matching displays refresh rate
 }
 


function listenforKeyDown() {
    document.removeEventListener('keydown', handleKeyDown);
    document.addEventListener('keydown', handleKeyDown);
}

function handleKeyDown(event) {
    event.preventDefault(); //prevent default keyboard actions like moving the page down on pressing arrow-down

    if (!paused) {
    
    let keyValue = event.key;

    let p = JSON.parse(JSON.stringify(board.piece)); //deep copy the piece object to avoid changing the state of piece without validating

    if (keyValue === "ArrowDown") {
        p.y += 1;
        account.score += POINTS.SOFTDROP;

    } else if (keyValue === "ArrowLeft") {
        p.x -= 1;

    } else if (keyValue === "ArrowRight") {
        p.x += 1;

    } else if (keyValue === "ArrowUp") {
        board.rotateClock(p);
    } else if (keyValue === " " || keyValue === "Spacebar") {
        while (board.isValid(p)) {
            account.score += POINTS.HARDDROP;
            board.piece.move(p.x, p.y, p.shape);
            p.y += 1;
        }
    }

    if (board.isValid(p)) {
        board.piece.move(p.x, p.y, p.shape);
    }

    paint();

   }

   return false;
}


function paint() {
    const { width, height } = cntxt.canvas;
    cntxt.clearRect(0, 0, width, height);
    board.draw();

    board.piece.draw();
}

function togglePause() {
   if (gameStarted) {
    if (paused) {
        paused = false;
        playPauseButton.textContent = "Pause";
    } else {
        paused = true;
        playPauseButton.textContent = "Resume";
    }
   } else {
       play();
   }
}

function resetGame() {
    account.score = 0;
    account.lines = 0;
    account .level = 0;
    time.start = performance.now();
    time.elasped = 0;
    time.level = LEVEL[0];
}


function gameOver() {
    cancelAnimationFrame(requestId);
    cntxt.fillStyle = "black";
    cntxt.fillRect(1, 3, 8, 1.2);
    cntxt.font = "1px Arial";
    cntxt.fillStyle = "red";
    cntxt.fillText("GAME OVER", 1.8, 4);
}