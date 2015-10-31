var _ = require('lodash')
var wedge = require('./wedge.js')
var Geometry = require('../geometry.js')

module.exports = function (opts) {
  opts = opts || {}
  children = [
    wedge({angle: 0}), wedge({angle: 60}), wedge({angle: 120}), 
    wedge({angle: 180}), wedge({angle: 240}), wedge({angle: 300})
  ]
  
  return new Geometry({
    props: {
      fill: opts.fill || '#DFE0E2',
      stroke: opts.stroke || '#DFE0E2',
      type: 'polygon'
    },

    points: _.range(7).map(function (i) {
      var dx = Math.cos(i * 2 * Math.PI / 6)
      var dy = Math.sin(i * 2 * Math.PI / 6)
      return [dx, dy]
    }),

    transform: {
      position: [
        opts.scale * 3/2 * opts.position[0], 
        opts.scale * Math.sqrt(3) * (opts.position[1] + opts.position[0]/2)
      ],
      scale: opts.scale
    },

    children: opts.children ? children.concat(opts.children) : children
  })

}