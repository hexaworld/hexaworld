var _ = require('lodash')
var wedge = require('./wedge.js')
var block = require('./block.js')
var end = require('./end.js')
var path = require('./path.js')
var Geometry = require('../geometry.js')

module.exports = function (opts) {
  opts = opts || {}
  var wedges = _.range(6).map(function (i) {
    return wedge({angle: i * 60})
  })
  var blocks = _.range(6).map(function (i) {
    if (!_.includes(opts.paths, i)) return block({angle: i * 60})
  })
  _.remove(blocks, _.isUndefined)
  var ends = _.range(6).map(function (i) {
    if (!_.includes(opts.paths, i)) return end({angle: i * 60})
  })
  _.remove(ends, _.isUndefined)
  var paths = _.range(6).map(function (i) {
    if (_.includes(opts.paths, i)) return path({angle: i * 60})
  })
  _.remove(paths, _.isUndefined)
  
  var children = wedges.concat(blocks).concat(ends).concat(paths)

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
      position: [
        opts.scale * 3/2 * opts.position[0], 
        opts.scale * Math.sqrt(3) * (opts.position[1] + opts.position[0]/2)
      ],
      scale: opts.scale
    },

    children: opts.children ? opts.children.concat(children) : children
  })

}