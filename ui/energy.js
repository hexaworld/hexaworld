module.exports = function (container) {
  var width = container.clientWidth
  var height = container.clientHeight
  var style

  var label = document.createElement('div')
  style = label.style
  style.right = width * 0.2
  style.bottom = height * 0.1
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
  style.borderRight = 'solid rgb(200,200,200) 8px'
  style.borderBottom = 'solid rgb(200,200,200) 5px'
  style.transform = 'skew(-45deg)'
  label.appendChild(edge)

  var text = document.createElement('div')
  style = text.style
  style.position = 'absolute'
  style.left = -width * 0.02
  style.bottom = -height * 0.05
  style.width = width * 0.2
  style.textAlign = 'left'
  style.position = 'absolute'
  style.color = 'rgb(150,150,150)'
  style.fontFamily = 'Hack'
  style.fontSize = '24px'
  text.innerHTML = 'energy'
  label.appendChild(text)

  var energy = document.createElement('span')
  style = energy.style
  style.color = 'rgb(200,200,200)'
  style.fontFamily = 'Hack'
  style.fontSize = '20px'
  label.appendChild(energy)

  function update (percent) {
    energy.innerHTML = percent + '%'
  }

  return {
    update: update
  }
}
