var _ = require('lodash')
var mouse = require('../geometry/mouse.js')
var transform = require('transformist')

module.exports = function (container) {
  var width = container.clientWidth
  var height = container.clientHeight
  var style

  var label = document.createElement('div')
  style = label.style
  style.right = width * 0.4
  style.top = height * 0.075
  style.width = width * 0.2
  style.height = width * 0.05
  style.textAlign = 'right'
  style.marginRight = -width * 0.2
  style.position = 'absolute'
  container.appendChild(label)

  var edge = document.createElement('div')
  style = edge.style
  style.right = 0
  style.top = 0
  style.width = width * 0.2
  style.height = width * 0.05
  style.paddingBottom = width * 0.005
  style.position = 'absolute'
  style.borderLeft = 'solid rgb(150,150,150) ' + width * 0.011 * 1.6 + 'px'
  style.borderBottom = 'solid rgb(150,150,150) ' + width * 0.011 + 'px'
  style.transform = 'skew(45deg)'
  style.msTransform = 'skew(45deg)'
  style.webkitTransform = 'skew(45deg)'
  label.appendChild(edge)

  function drawIcon () {
    var icon = document.createElement('canvas')
    icon.setAttribute('width', width * 0.05)
    icon.setAttribute('height', width * 0.05)
    icon.className = 'life-icon'
    label.appendChild(icon)
    var character = mouse({
      scale: width * 0.015, 
      stroke: 'rgb(150,150,150)', 
      fill: 'rgb(75,75,75)', 
      thickness: width * 0.006
    })
    var camera = {transform: transform(), game: {width: width * 0.05, height: width * 0.05}}
    character.draw(icon.getContext('2d'), camera, {order: 'bottom'})
  }

  function update (count) {
    var existing = document.getElementsByClassName('life-icon')
    while (existing[0]) {
      existing[0].remove()
    }
    _.range(count).forEach(function (i) {
      drawIcon()
    })
  }

  return {
    update: update
  }
}
