module.exports = function (container) {
  var width = container.clientWidth
  var height = container.clientHeight
  var style

  var label = document.createElement('div')
  label.id = 'energy'
  style = label.style
  style.left = width * 0.15
  style.width = width * 0.45
  style.top = width * 0.075
  style.height = width * 0.05
  style.border = 'solid 5px rgb(150,150,150)'
  style.position = 'absolute'
  container.appendChild(label)

  var bar = document.createElement('div')
  style = bar.style
  style.left = 0
  style.width = width * 0.45
  style.height = '100%'
  style.top = 0
  style.background = 'rgb(50,50,50)'
  style.position = 'absolute'
  label.appendChild(bar)

  var fill = document.createElement('div')
  style = fill.style
  style.left = 0
  style.width = width * 0.45
  style.height = '100%'
  style.top = 0
  style.background = 'rgb(150,150,150)'
  style.transition = 'all 0.2s'
  style.position = 'absolute'
  label.appendChild(fill)

  function blink() {
    var count = 0
    var blinker = setInterval(function () {
      bar.style.background = 'rgb(150,150,150)'
      setTimeout(function () {
        bar.style.background = 'rgb(50,50,50)'
      }, 100)
      count++
      if (count === 4) clearInterval(blinker)
    }, 200)
  }

  function update (state) {
    fill.style.width = width * 0.45 * state.current / state.total
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
    blink: blink
  }
}
