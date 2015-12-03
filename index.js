var schema = {
  tiles: [
    {translation: [0, 0], paths: [0, 2, 4], cue: '#64FF00'},
    {translation: [-1, 0], paths: [0, 4, 5], cue: '#00C3EE'},
    {translation: [0, 1], paths: [2, 3, 4]},
    {translation: [-1, 1], paths: [4, 5], cue: '#FF8900'},
    {translation: [1, -1], paths: [2, 3]},
    {translation: [1, 0], paths: [1, 3]},
    {translation: [0, -1], paths: [1, 3, 5]},
    {translation: [0, -2], paths: [0, 5]},
    {translation: [1, -2], paths: [0, 2], cue: '#FF5050'}
  ],
  players: [
    {translation: [0, 0], character: 'mouse'}
  ]
}

var createGame = require('./game.js')
createGame('game', schema, {width: 600, height: 600})
