var css = require('dom-css')

module.exports = function (container) {
  var width = container.clientWidth
  var height = container.clientHeight
  var ismobile = width < height

  var label = document.createElement('div')
  css(label, {
    top: height * 0.35,
    margin: '0px auto',
    left: 0, right: 0,
    width: ismobile ? width : width * 0.7,
    textAlign: 'center',
    position: 'absolute',
    pointerEvents: 'none'
  })

  container.appendChild(label)

  var message = document.createElement('div')
  css(message, {
    color: 'rgb(150,150,150)',
    fontFamily: 'Hack',
    fontSize: Math.sqrt(width * 5),
    opacity: 0
  })
  label.appendChild(message)

  function show (text) {
    css(message, {opacity: 1})
    message.innerHTML = text
  }

  function hide () {
    css(message, {opacity: 0})
  }

  return {
    show: show,
    hide: hide
  }
}
