var _ = require('lodash')
var State = require('./state.js')

module.exports = function (id, level, opts) {
  opts = opts || {size: 700}

  var tmp
  var maps = []
  level.maps.forEach(function (map) {
    map.start.forEach(function (start) {
      tmp = _.cloneDeep(map)
      tmp.start = [start]
      maps.push(tmp)
    })
  })

  var config = level.config
  config.stages = maps.length

  var container = document.getElementById(id)

  var main = require('./ui/main.js')(container, opts)
  var score = require('./ui/score.js')(container)
  var stages = require('./ui/stages.js')(container)
  var steps = require('./ui/steps.js')(container)
  var lives = require('./ui/lives.js')(container)
  var message = require('./ui/message.js')(container)

  var state = new State(config)

  var game = require('./game.js')(main.canvas, maps[0])

  main.hide()
  message.show('WELCOME TO HEXAWORLD!')

  game.start()

  setTimeout(function () {
    message.hide()
    main.show()
  }, 2000)

  game.events.on(['player', 'collect'], function (event) {
    state.score.current += 10
    score.update(state.score)
  })

  game.events.on(['player', 'exit'], function (event) {
    state.steps.current -= 1
    steps.update(state.steps)
  })

  game.events.on(['player', 'enter'], function (event) {
    if (_.isEqual(event.tile, maps[state.stages.current].target)) {
      completed()
    } else {
      failed()
    }
  })

  function completed () {
    if (state.stages.current === state.stages.total - 1) {
      game.flash()
      setTimeout(function () {
        main.hide()
        message.show('LEVEL COMPLETE')
      }, 1000)
    } else {
      game.flash()
      state.stages.current += 1
      stages.update(state.stages)
      state.score.current += 1000
      state.steps.current = state.steps.total
      score.update(state.score)
      steps.update(state.steps)
      setTimeout(function () {
        main.hide()
        message.show('YOU DID IT!')
        setTimeout(function () {
          game.reload(maps[state.stages.current])
          message.hide()
          main.show()
        }, 1000)
      }, 600)
    }
  }

  function failed () {
    if (state.steps.current === 0 & state.lives.current === 1) {
      state.lives.current -= 1
      lives.update(state.lives)
      main.hide()
      message.show('GAME OVER')
    }

    if (state.steps.current === 0 & state.lives.current > 1) {
      main.hide()
      message.show('OUTTA STEPS TRY AGAIN')
      state.lives.current -= 1
      lives.update(state.lives)
      setTimeout(function () {
        state.steps.current = state.steps.total
        steps.update(state.steps)
        game.moveto(maps[state.stages.current].start[0])
        message.hide()
        main.show()
      }, 1000)
    }
  }

  score.update(state.score)
  stages.update(state.stages)
  steps.update(state.steps)
  lives.update(state.lives)
}
