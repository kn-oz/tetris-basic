"use strict";

class Board {
    constructor(cntxt, cntxtNext) {
        this.cntxt = cntxt;
        this.cntxtNext = cntxtNext;
        this.grid = this.getEmptyBoard();
        this.setNextPiece();
        this.setCurrentPiece();
    }

    setNextPiece() {
        const {width, height} = this.cntxtNext.canvas;
        this.nextPiece = new Piece(this.cntxtNext);
        this.cntxtNext.clearRect(0, 0, width, height);
        this.nextPiece.draw();
    }

    setCurrentPiece() {
        this.piece = this.nextPiece;
        this.piece.cntxt = this.cntxt;
        this.piece.x = 3;
        this.setNextPiece();
    }

    getEmptyBoard() { // get matrix filled with zeroes.
        return Array.from(
          {length: ROWS}, () => Array(COLS).fill(0)  
        );
      }

    rotateClock(p) { //using properties of matrix to rotate the matrix, p is the piece
        for (let y = 0; y < p.shape.length; ++y) {
            for (let x = 0; x < y; ++x) {
                [p.shape[x][y], p.shape[y][x]] = [p.shape[y][x], p.shape[x][y]]; //transpose matrix
            }
        }
        p.shape.forEach(row => row.reverse()); //reverse the elements in each row

        //transposing a matrix and then reversing the order of each column which were rows before transpose
        //rotates the matrix in clockwise direction
    }

    isInsideWalls(x, y) {
        return (x >= 0 && x < COLS && y < ROWS);
    }

    isVacant(x, y) {
        return this.grid[y] && this.grid[y][x] === 0;
    }

    isValid(p) {
        return p.shape.every((row, dy) => {
            return row.every((value, dx) => {
                return (value === 0 || (this.isInsideWalls(p.x + dx, p.y + dy) && this.isVacant(p.x + dx, p.y + dy)));
            });
        });
    }

    drop() {
        let p = JSON.parse(JSON.stringify(this.piece));
        p.y += 1;
    
        if (this.isValid(p)) {
            this.piece.move(p.x, p.y, p.shape);
        } else {
            this.freeze();
            this.clearLines();
            if (this.piece.y === 0) {
                return false;  //game over
            }
            this.setCurrentPiece();
        }

        return true;
    }

    freeze() { 
        this.piece.shape.forEach((row, y) => {  
          row.forEach((value, x) => {
           let i = this.piece.y + y;
           let j = this.piece.x + x;  
            if (value > 0) { 
              this.grid[i][j] = value;  
            }  
          });  
        }); 
    }

    clearLines() {
        let lines = 0;
        this.grid.forEach((row, y) => {
            if (row.every(value => value > 0)) { //the line is full
                this.grid.splice(y, 1); //removing the line
                ++lines;
                this.grid.unshift(Array(COLS).fill(0));//adding a new line filled with zeroes at the top
            }
        });

        account.lines += lines;  //update the number of lines cleared on board
        let level = account.level; //get current level to calculate score accordingly

        if (lines > 0) {
            switch(lines) {
                case 1:
                    account.score += (POINTS.SINGLE * (account.level + 1));
                    break;
                case 2:
                    account.score += (POINTS.DOUBLE * (account.level + 1));
                    break;

                case 3:
                    account.score += (POINTS.TRIPLE * (account.level + 1));
                    break;

                case 4:
                    account.score += (POINTS.TETRIS * (account.level + 1));
                    break;
            }
        }

        level = Math.min(Math.floor(account.lines / linesPerLevel, 13)); //updating the level

        account.level = level; //displaying the updated level on board

        time.level = LEVEL[level]; //setting the new time to drop for new level
    }

    draw() { //drawing the board with all the pieces
        this.grid.forEach((row, y) => {
          row.forEach((value, x) => {
              if (value > 0) {
                  this.cntxt.fillStyle = COLORS[value - 1];
                  this.cntxt.fillRect(x , y, 1, 1);
                }
           });
      });
    }
}