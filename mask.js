var _ = require('lodash')

module.exports = Mask

function Mask(opts) {
  this.size = opts.size
  this.position = opts.position
  this.fill = opts.fill || 'rgb(210,210,210)'
}

Mask.prototype.set = function(context) {
  var self = this
  context.save()
  context.beginPath()
  context.moveTo(0, 0)
  _.range(7).map(function(i) {
    var dx =  (Math.cos(i * 2 * Math.PI / 6)) * self.size
    var dy =  (Math.sin(i * 2 * Math.PI / 6)) * self.size
    context.lineTo(dx + self.position[0], dy + self.position[1])
  })
  context.fillStyle = self.fill
  context.fill()
  context.clip()
}

Mask.prototype.unset = function(context) {
  context.restore()
}