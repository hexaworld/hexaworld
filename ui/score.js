var css = require('dom-css')
var sprintf = require('sprintf-js').sprintf
var animate = require('animateplus')

module.exports = function (container) {
  var width = container.clientWidth
  var height = container.clientHeight

  var ismobile = window.innerWidth < window.innerHeight

  var label = document.createElement('div')
  label.id = 'score'
  css(label, {
    left: 0, right: 0,
    margin: '0px auto',
    width: width * 0.25,
    top: ismobile ? height * 0.1 : height * 0.06,
    textAlign: 'center',
    pointerEvents: 'none',
    position: 'absolute',
  })
  container.appendChild(label)

  var number = document.createElement('span')
  number.innerHTML = sprintf('%05d', 0)
  css(number, {
    color: 'rgb(200,200,200)',
    fontFamily: 'Hack',
    fontSize: height * 0.05,
    display: 'inline-block',
    verticalAlign: 'middle',
  })
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
    css(label, {opacity: 0})
  }

  function show () {
    css(label, {opacity: 1})
  }

  return {
    update: update,
    hide: hide,
    show: show
  }
}
