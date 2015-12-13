module.exports = function (container) {
  var width = container.clientWidth
  var height = container.clientHeight
  var style

  var label = document.createElement('div')
  style = label.style
  style.left = 0
  style.top = height * 0.4
  style.width = width
  style.height = width * 0.1
  style.textAlign = 'center'
  style.position = 'absolute'
  container.appendChild(label)

  var message = document.createElement('div')
  style = message.style
  style.color = 'rgb(150,150,150)'
  style.fontFamily = 'Hack'
  style.fontSize = width * 0.12 + 'px'
  style.opacity = 0
  label.appendChild(message)

  function show(text) {
  	style.opacity = 1
  	message.innerHTML = text
  }

  function hide(text) {
  	style.opacity = 0
  	message.innerHTML = text
  }

  return {
  	show: show,
  	hide: hide
  }

}