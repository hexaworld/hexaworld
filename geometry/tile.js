var _ = require('lodash')
var hex = require('./hex.js')
var wedge = require('./wedge.js')
var block = require('./block.js')
var end = require('./end.js')
var path = require('./path.js')
var edgeLeft = require('./edge-left.js')
var edgeRight = require('./edge-right.js')
var edgeBottom = require('./edge-bottom.js')
var edgeTop = require('./edge-top.js')
var circle = require('./circle.js')
var Geometry = require('./geometry.js')

module.exports = function (opts) {
  opts = opts || {}

  var thickness = opts.thickness

  var center = [
    hex({
      scale: 0.25,
      trigger: true,
      surface: true,
      height: 4,
      lit: true,
      fill: 'rgb(55,55,55)',
      color: [90, 90, 90]
    })
  ]

  var wedges = _.range(6).map(function (i) {
    return wedge({
      rotation: i * 60,
      surface: opts.surface || false
    })
  })
  var blocks = _.range(6).map(function (i) {
    if (!_.includes(opts.paths, i)) return block({
      rotation: i * 60,
      surface: opts.surface || false
    })
  })
  _.remove(blocks, _.isUndefined)
  var ends = _.range(6).map(function (i) {
    if (!_.includes(opts.paths, i)) return end({rotation: i * 60, thickness: thickness})
  })
  _.remove(ends, _.isUndefined)
  var paths = _.range(6).map(function (i) {
    if (_.includes(opts.paths, i)) {
      children = [
        circle({
          fill: 'white', 
          thickness: opts.thickness,
          translation: [0, 1.5], 
          scale: 0.06, 
          consumable: true,
          surface: true,
          height: 4.3,
          bottom: 4.1,
          color: [255,255,255],
          lit: true
        }),
        circle({
          fill: 'white', 
          thickness: opts.thickness,
          translation: [0, 2], 
          scale: 0.06, 
          consumable: true,
          surface: true,
          height: 4.3,
          bottom: 4.1,
          color: [255,255,255],
          lit: true
        }),
        circle({
          fill: 'white', 
          thickness: opts.thickness,
          translation: [0, 2.5], 
          scale: 0.06, 
          consumable: true,
          surface: true,
          height: 4.3,
          bottom: 4.1,
          color: [255,255,255],
          lit: true
        })
      ]
      return path({
        rotation: i * 60,
        thickness: thickness,
        children: children
      })
    }
  })
  _.remove(paths, _.isUndefined)

  var left = _.range(6).map(function (i) {
    if (_.includes(opts.paths, i)) {
      return edgeLeft({
        rotation: i * 60,
        thickness: thickness
      })
    }
  })
  _.remove(left, _.isUndefined)

  var right = _.range(6).map(function (i) {
    if (_.includes(opts.paths, i)) {
      return edgeRight({
        rotation: i * 60,
        thickness: thickness
      })
    }
  })
  _.remove(right, _.isUndefined)

  var bottom = _.range(6).map(function (i) {
    if (!_.includes(opts.paths, i)) {
      return edgeBottom({
        rotation: i * 60,
        thickness: thickness
      })
    }
  })
  _.remove(bottom, _.isUndefined)

  var top = _.range(6).map(function (i) {
    if (!_.includes(opts.paths, i) & !_.includes(opts.hide, i)) {
      return edgeTop({
        rotation: i * 60,
        thickness: thickness
      })
    }
  })
  _.remove(top, _.isUndefined)
  
  var children = center.concat(wedges).concat(blocks).concat(paths).concat(left).concat(right).concat(bottom).concat(top)

  return new Geometry({
    props: {
      type: 'polygon',
      color: [55, 55, 55],
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
