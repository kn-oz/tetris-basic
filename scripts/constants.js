"use strict";

const COLORS = [
    '#DC143C',
    '#483D8B',
    '#7CFC00',
    '#FF7F50',
    '#8A2BE2',
    '#00BFFF',
    '#FFD700'
]

const SHAPES = [
    [
        [0, 0, 0, 0],
        [1, 1, 1, 1],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
    ],
    [
        [2, 0, 0],
        [2, 2, 2],
        [0, 0, 0]
    ],
    [
        [0, 0, 3],
        [3, 3, 3],
        [0, 0, 0]
    ],
    [
        [4, 4],
        [4, 4]
    ],
    [
        [0, 5, 5],
        [5, 5, 0],
        [0, 0, 0]
    ],
    [
        [6, 6, 0],
        [0, 6, 6],
        [0, 0, 0],
    ],
    [
        [0, 7, 0],
        [7, 7, 7],
        [0, 0, 0]
    ]
];


const history = [];


const COLS = 10;
const ROWS = 20;
const BLOCK_SIZE = 30;

const canvas = document.getElementById("board");

const cntxt = canvas.getContext("2d");

cntxt.canvas.width = COLS * BLOCK_SIZE;
cntxt.canvas.height = ROWS * BLOCK_SIZE;

cntxt.scale(BLOCK_SIZE, BLOCK_SIZE);

const POINTS = {
    SINGLE: 100,
    DOUBLE: 300,
    TRIPLE: 500,
    TETRIS: 800,
    SOFTDROP: 1,
    HARDDROP: 2
};

const linesPerLevel = 10;

const LEVEL = [
    700,
    650,
    600,
    550,
    500,
    450,
    400,
    350,
    300,
    250,
    200,
    150,
    100
];

Object.freeze(POINTS);
Object.freeze(LEVEL);


const canvasNext = document.getElementById("next");
const cntxtNext = canvasNext.getContext("2d");

cntxtNext.canvas.width = 4 * BLOCK_SIZE;
cntxtNext.canvas.height = 4 * BLOCK_SIZE;

cntxtNext.scale(BLOCK_SIZE, BLOCK_SIZE);
