var css = require('dom-css')
var _ = require('lodash')

module.exports = function (container) {
  var height = container.clientHeight
  var width = container.clientWidth
  var ismobile = width < height

  var size = ismobile ? height * 0.17 : width * 0.15

  var hexheight = 1.1 * size * (2 / Math.sqrt(3))
  var hexwidth = 1.1 * size

  var wrapper = document.createElement('div')
  wrapper.id = 'energy'
  css(wrapper, {
    position: 'absolute',
    left: ismobile ? width * 0.65 : width * 0.75,
    top: ismobile ? height * 0.085 : height * 0.1,
    width: hexwidth,
    height: hexheight,
    textAlign: 'center',
    opacity: 0
  })
  container.appendChild(wrapper)

  function hex (size, offset) {
    return _.range(7).map(function (i) {
      var dx = (size / Math.sqrt(3)) * Math.cos(i * 2 * Math.PI / 6 + Math.PI / 6) + 1.1 * offset / 2
      var dy = (size / Math.sqrt(3)) * Math.sin(i * 2 * Math.PI / 6 + Math.PI / 6) + 1.1 * offset / Math.sqrt(3)
      return [dx, dy]
    })
  }

  function used (fraction) {
    var rad = Math.PI * 2 * fraction
    var base = [[hexwidth/2, 0], [hexwidth, 0]]
    if (fraction > 0) base = base.concat([0, 0])
    if (fraction > 1/3) base = base.concat([0, hexheight])
    if (fraction > 2/3) base = base.concat([hexwidth, hexheight])
    if (fraction > 0.9) base = base.concat([hexwidth, 0])
    var target = [-hexwidth * Math.sin(rad) + hexwidth * 0.5, hexheight - (hexheight * Math.cos(rad) + hexheight * 0.5)]
    var end = [hexwidth/2, hexheight/2]
    return base.concat([target]).concat([end])
  }

  var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
  svg.setAttribute('width', hexwidth)
  svg.setAttribute('height', hexheight)
  css(svg, {
    pointerEvents: 'none',
    position: 'absolute',
    left: 0, right: 0,
    margin: '0px auto',
    display: 'block'
  })
  wrapper.appendChild(svg)

  var background = document.createElementNS('http://www.w3.org/2000/svg', 'polygon')
  background.setAttribute('points', hex(size, size).join(' '))
  css(background, {
    fill: 'rgb(45,45,45)',
    stroke: 'none',
    zIndex: 2000
  })
  //svg.appendChild(background)

  var mask = document.createElementNS('http://www.w3.org/2000/svg', 'mask')
  mask.id = 'energy-mask'
  svg.appendChild(mask)

  var box = document.createElementNS('http://www.w3.org/2000/svg', 'polygon')
  box.setAttribute('points', [[0, 0], [0, hexwidth], [hexwidth, hexheight], [hexwidth, 0]].join(' '))
  box.setAttribute('fill', 'white')
  mask.appendChild(box)

  var triangle = document.createElementNS('http://www.w3.org/2000/svg', 'polygon')
  triangle.setAttribute('points', used(0.8).join(' '))
  triangle.setAttribute('fill', 'black')
  mask.appendChild(triangle)

  var front = document.createElementNS('http://www.w3.org/2000/svg', 'polygon')
  front.setAttribute('points', hex(size * 0.75, size).join(' '))
  front.setAttribute('mask', 'url(#energy-mask)')
  css(front, {
    fill: 'rgb(45,45,45)',
    stroke: 'none',
    zIndex: 2000
  })
  svg.appendChild(front)

  var middle = document.createElementNS('http://www.w3.org/2000/svg', 'polygon')
  middle.setAttribute('points', hex(size * 0.52, size).join(' '))
  css(middle, {
    fill: 'rgb(10,10,10)',
    stroke: 'none',
    zIndex: 2000
  })
  svg.appendChild(middle)

  var label = document.createElement('div')
  label.innerHTML = '8'
  css(label, {
    position: 'relative',
    color: 'rgb(220,220,220)',
    fontSize: ismobile ? width * 0.066 : height * 0.065,
    fontFamily: 'Hack',
    top: size * (2 / Math.sqrt(3)) * 1.1 * 0.5 - (ismobile ? width * 0.066 : height * 0.065) * 0.6
  })
  wrapper.appendChild(label)

  function update (state) {
    var remaining = Math.max(state.current, 0) / state.total
    triangle.setAttribute('points', used(1 - remaining).join(' '))
    label.innerHTML = parseInt(Math.max(state.current, 0) / 300)
  }

  function hide () {
    wrapper.style.opacity = 0
  }

  function show () {
    wrapper.style.opacity = 1
  }

  return {
    update: update,
    hide: hide,
    show: show
  }
}
