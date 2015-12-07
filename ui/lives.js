var _ = require('lodash')
var mouse = require('../geometry/mouse.js')
var transform = require('transformist')

module.exports = function (container) {
  var width = container.clientWidth
  var height = container.clientHeight
  var style

  var label = document.createElement('div')
  style = label.style
  style.left = width * 0.2
  style.bottom = height * 0.1
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
  style.borderLeft = 'solid rgb(150,150,150) 8px'
  style.borderBottom = 'solid rgb(150,150,150) 5px'
  style.transform = 'skew(45deg)'
  style.msTransform = 'skew(45deg)'
  style.webkitTransform = 'skew(45deg)'
  label.appendChild(edge)

  var text = document.createElement('div')
  style = text.style
  style.position = 'absolute'
  style.right = -width * 0.01
  style.bottom = -height * 0.05
  style.width = width * 0.2
  style.textAlign = 'right'
  style.position = 'absolute'
  style.color = 'rgb(150,150,150)'
  style.fontFamily = 'Hack'
  style.fontSize = width * 0.04 + 'px'
  text.innerHTML = 'lives'
  label.appendChild(text)

  function drawIcon () {
    var icon = document.createElement('canvas')
    icon.setAttribute('width', width * 0.05)
    icon.setAttribute('height', width * 0.05)
    label.appendChild(icon)
    var character = mouse({scale: 6, stroke: 'rgb(150,150,150)', fill: 'rgb(75,75,75)', thickness: 4})
    var camera = {transform: transform(), game: {width: width * 0.05, height: width * 0.05}}
    character.draw(icon.getContext('2d'), camera, {order: 'bottom'})
  }

  function update (count) {
    _.range(count).forEach(function (i) {
      drawIcon()
    })
  }

  return {
    update: update
  }
}
