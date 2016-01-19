var css = require('dom-css')
var _ = require('lodash')
var animate = require('animateplus')
var EventEmitter = require('eventemitter2').EventEmitter2

module.exports = function (container) {
  var width = container.clientWidth
  var height = container.clientHeight
  var ismobile = width < height

  var w = ismobile ? width * 0.18 : height * 0.5
  var h = height * 0.1

  var points = [[0 + w * 1.2, 0], [width, 0], [width, h], [0 + w, h]]
  var offset = ismobile ? 400 : 1200

  var events = new EventEmitter({
    wildcard: true
  })

  console.log(w)
  console.log(width * 0.5)

  var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
  svg.setAttribute('width', ismobile ? width : w * 2)
  svg.setAttribute('height', h)
  css(svg, {
    overflowX: 'hidden',
    pointerEvents: 'none',
    position: 'absolute',
    right: ismobile ? 0 : (width - 0.65 * height) * 0.5,
    top: ismobile ? height * 0.8 : height * 0.63,
    display: 'block',
    transform: 'translateX(' + offset + 'px)',
    cursor: 'pointer'
  })
  if (ismobile) css(svg, {left: 0})
  container.appendChild(svg)

  var background = document.createElementNS('http://www.w3.org/2000/svg', 'polygon')
  background.setAttribute('points', points.join(' '))
  css(background, {
    fill: 'rgb(45,45,45)',
    stroke: 'none',
  })
  svg.appendChild(background)

  var label = document.createElement('div')
  container.appendChild(label)
  css(label, {
    overflow: 'none',
    top: ismobile ? height * 0.83 : height * 0.61,
    right: ismobile ? width * 0.05 : (width - 0.65 * height) * 0.53,
    width: width * 0.8,
    textAlign: 'right',
    position: 'absolute',
    pointerEvents: 'none',
    lineHeight: ismobile ? width * 0.12 * 0.7 + 'px' : height * 0.2 * 0.7 + 'px'
  })

  var message = document.createElement('div')
  label.appendChild(message)
  css(message, {
    color: 'rgb(200,200,200)',
    fontFamily: 'Hack',
    fontWeight: '800',
    fontSize: ismobile ? width * 0.08 : height * 0.04
  })

  svg.onclick = function () {
    events.emit('click', true)
  }
  
  function show (text) {
    animate({
      el: svg,
      translateX: [800, 0],
      duration: 400,
      easing: 'easeInQuad'
    })
    animate({
      el: label,
      translateX: [800, 0],
      duration: 200,
      easing: 'easeInQuad'
    })
    message.innerHTML = text
    css(svg, {pointerEvents: 'all'})
  }

  function hide () {
    animate({
      el: svg,
      translateX: [0, 800],
      duration: 300,
      easing: 'easeInQuad'
    })
    animate({
      el: label,
      translateX: [0, 800],
      duration: 300,
      easing: 'easeInQuad'
    })
    css(svg, {pointerEvents: 'none'})
  }

  function hideQuick () {
    css(svg, {transform: 'translateX(' + offset + 'px)'})
    css(label, {transform: 'translateX(' + offset + 'px)'})
  }

  return {
    show: show,
    hide: hide,
    hideQuick: hideQuick,
    events: events
  }
}
