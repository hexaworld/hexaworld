var css = require('dom-css')
var _ = require('lodash')

module.exports = function (container) {
  var width = container.clientWidth
  var height = container.clientHeight

  var ismobile = window.innerWidth < window.innerHeight
  var size = ismobile ? width * 0.57 : height * 0.4

  var colors = {
    fill: 'rgb(10,10,10)',
    stroke: 'none',
    text1: 'rgb(200,200,200)',
    text2: 'rgb(150,150,150)'
  }

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
  t = 'translate(' + size * -0.39 + ',' + size * -0.62 + ')'
  hex.setAttribute('transform', t)
  css(hex, {
    fill: colors.fill,
    stroke: colors.stroke,
    strokeWidth: 4,
    strokeLinejoin: 'round',
    pointerEvents: 'none'
  })
  svg.appendChild(hex)

  var number = document.createElement('div')
  number.innerHTML = ''
  css(number, {
    fontFamily: 'Hack',
    fontSize: ismobile ? width * 0.066 : size * 0.1,
    color: colors.text,
    pointerEvents: 'none',
    left: ismobile ? width * 0.03 : width * 0.012, 
    top: size * 0.05,
    width: width * 0.3,
    position: 'absolute'
  })
  container.appendChild(number)

  function update (state) {
    number.innerHTML = '+ ' + (state.current) + '/' + state.total
  }

  function hide () {
    css(svg, {opacity: 0.0})
    css(number, {opacity: 0.0})
  }

  function show () {
    console.log('showing')
    css(svg, {opacity: 1.0})
    css(number, {opacity: 1.0})
  }

  return {
    update: update,
    hide: hide,
    show: show
  }
}
