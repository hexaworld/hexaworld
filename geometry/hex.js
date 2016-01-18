var _ = require('lodash')
var Geometry = require('./geometry.js')

module.exports = function (opts) {
  opts = opts || {}

  return new Geometry({
    props: {
      type: 'polygon',
      fill: opts.fill,
      stroke: opts.stroke,
      thickness: opts.thickness,
      color: opts.color,
      target: opts.target || false,
      cue: opts.cue || false,
      trigger: opts.trigger || false,
      surface: opts.surface || false,
      height: opts.height || 0,
      bottom: opts.bottom,
      lit: opts.lit || false,
      consumable: opts.consumable || false
    },

    points: _.range(7).map(function (i) {
      var dx = Math.cos(i * 2 * Math.PI / 6)
      var dy = Math.sin(i * 2 * Math.PI / 6)
      return [dx, dy]
    }),

    transform: {
      scale: opts.scale,
      rotation: opts.rotation,
      translation: opts.translation
    },

    children: opts.children
  })
}
