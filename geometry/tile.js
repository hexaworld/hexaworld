var _ = require('lodash')
var hex = require('./hex.js')
var wedge = require('./wedge.js')
var block = require('./block.js')
var end = require('./end.js')
var path = require('./path.js')
var pathLeft = require('./path-left.js')
var pathRight = require('./path-right.js')
var endBottom = require('./end-bottom.js')
var endTop = require('./end-top.js')
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
      color: [55, 55, 55]
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
          color: [250,250,250],
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
          color: [250,250,250],
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
          color: [250,250,250],
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

  var leftEdges = _.range(6).map(function (i) {
    if (_.includes(opts.paths, i)) {
      return pathLeft({
        rotation: i * 60,
        thickness: thickness
      })
    }
  })
  _.remove(leftEdges, _.isUndefined)

  var rightEdges = _.range(6).map(function (i) {
    if (_.includes(opts.paths, i)) {
      return pathRight({
        rotation: i * 60,
        thickness: thickness
      })
    }
  })
  _.remove(rightEdges, _.isUndefined)

  var bottomEdges = _.range(6).map(function (i) {
    if (!_.includes(opts.paths, i)) {
      return endBottom({
        rotation: i * 60,
        thickness: thickness
      })
    }
  })
  _.remove(bottomEdges, _.isUndefined)

  var topEdges = _.range(6).map(function (i) {
    if (!_.includes(opts.paths, i)) {
      return endTop({
        rotation: i * 60,
        thickness: thickness
      })
    }
  })
  _.remove(topEdges, _.isUndefined)
  
  var children = center.concat(wedges).concat(blocks).concat(paths).concat(leftEdges).concat(rightEdges).concat(bottomEdges).concat(topEdges)

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
