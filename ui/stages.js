var _ = require('lodash')

module.exports = function(container) {
  var width = container.clientWidth
  var size = width * 0.5

  var ismobile = window.innerWidth < window.innerHeight

  var points = _.range(7).map(function (i) {
    var dx = 0.6 * size * Math.cos(i * 2 * Math.PI / 6) + size / 2
    var dy = 0.425 * size * Math.sin(i * 2 * Math.PI / 6) + size / 2
    return [dx, dy]
  })

  var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
  svg.setAttribute('width', size * 1.1)
  svg.setAttribute('height', size)
  svg.style.position = 'fixed'
  svg.style.bottom = 0
  svg.style.right = ismobile ? 0 : window.innerWidth / 2 - size / 2
  container.appendChild(svg)

  var hex = document.createElementNS('http://www.w3.org/2000/svg', 'polygon')
  hex.setAttribute("points", points.join(' '))
  hex.style.fill = 'rgb(55,55,55)'
  hex.style.stroke = 'rgb(155,155,155)'
  hex.style.strokeWidth = '5'
  hex.style.strokeLinejoin = 'round'
  hex.style.cursor = 'pointer'
  hex.style.webkitTapHighlightColor = 'rgba(0,0,0,0)'
  hex.style.overflow = 'hidden'
  var t = ismobile
    ? 'translate(' + size * 0.3 + ',' + size * 0.6 + ')'
    : 'translate(' + size * 0.08 + ',' + size * 0.6 + ')'
  hex.setAttribute('transform', t)
  svg.appendChild(hex)

  var number = document.createElementNS('http://www.w3.org/2000/svg', 'text')
  number.setAttribute("fill", 'rgb(155,155,155)')
  number.setAttribute("font-size", width * 0.05)
  number.setAttribute("font-family", "Hack")
  number.setAttribute("text-anchor", 'middle')
  number.setAttribute("dominant-baseline", 'hanging')
  number.style.opacity = 1
  number.style.pointerEvents = 'none'
  number.innerHTML = 'stage '  
  var t = ismobile 
    ? 'translate(' + size * 0.76 + ',' + size * 0.83 + ')' 
    : 'translate(' + size * 0.57 + ',' + size * 0.83 + ')' 
  number.setAttribute('transform', t)
  svg.appendChild(number)

  function update (state) {
    number.innerHTML = 'stage ' + (state.current + 1) + '/' + state.total
  }

  function hide () {
    svg.style.opacity = 0
  }

  function show () {
    svg.style.opacity = 1
  }

  return {
    update: update,
    hide: hide,
    show: show
  }

}
