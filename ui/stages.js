var _ = require('lodash')

module.exports = function (container) {
  var width = window.innerHeight * 0.6
  var height = window.innerHeight
  var size = width * 0.5

  var ismobile = window.innerWidth < window.innerHeight

  var points = _.range(7).map(function (i) {
    var dx = 0.6 * size * Math.cos(i * 2 * Math.PI / 6) + size / 2
    var dy = 0.425 * size * Math.sin(i * 2 * Math.PI / 6) + size / 2
    return [dx, dy]
  })

  var t

  var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
  svg.setAttribute('width', size * 1.2)
  svg.setAttribute('height', size)
  svg.style.pointerEvents = 'none'
  svg.style.position = 'fixed'
  svg.style.top = 0
  svg.style.left = 0
  container.appendChild(svg)

  var hex = document.createElementNS('http://www.w3.org/2000/svg', 'polygon')
  hex.setAttribute('points', points.join(' '))
  hex.style.fill = 'rgb(20,20,20)'
  hex.style.stroke = 'rgb(190,190,190)'
  hex.style.strokeWidth = '5'
  hex.style.strokeLinejoin = 'round'
  hex.style.pointerEvents = 'none'
  t = ismobile
    ? 'translate(' + size * -0.3 + ',' + size * -0.62 + ')'
    : 'translate(' + size * -0.3 + ',' + size * -0.62 + ')'
  hex.setAttribute('transform', t)
  svg.appendChild(hex)

  var number = document.createElement('div')
  number.style.fontFamily = 'Hack'
  number.style.fontSize = width * 0.05
  number.style.color = 'rgb(150,150,150)'
  number.style.opacity = 1
  number.style.pointerEvents = 'none'
  number.style.left = width * 0.02
  number.style.top = ismobile ? height * 0.015 : height * 0.015
  number.style.width = width * 0.3
  number.style.position = 'fixed'
  number.innerHTML = ''
  container.appendChild(number)

  function update (state) {
    number.innerHTML = "<span style='font-size:" + width * 0.04 + "px'>found </span>" + (state.current) + '|' + state.total
  }

  function hide () {
    svg.style.opacity = 0
    number.style.opacity = 0
  }

  function show () {
    svg.style.opacity = 1
    number.style.opacity = 1
  }

  return {
    update: update,
    hide: hide,
    show: show
  }
}
