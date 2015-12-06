var _ = require('lodash')
var hex = require('./hex.js')
var wedge = require('./wedge.js')
var block = require('./block.js')
var end = require('./end.js')
var path = require('./path.js')
var circle = require('./circle.js')
var Geometry = require('./geometry.js')

module.exports = function (opts) {
  opts = opts || {}

  var thickness = opts.thickness

  var center = [
    hex({
      scale: 0.25,
      trigger: true,
      children: [
        circle({
          fill: 'white',
          stroke: 'white',
          thickness: opts.thickness,
          translation: [0, 0],
          scale: 0.06,
          consumable: true
        })
      ]
    })
  ]

  var wedges = _.range(6).map(function (i) {
    return wedge({rotation: i * 60})
  })
  var blocks = _.range(6).map(function (i) {
    if (!_.includes(opts.paths, i)) return block({rotation: i * 60})
  })
  _.remove(blocks, _.isUndefined)
  var ends = _.range(6).map(function (i) {
    if (!_.includes(opts.paths, i)) return end({rotation: i * 60, thickness: thickness})
  })
  _.remove(ends, _.isUndefined)
  var paths = _.range(6).map(function (i) {
    if (_.includes(opts.paths, i)) {
      return path({
        rotation: i * 60,
        thickness: thickness,
        children: [
          circle({
            fill: 'white', stroke: 'white', thickness: opts.thickness,
            translation: [0, 1], scale: 0.06, consumable: true
          }),
          circle({
            fill: 'white', stroke: 'white', thickness: opts.thickness,
            translation: [0, 2], scale: 0.06, consumable: true
          }),
          circle({
            fill: 'white', stroke: 'white', thickness: opts.thickness,
            translation: [0, 3], scale: 0.06, consumable: true
          })
        ]
      })
    }
  })
  _.remove(paths, _.isUndefined)

  var children = center.concat(wedges).concat(blocks).concat(ends).concat(paths)

  return new Geometry({
    props: {
      type: 'polygon'
    },

    points: _.range(7).map(function (i) {
      var dx = Math.cos(i * 2 * Math.PI / 6)
      var dy = Math.sin(i * 2 * Math.PI / 6)
      return [dx, dy]
    }),

    transform: {
      translation: [
        opts.scale * 3 / 2 * opts.translation[0],
        opts.scale * Math.sqrt(3) * (opts.translation[1] + opts.translation[0] / 2)
      ],
      scale: opts.scale
    },

    children: opts.children ? opts.children.concat(children) : children
  })
}
