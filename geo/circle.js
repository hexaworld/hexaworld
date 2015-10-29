var Geometry = require('../geometry.js')

module.exports = function (opts) {
  opts = opts || {}

  return new Geometry({
    props: {
      fill: opts.fill || '#DFE0E2',
      stroke: opts.stroke || '#DFE0E2',
      type: 'bezier'
    },

    points: [
      [0, -1], [0.55, -1], [1, -0.55],
      [1, 0], [1, 0.55], [0.55, 1],
      [0, 1], [-0.55, 1], [-1, 0.55],
      [-1, 0], [-1, -0.55], [-0.55, -1]
    ],

    transform: {
      scale: opts.scale
    },

    children: opts.children
  })

} 