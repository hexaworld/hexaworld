var css = require('dom-css')
var _ = require('lodash')

module.exports = function (container) {
  var width = container.clientWidth
  var height = container.clientHeight
  var ismobile = width < height

  var size = ismobile ? width * 0.9 : 0.65 * height

  var points1 = _.range(7).map(function (i) {
    var dx = (size / Math.sqrt(3)) * Math.cos(i * 2 * Math.PI / 6 + Math.PI / 6) + 1.1 * size / 2
    var dy = (size / Math.sqrt(3)) * Math.sin(i * 2 * Math.PI / 6 + Math.PI / 6) + 1.1 * size / Math.sqrt(3)
    return [dx, dy]
  })

  var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
  svg.setAttribute('width', size * 1.1)
  svg.setAttribute('height', size * (2 / Math.sqrt(3)) * 1.1)
  css(svg, {
    pointerEvents: 'none',
    position: 'absolute',
    left: 0, right: 0,
    margin: '0px auto',
    marginTop: ismobile 
      ? (height - size) * 0.6 - 0.05 * size * (2 / Math.sqrt(3))
      : (height - size) * 0.5 - 0.05 * size * (2 / Math.sqrt(3)),
    display: 'block'
  })
  container.appendChild(svg)

  var background = document.createElementNS('http://www.w3.org/2000/svg', 'polygon')
  background.setAttribute('points', points1.join(' '))
  css(background, {
    fill: 'rgb(45,45,45)',
    stroke: 'none',
    zIndex: 2000
  })
  svg.appendChild(background)

  var label = document.createElement('div')
  container.appendChild(label)
  css(label, {
    top: ismobile 
      ? (height - size) * 0.6 - 0.05 * size * (2 / Math.sqrt(3)) + height * 0.2
      : (height - size) * 0.5 - 0.05 * size * (2 / Math.sqrt(3)) + height * 0.25,
    margin: '0px auto',
    left: 0, right: 0,
    width: ismobile ? width : width * 0.6,
    textAlign: 'center',
    position: 'absolute',
    pointerEvents: 'none'
  })

  var message = document.createElement('div')
  label.appendChild(message)
  css(message, {
    color: 'rgb(220,220,220)',
    fontFamily: 'Hack',
    fontSize: Math.sqrt(width * 5),
    opacity: 0
  })
  
  function show (text) {
    css(message, {opacity: 1})
    css(background, {opacity: 1})
    message.innerHTML = text
  }

  function hide () {
    css(message, {opacity: 0})
    css(background, {opacity: 0})
  }

  return {
    show: show,
    hide: hide
  }
}
