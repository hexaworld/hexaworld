var _ = require('lodash')
var Geometry = require('../geometry.js')

module.exports = function (opts) {
  opts = opts || {}
  
  return new Geometry({
    props: {
      fill: opts.fill || '#A5A5A5',
      stroke: opts.stroke || '#A5A5A5',
      type: 'polygon'
    },

    transform: {
      position: [
        opts.scale * 3/2 * opts.position[0], 
        opts.scale * Math.sqrt(3) * (opts.position[1] + opts.position[0]/2)
      ],
      scale: opts.scale
    },

    shape: _.range(7).map(function (i) {
      var dx = Math.cos(i * 2 * Math.PI / 6)
      var dy = Math.sin(i * 2 * Math.PI / 6)
      return [dx, dy]
    }),

    children: opts.children
  })

}