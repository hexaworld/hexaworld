var animate = require('animateplus')

module.exports = function (container, opts) {
  var canvas = document.createElement('canvas')
  var height = container.clientHeight || opts.size

  var ismobile = window.innerWidth < window.innerHeight

  if (height * 0.7 > window.innerWidth) {
    height = window.innerWidth * (1 / 0.7) - 30
  } else {
    height = height * 0.9
  }

  container.style.width = ismobile ? window.innerWidth : window.innerWidth 
  container.style.height = height + 'px'
  container.style.position = 'relative'
  container.style.top = 0
  container.style.background = 'rgb(10,10,10)'

  canvas.id = 'game'
  canvas.width = ismobile ? window.innerWidth : window.innerWidth 
  canvas.height = window.innerHeight
  canvas.style.marginTop = 0
  canvas.style.position = 'relative'
  canvas.style.zIndex = 0
  canvas.style.background = 'rgb(10,10,10)'
  container.appendChild(canvas)

  canvas.style.opacity = 0.0

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
