var schema = {
  tiles: [
    {translation: [0, 0], paths: [0, 2, 4], cue: {fill: '#DE863A'}},
    {translation: [-1, 0], paths: [0, 4, 5], cue: {fill: '#00C3EE'}},
    {translation: [0, 1], paths: [2, 3, 4], target: {fill: '#white'}},
    {translation: [-1, 1], paths: [4, 5], cue: {fill: '#82C94A'}},
    {translation: [1, -1], paths: [2, 3]},
    {translation: [1, 0], paths: [1, 3]},
    {translation: [0, -1], paths: [1, 3, 5]},
    {translation: [0, -2], paths: [0, 5]},
    {translation: [1, -2], paths: [0, 2], cue: {fill: '#CF5557'}}
  ],
  players: [
    {translation: [0, 0], character: 'mouse'}
  ],
  gameplay: {timeout: 60}
}

var game = require('./game.js')
game('game-container', schema)
