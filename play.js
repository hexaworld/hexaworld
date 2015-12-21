var _ = require('lodash')
var EventEmitter = require('eventemitter2').EventEmitter2
var State = require('./state.js')
var formatEvent = require('./util/events.js').formatEvent

module.exports = function (id, level, opts) {
  opts = opts || {size: 700}

  function load (level) {
    var tmp
    var maps = []
    level.maps.forEach(function (map) {
      map.start.forEach(function (start) {
        tmp = _.cloneDeep(map)
        tmp.start = [start]
        maps.push(tmp)
      })
    })
    var config = _.cloneDeep(level.config)
    config.stages = maps.length
    return {maps: maps, config: config}
  }

  level = load(level)

  var container = document.getElementById(id)

  var main = require('./ui/main.js')(container, opts)
  var score = require('./ui/score.js')(container)
  var stages = require('./ui/stages.js')(container)
  var moves = require('./ui/moves.js')(container)
  var lives = require('./ui/lives.js')(container)
  var message = require('./ui/message.js')(container)

  var state = new State(level.config)

  var events = new EventEmitter()

  var game = require('./game.js')(main.canvas, level.maps[0])

  game.events.on(['player', 'collect'], function (event) {
    state.score.current += 10
    score.update(state.score)
  })

  game.events.on(['player', 'exit'], function (event) {
    state.moves.current -= 1
    moves.update(state.moves)
  })

  game.events.on(['player', 'enter'], function (event) {
    if (_.isEqual(event.tile, level.maps[state.stages.current].target)) {
      completed()
    } else {
      failed()
    }
  })

  game.events.onAny(function (event) {
    events.emit(this.event, event)
  })

  function completed () {
    events.emit(['map', 'completed'], formatEvent({ map: state.stages.current }))
    state.score.current += 1000 + state.moves.current * 100
    score.update(state.score)
    if (state.stages.current === state.stages.total - 1) {
      game.flash()
      events.emit(['level', 'completed'], formatEvent({ level: level.config.name }))
      setTimeout(function () {
        main.hide()
        message.show('LEVEL COMPLETE')
      }, 1000)
    } else {
      game.flash()
      state.stages.current += 1
      stages.update(state.stages)
      state.moves.current = state.moves.total
      score.update(state.score)
      moves.update(state.moves)
      setTimeout(function () {
        main.hide()
        message.show('YOU DID IT!')
        setTimeout(function () {
          game.reload(level.maps[state.stages.current])
          message.hide()
          main.show()
        }, 1000)
      }, 600)
    }
  }

  function failed () {
    if (state.moves.current === 0 & state.lives.current === 1) {
      events.emit(['level', 'failed'], formatEvent({ level: level.config.name }))
      state.lives.current -= 1
      lives.update(state.lives)
      main.hide()
      message.show('GAME OVER')
    }

    if (state.moves.current === 0 & state.lives.current > 1) {
      main.hide()
      message.show('OUT OF STEPS TRY AGAIN')
      events.emit(['map', 'failed'], formatEvent({ map: state.stages.current }))
      state.lives.current -= 1
      lives.update(state.lives)
      setTimeout(function () {
        state.moves.current = state.moves.total
        moves.update(state.moves)
        game.moveto(level.maps[state.stages.current].start[0])
        message.hide()
        main.show()
      }, 1000)
    }
  }

  function start () {
    if (state.stages.current === 0 && state.lives.current === state.lives.total) {
      events.emit(['level', 'started'], formatEvent({ level: level.config.name }))
    }
    score.update(state.score)
    stages.update(state.stages)
    moves.update(state.moves)
    lives.update(state.lives)
    score.show()
    stages.show()
    moves.show()
    lives.show()
    main.hide()
    message.show('GET READY!')
    events.emit(['map', 'started'], formatEvent({ map: state.stages.current }))
    setTimeout(function () {
      message.hide()
      main.show()
    }, 1000)
    game.start()
  }

  return {
    pause: function () {
      game.pause()
    },

    resume: function () {
      game.resume()
    },

    reload: function (updated) {
      level = load(updated)
      state.reload(level.config)
      game.reload(level.maps[state.stages.current])
      start()
    },

    start: start,

    events: events
  }
}
