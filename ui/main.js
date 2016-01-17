var css = require('dom-css')
var animate = require('animateplus')

module.exports = function (container, opts) {
  var canvas = document.createElement('canvas')
  var height = container.clientHeight
  var width = container.clientWidth
  var ismobile = width < height

  var size = ismobile ? 0.9 * width : 0.76 * height

  css(container, {position: 'relative'})

  canvas.id = 'game'
  canvas.width = size
  canvas.height = size

  css(canvas, {
    display: 'block',
    margin: '0px auto',
    left: 0, right: 0,
    marginTop: (height - size) * 0.55,
    position: 'absolute',
    zIndex: 0,
    opacity: 0.0,
    background: 'rgb(10,10,10)',
    border: 'solid 1px white'
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
