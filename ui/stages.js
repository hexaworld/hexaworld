var css = require('dom-css')
var _ = require('lodash')

module.exports = function (container) {
  var width = container.clientHeight
  var height = container.clientWidth

  var ismobile = window.innerWidth < window.innerHeight
  var size = ismobile ? width * 0.35 : width * 0.4

  var points = _.range(7).map(function (i) {
    var dx = 0.6 * size * Math.cos(i * 2 * Math.PI / 6) + size / 2
    var dy = 0.425 * size * Math.sin(i * 2 * Math.PI / 6) + size / 2
    return [dx, dy]
  })

  var t

  var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
  svg.setAttribute('width', size * 1.2)
  svg.setAttribute('height', size)
  css(svg, {
    pointerEvents: 'none',
    position: 'absolute',
    top: 0, left: 0
  })
  container.appendChild(svg)

  var hex = document.createElementNS('http://www.w3.org/2000/svg', 'polygon')
  hex.setAttribute('points', points.join(' '))
  t = 'translate(' + size * -0.3 + ',' + size * -0.62 + ')'
  hex.setAttribute('transform', t)
  css(hex, {
    fill: 'rgb(10,10,10)',
    stroke: 'rgb(190,190,190)',
    strokeWidth: '5',
    strokeLinejoin: 'round',
    pointerEvents: 'none'
  })
  svg.appendChild(hex)

  var number = document.createElement('div')
  number.innerHTML = ''
  css(number, {
    fontFamily: 'Hack',
    fontSize: size * 0.08,
    color: 'rgb(150,150,150)',
    opacity: 1,
    pointerEvents: 'none',
    left: width * 0.02, 
    top: size * 0.05,
    width: width * 0.3,
    position: 'absolute'
  })
  container.appendChild(number)

  function update (state) {
    number.innerHTML = "<span style='font-size:" + size * 0.08 + "px'>found </span>" + (state.current) + "<span style='font-size:" + size * 0.1 + "px'>|</span>" + state.total
  }

  function hide () {
    css(svg, {opactiy: 0})
    css(numer, {opactiy: 0})
  }

  function show () {
    css(svg, {opactiy: 1})
    css(number, {opactiy: 1})
  }

  return {
    update: update,
    hide: hide,
    show: show
  }
}
