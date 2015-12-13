module.exports = function (container) {
  var width = container.clientWidth
  var height = container.clientHeight
  var style

  var label = document.createElement('div')
  style = label.style
  style.left = width * 0.2
  style.bottom = height * 0.1
  style.width = width * 0.2
  style.height = width * 0.05
  style.position = 'absolute'
  container.appendChild(label)

  var edge = document.createElement('div')
  style = edge.style
  style.left = 0
  style.top = 0
  style.width = width * 0.2
  style.height = width * 0.06
  style.position = 'absolute'
  style.borderBottom = 'solid rgb(150,150,150) ' + width * 0.011 + 'px'
  style.borderLeft = 'solid rgb(150,150,150) ' + width * 0.011 * 1.6 + 'px'
  style.transform = 'skew(45deg)'
  style.msTransform = 'skew(45deg)'
  style.webkitTransform = 'skew(45deg)'
  label.appendChild(edge)

  var text = document.createElement('div')
  style = text.style
  style.position = 'absolute'
  style.right = width * 0.0
  style.marginRight = -width * 0.02
  style.bottom = -height * 0.05
  style.width = width * 0.3
  style.position = 'absolute'
  style.textAlign = 'right'
  style.color = 'rgb(150,150,150)'
  style.fontFamily = 'Hack'
  style.fontSize = width * 0.04 + 'px'
  text.innerHTML = 'score '
  label.appendChild(text)

  var number = document.createElement('span')
  style = number.style
  style.color = 'rgb(200,200,200)'
  style.right = width * 0.0
  style.marginRight = -width * 0.02
  style.width = width * 0.3
  style.position = 'absolute'
  style.textAlign = 'right'
  style.fontFamily = 'Hack'
  style.fontSize = width * 0.04 + 'px'
  label.appendChild(number)

  function update (state) {
    number.innerHTML = state
  }

  return {
    update: update
  }
}
