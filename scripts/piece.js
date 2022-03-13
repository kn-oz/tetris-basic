"use strict";

class Piece {
    constructor(cntxt) {
        this.cntxt = cntxt;
        let random = this.randomizeTetromino();
        this.color = COLORS[random];

        this.shape = SHAPES[random];

        this.x = 0;
        this.y = 0;
    }

    randomizeTetromino() {
        let random = Math.floor(Math.random() * 7);
        if (history.length === 0) {
            history.push(random);
            return random;
        } else {
            let count = 4;
            while (count > 0) {
                if (history.length > 4) {
                    history.shift()
                }

                let flag = history.every(value => value !== random);

                if (flag) {
                    history.push(random);
                    return random;
                }

                count--;

                random = Math.floor(Math.random() * 7);
            }

            return random;
        }
    }

    draw() {
        this.cntxt.fillStyle = this.color;

        this.shape.forEach((row, y) => {
            row.forEach((block, x) => {
                if (block > 0) {
                    this.cntxt.fillRect(this.x + x, this.y + y, 1, 1);
                }
            });
        });
    }

    move(x, y, shape) {
        this.x = x;
        this.y = y;
        this.shape = shape;
    }
}