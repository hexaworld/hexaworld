var animate = require('animateplus')

module.exports = function (container, opts) {
  var canvas = document.createElement('canvas')
  var height = container.clientHeight || opts.size

  if (height * 0.7 > window.innerWidth) {
    height = window.innerWidth * (1 / 0.7) - 30
  }

  container.style.width = height * 0.7 + 'px'
  container.style.height = height + 'px'
  container.style.position = 'relative'
  container.style.background = 'rgb(55,55,55)'

  canvas.id = 'game'
  canvas.width = height * 0.7
  canvas.height = height * 0.7
  canvas.style.marginTop = height * 0.15
  canvas.style.position = 'absolute'
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
