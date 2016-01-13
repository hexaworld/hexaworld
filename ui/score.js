var sprintf = require('sprintf-js').sprintf
var animate = require('animateplus')

module.exports = function (container) {
  var width = container.clientWidth
  var height = container.clientHeight
  var style

  var ismobile = window.innerWidth < window.innerHeight

  var label = document.createElement('div')
  label.id = 'score'
  var offset = container.offsetLeft
  if (container.offsetParent) offset += container.offsetParent.offsetLeft
  style = label.style
  style.left = offset + width * 0.5 - width * 0.25 * 0.5
  style.width = width * 0.25
  style.top = ismobile ? height * 0.1 : height * 0.06
  style.height = width * 0.05
  style.textAlign = 'center'
  style.display = 'inline-block'
  style.pointerEvents = 'none'
  style.position = 'fixed'
  container.appendChild(label)

  var number = document.createElement('span')
  style = number.style
  style.color = 'rgb(200,200,200)'
  style.fontFamily = 'Hack'
  style.fontSize = height * 0.06 + 'px'
  style.lineHeight = width * 0.06 + 'px'
  style.display = 'inline-block'
  style.verticalAlign = 'middle'
  number.innerHTML = sprintf('%05d', 0)
  label.appendChild(number)

  function update (state, opts) {
    opts = opts || {duration: 50, magnitude: 0.1}
    number.innerHTML = sprintf('%05d', state.current)
    animate({
      el: number,
      scale: [1, 1 + opts.magnitude],
      duration: 50,
      easing: 'easeInQuad',
      complete: function () {
        animate({
          el: number,
          scale: [1 + opts.magnitude, 1],
          duration: opts.duration,
          easing: 'easeInQuad'
        })
      }
    })
  }

  function hide () {
    label.style.opacity = 0
  }

  function show () {
    label.style.opacity = 1
  }

  return {
    update: update,
    hide: hide,
    show: show
  }
}
