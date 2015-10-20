aabb = require('aabb-2d')
_ = require('lodash')

module.exports = Path

function Path(options){
  this.position = 0
  this.type = 'path'
  this.size = options.size || 50
  this.color = options.color || '#DFE0E2s'
}

Path.prototype.boundaries = function(position) {
	// figure out rectangle given tile and position in pixel space
	//var bbox = aabb([position.x, this.position.y], [this.size.x, this.size.y]);
}

Path.prototype.render = function(camera, context, position) {
	console.log(position)
	context.fillStyle = this.size
  	context.fillRect(position.x, position.y, this.size, this.size)
}
