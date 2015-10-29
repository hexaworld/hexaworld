var Geometry = require('../geometry.js')

module.exports = function (opts) {
  opts = opts || {}

  return new Geometry({
    props: {
      fill: opts.fill || '#DFE0E2',
      stroke: opts.stroke || '#DFE0E2',
      type: 'circle'
    },

    shape: {
      position: [0, 0],
      scale: 1,
      angle: 0
    },

    transform: {
      scale: opts.scale
    },

    children: opts.children
  })

} 