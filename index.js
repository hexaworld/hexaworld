var opts = {
  size: 700
}

var config = {
  name: 'welcome',
  lives: 3,
  steps: 6
}

var base = function (start) {
  return {
    tiles: [
      {translation: [0, 0], paths: [0, 2, 4], cue: {fill: '#DE863A', scale: 1}},
      {translation: [-1, 0], paths: [0, 4, 5], cue: {fill: '#00C3EE', scale: 1}},
      {translation: [0, 1], paths: [2, 3, 4], target: {fill: 'white'}},
      {translation: [-1, 1], paths: [4, 5], cue: {fill: '#82C94A', scale: 1}},
      {translation: [1, -1], paths: [2, 3]},
      {translation: [1, 0], paths: [1, 3]},
      {translation: [0, -1], paths: [1, 3, 5]},
      {translation: [0, -2], paths: [0, 5]},
      {translation: [1, -2], paths: [0, 2], cue: {fill: '#CF5557', scale: 1}}
    ],
    start: [{translation: start.translation, rotation: start.rotation}],
    target: [0, 1],
    flash: ['#FF5050', '#FF8900', '#00C3EE', '#64FF00'],
    message: 'welcome to hexaworld! try to find the big white circle'
  }
}

var maps = [
  base({translation: [0, -2], rotation: 180}),
  base({translation: [1, -1], rotation: 0}),
  base({translation: [0, -1], rotation: 0})
]

var level = {
  config: config,
  maps: maps
}

var game = require('./play.js')('container', level, opts)
game.start()