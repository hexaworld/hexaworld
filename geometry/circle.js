var Geometry = require('./geometry.js')

module.exports = function (opts) {
  opts = opts || {}
  var aspect = opts.aspect || 1

  return new Geometry({
    props: {
      fill: opts.fill,
      stroke: opts.stroke,
      thickness: opts.thickness,
      shadow: opts.shadow || {},
      type: 'bezier',
      cue: opts.cue || false,
      target: opts.target || false,
      consumable: opts.consumable || false
    },

    points: [
      [0, -1], [aspect * 0.55, -1], [aspect, -0.55],
      [aspect, 0], [aspect, 0.55], [aspect * 0.55, 1],
      [0, 1], [-aspect * 0.55, 1], [-aspect, 0.55],
      [-aspect, 0], [-aspect, -0.55], [-aspect * 0.55, -1]
    ],

    transform: {
      scale: opts.scale || 1,
      translation: opts.translation || [0, 0],
      rotation: opts.rotation || 0
    },

    children: opts.children
  })
}
