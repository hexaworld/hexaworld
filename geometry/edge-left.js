var Geometry = require('./geometry.js')

module.exports = function (opts) {
  opts = opts || {}
  var width = opts.scale || 0.25

  return new Geometry({
    props: {
      stroke: 'rgb(255,255,255)',
      thickness: opts.thickness || 0.25,
      type: 'polygon',
      color: [55, 55, 55],
      surface: true,
      height: 4.2,
      bottom: -0.2,
      lit: true
    },

    points: [
      [-1 / 2, Math.sqrt(3) / 2], 
      [-1 / 2, Math.sqrt(3) / 2 / width]
    ],

    transform: {
      scale: width,
      rotation: opts.rotation || 0
    },

    children: opts.children
  })
}
