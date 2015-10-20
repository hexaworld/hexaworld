var tile = require('./tile.js')

module.exports = World

function World() {
  var opts1 = {position: { r: 0, q: 0}}
  var opts2 = {position: { r: 0, q: 1}}
  var opts3 = {position: { r: 1, q: 0}}
  var opts4 = {position: { r: 1, q: 1}}
  this.tiles = [new tile(opts1), new tile(opts2), new tile(opts3), new tile(opts4)]
}

World.prototype.render = function(context, camera) {
  // figure out which tiles to show given the camera position
  this.tiles.forEach(function (tile) {
    tile.render(context, camera)
  })
}

World.prototype.boundaries = function(camera) {
  // figure out which tiles to check given the camera position
  // for those tiles, check whether we're intersecting the bounding boxes of any objects
}