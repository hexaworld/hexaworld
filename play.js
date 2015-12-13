var _ = require('lodash')
var State = require('./state.js')

module.exports = function (id, schemas, config, opts) {
  opts = opts || {size: 700}

  var container = document.getElementById(id)

  var main = require('./ui/main.js')(container, opts)
  var score = require('./ui/score.js')(container)
  var stages = require('./ui/stages.js')(container)
  var steps = require('./ui/steps.js')(container)
  var lives = require('./ui/lives.js')(container)
  var message = require('./ui/message.js')(container)

  var state = new State(config)

  var game = require('./game.js')(schemas[0], main.canvas)

  main.hide()
  message.show('WELCOME TO HEXAWORLD!')

  game.start()

  setTimeout( function() {
    message.hide()
    main.show()
  }, 2000)

  game.events.on(['player', 'collect'], function(event) {
    state.score.current += 10
    score.update(state.score)
  })

  game.events.on(['player', 'exit'], function(event) {
    state.steps.current -= 1
    steps.update(state.steps)
  })

  game.events.on(['player', 'enter'], function(event) {
    if (_.isEqual(event.tile, schemas[state.stages.current].gameplay.target)) {
      completed()
    } else {
      failed()
    }
  })

  function completed() {
    if (state.stages.current === state.stages.total) {
      game.flash()
      setTimeout( function() { 
        main.hide()
        message.show('YOU WON!')
      }, 1000)
    } else {
      game.flash()
      state.stages.current += 1
      stages.update(state.stages)
      state.score.current += 1000
      state.steps.current = state.steps.total
      score.update(state.score)
      steps.update(state.steps)
      setTimeout( function() { 
        main.hide()
        message.show('YOU DID IT!')
        setTimeout( function() {
          game.reload(schemas[state.stages.current])
          message.hide()
          main.show()
        }, 1000)
      }, 1000)
    }
  }

  function failed() {
    if (state.steps.current === 0 & state.lives.current === 1) {
      state.lives.current -= 1
      lives.update(state.lives)
      main.hide()
      message.show('GAME OVER')
    }

    if (state.steps.current === 0 & state.lives.current > 1) {
      main.hide()
      message.show('OH NO!')
      state.lives.current -= 1
      lives.update(state.lives)
      setTimeout( function() {
        state.steps.current = state.steps.total
        steps.update(state.steps)
        game.moveto(schemas[state.stages.current].gameplay.start)
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