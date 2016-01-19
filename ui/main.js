var css = require('dom-css')
var animate = require('animateplus')
var _ = require('lodash')

module.exports = function (container, opts) {
  var canvas = document.createElement('canvas')
  var height = container.clientHeight
  var width = container.clientWidth
  var ismobile = width < height

  var size = ismobile ? width : 0.65 * height
  var ratio = window.devicePixelRatio || 1

  css(container, {position: 'relative', overflowX: 'hidden'})

  canvas.id = 'game'
  canvas.width = size * ratio
  canvas.height = ismobile ? height * 0.8 * ratio : size * (2 / Math.sqrt(3)) * ratio
  css(canvas, {width: size, height: ismobile ? height * 0.8 : size * (2 / Math.sqrt(3))})

  css(canvas, {
    display: 'block',
    margin: '0px auto',
    left: 0, right: 0,
    marginTop: ismobile 
      ? 0 
      : (height - size) * 0.5,
    position: 'absolute',
    zIndex: 0,
    opacity: 0.0,
    background: 'rgb(10,10,10)'
  })
  if (ismobile) css(canvas, {bottom: 0})
  
  container.appendChild(canvas)

  var points1 = _.range(7).map(function (i) {
    var dx = (size / Math.sqrt(3)) * Math.cos(i * 2 * Math.PI / 6 + Math.PI / 6) + 1.1 * size / 2
    var dy = (size / Math.sqrt(3)) * Math.sin(i * 2 * Math.PI / 6 + Math.PI / 6) + 1.1 * size / Math.sqrt(3)
    return [dx, dy]
  })

  var points2 = [
    [0, 0], 
    [size * 1.1, 0], 
    [size * 1.1, size * (2 / Math.sqrt(3)) * 1.1], 
    [0, size * (2 / Math.sqrt(3)) * 1.1]
  ]

  if (!ismobile) {

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

    var mask = document.createElementNS('http://www.w3.org/2000/svg', 'mask')
    mask.id = 'main-mask'
    svg.appendChild(mask)

    var box = document.createElementNS('http://www.w3.org/2000/svg', 'polygon')
    box.setAttribute('points', points2.join(' '))
    box.setAttribute('fill', 'white')
    mask.appendChild(box)

    var hex = document.createElementNS('http://www.w3.org/2000/svg', 'polygon')
    hex.setAttribute('points', points1.join(' '))
    hex.setAttribute('fill', 'black')
    mask.appendChild(hex)

    var square = document.createElementNS('http://www.w3.org/2000/svg', 'polygon')
    square.setAttribute('points', points2.join(' '))
    square.setAttribute('mask', 'url(#main-mask)')
    square.setAttribute('fill', 'rgb(10,10,10)')
    svg.appendChild(square)

    if (!ismobile) {
      var edge = document.createElementNS('http://www.w3.org/2000/svg', 'polygon')
      edge.setAttribute('points', points1.join(' '))
      css(edge, {
        strokeWidth: 12,
        fill: 'none',
        stroke: 'rgb(45,45,45)'
      })
      svg.appendChild(edge)
    }

  }

  function hide () {
    if (canvas.style.opacity == 1.0) {
      console.log('hiding')
      animate({
        el: canvas,
        opacity: [1, 0],
        duration: 200,
        easing: 'easeInQuad'
      })
    }
  }

  function hideQuick () {
    css(canvas, {opacity: 0})
  }

  function show () {
    if (canvas.style.opacity == 0.0) {
      animate({
        el: canvas,
        opacity: [0, 1],
        duration: 300,
        easing: 'easeInQuad'
      })
    }
  }

  return {
    canvas: canvas,
    height: height,
    hide: hide,
    hideQuick: hideQuick,
    show: show
  }
}
