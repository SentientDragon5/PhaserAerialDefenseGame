// Jim Whitehead
// Created: 4/14/2024
// Phaser: 3.70.0
//
// Cubey
//
// An example of putting sprites on the screen using Phaser
// 
// Art assets from Kenny Assets "Shape Characters" set:
// https://kenney.nl/assets/shape-characters

// debug with extreme prejudice
"use strict"

var canvas_x = 800;
var canvas_y = 600;

// game config
let config = {
    parent: 'phaser-game',
    type: Phaser.CANVAS,
    render: {
        pixelArt: true  // prevent pixel art from getting blurred when scaled
    },
    width: canvas_x,
    height: canvas_y,
    backgroundColor: "#84bfe0",
    scene: [Start,Game,Win,Lose],
    fps: { forceSetTimeOut: true, target: 30 }
}

// Global variable to hold sprites
var my = {sprite: {}};
var score = 0;

const game = new Phaser.Game(config);
