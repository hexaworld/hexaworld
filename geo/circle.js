var Geometry = require('../geometry.js')

module.exports = function (opts) {
  opts = opts || {}
  var aspect = opts.aspect || 1

  return new Geometry({
    props: {
      fill: opts.fill || '#7D7D7D',
      stroke: opts.stroke || '#7D7D7D',
      thickness: opts.thickness || 1,
      shadow: opts.shadow || {},
      type: 'bezier'
    },

    points: [
      [0, -1], [aspect*0.55, -1], [aspect, -0.55],
      [aspect, 0], [aspect, 0.55], [aspect*0.55, 1],
      [0, 1], [-aspect*0.55, 1], [-aspect, 0.55],
      [-aspect, 0], [-aspect, -0.55], [-aspect*0.55, -1]
    ],

    transform: {
      scale: opts.scale || 1,
      position: opts.position || [0, 0],
      angle: opts.angle || 0
    },

    children: opts.children,

    trigger: true
  })

} 