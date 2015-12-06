module.exports = function(container, max) {
	var width = container.clientWidth
	var height = container.clientHeight

	var label = document.createElement('div')
  	var styles = label.style
	styles.right = width * 0.225
	styles.top = height * 0.075
	styles.width = width * 0.2
	styles.height = width * 0.05
	styles.position = 'absolute'
	container.appendChild(label)

	var edge = document.createElement('div')
  	var styles = edge.style
	styles.left = 0
	styles.top = 0
	styles.width = width * 0.2
	styles.height = width * 0.06
	styles.position = 'absolute'
	styles.borderBottom = 'solid rgb(200,200,200) 5px'
	styles.borderLeft = 'solid rgb(200,200,200) 8px'
	styles.transform = 'skew(45deg)'
	label.appendChild(edge)

	var text = document.createElement('div')
	var styles = text.style
	styles.position = 'absolute'
	styles.left = width * 0.04
	styles.bottom = height * 0.005
	styles.width = width * 0.3
	styles.position = 'absolute'
	styles.color = 'rgb(150,150,150)'
	styles.fontFamily = 'Hack'
	styles.fontSize = '20px'
	text.innerHTML = 'score '
	label.appendChild(text)

	var number = document.createElement('span')
	var style = number.style
	style.color = 'rgb(200,200,200)'
	text.appendChild(number)

	function update(count) {
		number.innerHTML = count
	}

	return {
		update: update
	}
}