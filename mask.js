var _ = require('lodash')

module.exports = Mask

function Mask(opts) {
  this.size = opts.size
  this.position = opts.position
  this.fill = opts.fill
  this.stroke = opts.stroke
  this.thickness = opts.thickness || 1
  this.orientation = opts.orientation || 'pointy'
}

Mask.prototype.set = function(context) {
  var self = this
  var offset = 0
  if (self.orientation == 'pointy') offset = Math.PI / 6
  context.save()
  context.beginPath()
  _.range(7).map(function(i) {
    var dx =  (Math.cos(i * 2 * Math.PI / 6 + offset)) * self.size
    var dy =  (Math.sin(i * 2 * Math.PI / 6 + offset)) * self.size
    context.lineTo(dx + self.position[0], dy + self.position[1])
  })
  context.fillStyle = self.fill
  context.strokeStyle = self.stroke
  context.lineWidth = self.thickness
  if (self.fill) context.fill()
  if (self.stroke) context.stroke()
  context.clip()
}

Mask.prototype.unset = function(context) {
  context.restore()
}