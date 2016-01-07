var Geometry = require('./geometry.js')

module.exports = function (opts) {
  opts = opts || {}

  return new Geometry({
    props: {
      thickness: opts.thickness,
      fill: opts.fill,
      type: 'polygon',
      surface: true,
      dynamic: true
    },

    points: [
      [-1.05, 0.8], [1.05, 0.8], [0, -1.5]
    ],

    transform: {
      scale: opts.scale,
      rotation: opts.rotation,
      translation: opts.translation
    },

    children: [
      new Geometry({
        points: [[0, -4], [0, 30]],
        props: {}
      })
    ]
  })
}
