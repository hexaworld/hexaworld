var Geometry = require('./geometry.js')

module.exports = function (opts) {
  opts = opts || {}
  var width = opts.scale || 0.25

  return new Geometry({
    props: {
      fill: 'rgb(55,55,55)',
      stroke: 'rgb(55,55,55)',
      thickness: 0,
      type: 'polygon',
      obstacle: true,
      surface: opts.surface || false,
      color: [55, 55, 55],
      lit: true,
      height: 4
    },

    points: [
      [-1 / 2, Math.sqrt(3) / 2],
      [-1 / 2, Math.sqrt(3) / 2 / width],
      [-2, Math.sqrt(3) / 2 / width],
      [1 / 4 - Math.sin(Math.PI / 3) * Math.sqrt(3) / 2 / width, 1 / 2 * Math.sin(Math.PI / 3) + 1 / 2 * Math.sqrt(3) / 2 / width]
    ],

    transform: {
      scale: width,
      rotation: opts.rotation || 0
    },

    children: opts.children
  })
}
