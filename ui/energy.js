var _ = require('lodash')

module.exports = function (container) {
  var width = container.clientWidth
  var style

  var label = document.createElement('div')
  label.id = 'energy'
  style = label.style
  style.left = width * 0.06
  style.width = width * 0.45
  style.top = width * 0
  style.height = width * 0.05
  style.position = 'absolute'
  container.appendChild(label)

  var bar = document.createElement('div')
  style = bar.style
  style.left = 0
  style.width = width * 0.45 - 2
  style.height = '120%'
  style.top = 0
  style.background = 'rgb(55,55,55)'
  style.position = 'absolute'
  label.appendChild(bar)

  var fill = document.createElement('div')
  style = fill.style
  style.left = 0
  style.width = width * 0.45 - 2
  style.height = '120%'
  style.top = 0
  style.background = 'rgb(150,150,150)'
  style.transition = 'width 0.2s'
  style.position = 'absolute'
  label.appendChild(fill)

  var n = 8

  _.range(n).forEach(function (i) {
    var notch = document.createElement('div')
    style = notch.style
    style.left = i * ((width * 0.45) / n)
    style.top = 0
    style.height = label.offsetHeight
    style.width = (width * 0.45) / n - 12
    style.position = 'absolute'
    style.border = 'solid 3px rgb(150,150,150)'
    style.outline = 'solid 6px rgb(55,55,55)'
    style.zIndex = '1000'
    label.appendChild(notch)
  })

  function ghost () {
    var count = 0
    var blinker = setInterval(function () {
      setTimeout(function () {
        bar.style.background = 'rgb(50,50,50)'
      }, 100)
      bar.style.background = 'rgb(150,150,150)'
      count++
      if (count === 4) clearInterval(blinker)
    }, 200)
  }

  function blink () {    
    fill.style.background = 'rgb(240,240,240)'
    setTimeout(function () {
      fill.style.background = 'rgb(150,150,150)'
    }, 25)
  }

  function update (state) {
    fill.style.width = Math.max(width * 0.45 * Math.max(state.current, 0) / state.total - 2, 0)
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
    show: show,
    blink: blink,
    ghost: ghost
  }
}
