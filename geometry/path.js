var Geometry = require('./geometry.js')

module.exports = function (opts) {
  opts = opts || {}
  var width = opts.scale || 0.25

  return new Geometry({
    props: {
      fill: 'rgb(55,55,55)',
      thickness: opts.thickness || 0.25,
      type: 'polygon',
      color: [80, 80, 80],
      surface: true,
      height: 4,
      lit: true
    },

    points: [
      [-1 / 2, Math.sqrt(3) / 2], 
      [1 / 2, Math.sqrt(3) / 2], 
      [1 / 2, Math.sqrt(3) / 2 / width],
      [-1 / 2, Math.sqrt(3) / 2 / width]
    ],

    transform: {
      scale: width,
      rotation: opts.rotation || 0
    },

    children: opts.children
  })
}
