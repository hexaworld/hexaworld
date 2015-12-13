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
  canvas.style.marginTop = height * 0.15
  canvas.style.position = 'absolute'
  container.appendChild(canvas)

  function hide() {
    canvas.style.opacity = 0
  }

  function show() {
    canvas.style.opacity = 1
  }

  return {
    canvas: canvas,
    height: height,
    hide: hide,
    show: show
  }
}
