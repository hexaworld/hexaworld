var transform = require('transformist')
var Geometry = require('./geometry.js')

module.exports = function (opts) {
  opts = opts || {}

  var height = opts.size * Math.sqrt(3) / 2
  var outer = height + opts.extent
  var inner = height

  var o = opts.offset || 1
  var n = opts.count
  var t = transform({rotation: -(2 * (60 / n) - o)})

  var start = 120
  var end = 120 - (60 / n) + o / 2

  return new Geometry({
    props: {
      fill: 'rgb(50,50,50)',
      stroke: 'white',
      thickness: 3,
      type: 'polygon'
    },

    points: [
      t.apply([[outer / Math.tan(end * Math.PI / 180), -outer]])[0],
      [outer / Math.tan(start * Math.PI / 180), -outer],
      [outer / Math.tan(end * Math.PI / 180), -outer],
      [inner / Math.tan(end * Math.PI / 180), -inner],
      [inner / Math.tan(start * Math.PI / 180), -inner],
      t.apply([[inner / Math.tan(end * Math.PI / 180), -inner]])[0]
    ],

    transform: {
      scale: 1,
      rotation: opts.rotation,
      translation: opts.translation
    }
  })
}
