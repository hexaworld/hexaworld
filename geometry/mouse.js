var circle = require('./circle.js')

module.exports = function (opts) {
  opts = opts || {}

  return circle({
    translation: opts.translation,
    rotation: opts.rotation,
    fill: opts.fill,
    stroke: opts.stroke,
    scale: opts.scale,
    thickness: opts.thickness,
    children: [
      circle({
        fill: opts.fill, stroke: opts.stroke, thickness: opts.thickness,
        translation: [-0.7, -0.9], scale: 0.6, rotation: -45, aspect: 0.6
      }),
      circle({
        fill: opts.fill, stroke: opts.stroke, thickness: opts.thickness,
        translation: [0.7, -0.9], scale: 0.6, rotation: 45, aspect: 0.6
      })
    ]
  })
}
