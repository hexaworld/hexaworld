module.exports = function (container, max) {
  var width = container.clientWidth
  var height = container.clientHeight
  var style

  var label = document.createElement('div')
  style = label.style
  style.right = width * 0.225
  style.top = height * 0.075
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
  style.borderBottom = 'solid rgb(150,150,150) 5px'
  style.borderLeft = 'solid rgb(150,150,150) 8px'
  style.transform = 'skew(45deg)'
  style.msTransform = 'skew(45deg)'
  style.webkitTransform = 'skew(45deg)'
  label.appendChild(edge)

  var text = document.createElement('div')
  style = text.style
  style.position = 'absolute'
  style.left = width * 0.04
  style.bottom = height * 0.001
  style.width = width * 0.3
  style.position = 'absolute'
  style.color = 'rgb(150,150,150)'
  style.fontFamily = 'Hack'
  style.fontSize = width * 0.04 + 'px'
  text.innerHTML = 'score '
  label.appendChild(text)

  var number = document.createElement('span')
  style = number.style
  style.color = 'rgb(200,200,200)'
  text.appendChild(number)

  function update (count) {
    number.innerHTML = count
  }

  return {
    update: update
  }
}
