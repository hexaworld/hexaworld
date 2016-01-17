var css = require('dom-css')
var animate = require('animateplus')

module.exports = function (container, opts) {
  var canvas = document.createElement('canvas')
  var height = container.clientHeight
  var width = container.clientWidth
  var ismobile = width < height

  var size = ismobile ? 0.9 * width : 0.65 * height
  var ratio = window.devicePixelRatio || 1

  css(container, {position: 'relative'})

  canvas.id = 'game'
  canvas.width = size * ratio
  canvas.height = size * 1.153 * ratio
  css(canvas, {width: size, height: size * 1.153})

  css(canvas, {
    display: 'block',
    margin: '0px auto',
    left: 0, right: 0,
    marginTop: (height - size) * 0.5,
    position: 'absolute',
    zIndex: 0,
    opacity: 0.0,
    background: 'rgb(10,10,10)'
  })
  
  container.appendChild(canvas)


  function hide () {
    animate({
      el: canvas,
      opacity: [1, 0],
      duration: 300,
      easing: 'easeInQuad'
    })
  }

  function show () {
    animate({
      el: canvas,
      opacity: [0, 1],
      duration: 300,
      easing: 'easeInQuad'
    })
  }

  return {
    canvas: canvas,
    height: height,
    hide: hide,
    show: show
  }
}
