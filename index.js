var schema = [
  {position: [0, 0], paths: [0, 2, 4], cue: '#64FF00'},
  {position: [-1, 0], paths: [0, 4, 5], cue: '#00C3EE'},
  {position: [0, 1], paths: [2, 3, 4]},
  {position: [-1, 1], paths: [4, 5], cue: '#FF8900'},
  {position: [1, -1], paths: [2, 3]},
  {position: [1, 0], paths: [1, 3]},
  {position: [0, -1], paths: [1, 3, 5]},
  {position: [0, -2], paths: [0, 5]},
  {position: [1, -2], paths: [0, 2], cue: '#FF5050'}
]

var createGame = require('./game.js')
createGame('game', schema, { width: 700, height: 700 })
