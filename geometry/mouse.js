var Geometry = require('./geometry.js')

module.exports = function (opts) {
  opts = opts || {}

  return new Geometry({
    props: {
      thickness: opts.thickness,
      fill: opts.fill,
      type: 'polygon',
      surface: true,
      dynamic: true,
      color: [250, 250, 250],
      lit: false,
      height: 5.2,
      bottom: 4.3
    },

    points: [
      [-0.6, 0.6], [0.6, 0.6], [0, -0.6]
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
