var _ = require('lodash')

module.exports = function (container) {
  var width = container.clientWidth
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
  if (ismobile) {
    svg.style.position = 'fixed'
    svg.style.bottom = 0
    svg.style.right = 0
  } else {
    var offset = container.offsetLeft
    if (container.offsetParent) offset += container.offsetParent.offsetLeft
    svg.style.position = 'fixed'
    svg.style.bottom = 0
    svg.style.left = offset + size * 0.4
  }

  container.appendChild(svg)

  var hex = document.createElementNS('http://www.w3.org/2000/svg', 'polygon')
  hex.setAttribute('points', points.join(' '))
  hex.style.fill = 'rgb(55,55,55)'
  hex.style.stroke = 'rgb(155,155,155)'
  hex.style.strokeWidth = '5'
  hex.style.strokeLinejoin = 'round'
  hex.style.pointerEvents = 'none'
  t = ismobile
    ? 'translate(' + size * 0.45 + ',' + size * 0.62 + ')'
    : 'translate(' + size * 0.1 + ',' + size * 0.62 + ')'
  hex.setAttribute('transform', t)
  svg.appendChild(hex)

  var number = document.createElementNS('http://www.w3.org/2000/svg', 'text')
  number.setAttribute('fill', 'rgb(155,155,155)')
  number.setAttribute('font-size', width * 0.05)
  number.setAttribute('font-family', 'Hack')
  number.setAttribute('text-anchor', 'middle')
  number.setAttribute('dominant-baseline', 'hanging')
  number.style.opacity = 1
  number.style.pointerEvents = 'none'
  number.innerHTML = ''
  t = ismobile
    ? 'translate(' + size * 0.89 + ',' + size * 0.85 + ')'
    : 'translate(' + size * 0.6 + ',' + size * 0.85 + ')'
  number.setAttribute('transform', t)
  svg.appendChild(number)

  function update (state) {
    number.innerHTML = (state.current + 1) + '/' + state.total + ' found'
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
