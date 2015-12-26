var _ = require('lodash')
var sprintf = require('sprintf-js').sprintf
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
    config.energy = 2400
    return {maps: maps, config: config}
  }

  level = load(level)

  var container = document.getElementById(id)

  var main = require('./ui/main.js')(container, opts)
  var message = require('./ui/message.js')(container)
  var energy = require('./ui/energy.js')(container)
  var score = require('./ui/score.js')(container)
  var stages = require('./ui/stages.js')(container)

  var state = new State(level.config)

  var events = new EventEmitter()

  var game = require('./game.js')(main.canvas, level.maps[0])

  game.events.on(['player', 'collect'], function (event) {
    state.energy.current += 50
    state.score.current += 10
    energy.update(state.energy)
    score.update(state.score)
  })

  game.events.on(['player', 'exit'], function (event) {
    state.energy.current -= 600
    energy.update(state.energy)
  })

  game.events.on(['player', 'enter'], function (event) {
    console.log(state.energy.current)
    if (_.isEqual(event.tile, level.maps[state.stages.current].target)) {
      completed()
    } else {
      failed()
    }
  })

  game.events.onAny(function (event) {
    events.emit(this.event, event)
  })

  function endgame (text) {
    setTimeout(function () {
      message.show(text + ' \n SCORE ' + sprintf('%05d', state.score.current))
    }, 500)
  }

  function failed () {
    if (state.energy.current <= 0) {
      energy.blink()
      events.emit(['level', 'failed'], formatEvent({ level: level.config.name }))
      main.hide()
      endgame('GAME OVER')
    }
  }

  function completed () {
    events.emit(['map', 'completed'], formatEvent({ map: state.stages.current }))
    state.score.current += 2000
    score.update(state.score, {magnitude: 0.5, duration: 300})
    energy.update(state.energy)
    game.flash()

    setTimeout(function () {
      var old = state.energy.current

      if (state.energy.current > 0) {
        var counter = setInterval(function () {
          if (state.energy.current === 0) { clearInterval(counter) }
          state.score.current += Math.min(100, state.energy.current) * 3
          state.energy.current -= Math.min(100, state.energy.current)
          energy.update(state.energy)
          score.update(state.score, {magnitude: 0.5, duration: 200})
        }, 20)
      }

      if (state.stages.current === state.stages.total - 1) {
        events.emit(['level', 'completed'], formatEvent({ level: level.config.name }))
        setTimeout(function () {
          main.hide()
          endgame('COMPLETE!')
        }, 700)
      } else {
        state.stages.current += 1
        setTimeout(function () {
          main.hide()
          setTimeout(function () {
            game.reload(level.maps[state.stages.current])
            stages.update(state.stages)
            state.energy.current = old + 900
            energy.update(state.energy)
            main.show()
          }, 400)
        }, 700)
      }
    }, 500)
  }

  function start () {
    if (state.stages.current === 0 && state.lives.current === state.lives.total) {
      events.emit(['level', 'started'], formatEvent({ level: level.config.name }))
    }
    energy.update(state.energy)
    stages.update(state.stages)
    message.show('FIND THE CIRCLE!')
    events.emit(['map', 'started'], formatEvent({ map: state.stages.current }))
    setTimeout(function () {
      message.hide()
      main.show()
      score.show()
      energy.show()
      stages.show()
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
