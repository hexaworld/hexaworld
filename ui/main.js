module.exports = function (container, opts) {
  var canvas = document.createElement('canvas')
  var height = container.clientHeight || opts.size

  if (height * 0.7 > window.innerWidth) {
    height = window.innerWidth * (1 / 0.7) - 30
  }

  container.style.width = height * 1.15 + 'px'
  container.style.height = height + 'px'
  container.style.position = 'relative'
  container.style.perspective = '10em'
  container.style.background = 'rgb(55,55,55)'

  canvas.id = 'game'
  canvas.width = height * 1.15
  canvas.height = height * 1
  canvas.style.marginTop = -height * 0.27
  canvas.style.transform = 'rotateX(10deg)'
  canvas.style.position = 'absolute'

  container.appendChild(canvas)

  function hide () {
    canvas.style.opacity = 0
  }

  function show () {
    canvas.style.opacity = 1
  }

  return {
    canvas: canvas,
    height: height,
    hide: hide,
    show: show
  }
}
