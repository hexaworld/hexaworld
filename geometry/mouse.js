var Geometry = require('./geometry.js')
var circle = require('./circle.js')

module.exports = function (opts) {
  opts = opts || {}

  var children = [
    circle({
      fill: opts.fill, stroke: opts.stroke, thickness: opts.thickness,
      translation: [-0.7, -0.2], scale: 0.45, rotation: -45, aspect: 1
    }),
    circle({
      fill: opts.fill, stroke: opts.stroke, thickness: opts.thickness,
      translation: [0.7, -0.2], scale: 0.45, rotation: 45, aspect: 1
    })
  ] 

  return new Geometry({
    props: {
      stroke: opts.stroke,
      thickness: opts.thickness,
      fill: opts.fill,
      type: 'polygon'
    },

    points: [
      [-1.25, 1], [1.25, 1], [0, -1.75]
    ],

    transform: {
      scale: opts.scale,
      rotation: opts.rotation,
      translation: opts.translation
    }
  })

}
