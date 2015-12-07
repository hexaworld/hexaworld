module.exports = function (container, opts) {
  var width = container.clientWidth
  var height = container.clientHeight
  var style

  var label = document.createElement('div')
  style = label.style
  style.left = width * 0.2
  style.top = height * 0.075
  style.width = width * 0.2
  style.height = width * 0.05
  style.position = 'absolute'
  container.appendChild(label)

  var edge = document.createElement('div')
  style = edge.style
  style.right = 0
  style.top = 0
  style.width = width * 0.2
  style.height = width * 0.05
  style.position = 'absolute'
  style.borderRight = 'solid rgb(150,150,150) ' + width * 0.011 * 1.6 + 'px'
  style.borderTop = 'solid rgb(150,150,150) ' + width * 0.011 + 'px'
  style.transform = 'skew(45deg)'
  style.msTransform = 'skew(45deg)'
  style.webkitTransform = 'skew(45deg)'
  label.appendChild(edge)

  var text = document.createElement('div')
  style = text.style
  style.position = 'absolute'
  style.right = width * 0.04
  style.top = height * 0.015
  style.width = width * 0.3
  style.textAlign = 'right'
  style.position = 'absolute'
  style.color = 'rgb(150,150,150)'
  style.fontFamily = 'Hack'
  style.fontSize = width * 0.04 + 'px'
  text.innerHTML = opts.name + ' '
  label.appendChild(text)

  var number = document.createElement('span')
  style = number.style
  style.color = 'rgb(200,200,200)'
  text.appendChild(number)

  function update (current, max) {
    number.innerHTML = current + '/' + max
  }

  return {
    update: update
  }
}
