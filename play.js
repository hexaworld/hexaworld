var _ = require('lodash')
var sprintf = require('sprintf-js').sprintf
var EventEmitter = require('eventemitter2').EventEmitter2
var State = require('./state.js')
var formatEvent = require('./util/events.js').formatEvent

module.exports = function (id, level) {
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
  var main = require('./ui/main.js')(container)
  var message = require('./ui/message.js')(container)
  var action = require('./ui/action.js')(container)
  var energy = require('./ui/energy.js')(container)
  var score = require('./ui/score.js')(container)
  var stages = require('./ui/stages.js')(container)

  var state = new State(level.config)

  var events = new EventEmitter()

  var game = require('./game.js')(main.canvas, level.maps[0])

  game.events.on(['player', 'collect'], function (event) {
    state.score.current += 10
    score.update(state.score, {magnitude: 0.15})
  })

  game.events.on(['player', 'exit'], function (event) {
    var count = 0
    var animation = setInterval(function () {
      state.energy.current -= 50
      energy.update(state.energy)
      count += 1
      if (count === 6) {
        clearInterval(animation);
      }
    }, 50)
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

  function endgame (text) {
    setTimeout(function () {
      message.show(text + '<br><br>\nSCORE ' + sprintf('%05d', state.score.current))
      action.show('TAP TO RESTART')
      action.events.on('click', function () {
        events.emit(['level', 'restart'], formatEvent({ level: level.config.name }))

        main.hide()
        action.hide()
        message.hide()

        setTimeout(function () {
          state.reload(level.config)
          game.reload(level.maps[0])
          setTimeout(function () {
            energy.update(state.energy)
            stages.update(state.stages)
            score.update(state.score)
            score.show()
            energy.show()
            stages.show()
            main.show()
          }, 600)
        }, 600)

      })

    }, 200)

  }

  function failed () {
    if (state.energy.current <= 0) {
      events.emit(['level', 'failed'], formatEvent({ level: level.config.name }))
      score.hide()
      energy.hide()
      stages.hide()
      endgame('GAME OVER')
    }
  }

  function completed () {
    events.emit(['map', 'completed'], formatEvent({ map: state.stages.current }))
    state.score.current += 2000
    score.update(state.score, {magnitude: 0.5, duration: 200})
    energy.update(state.energy)

    state.stages.current += 1
    stages.update(state.stages)

    setTimeout(function () {
      if (state.energy.current > 0) {
        var remaining = state.energy.current
        var counter = setInterval(function () {
          if (remaining <= 0) {
            clearInterval(counter)
          } else {
            state.score.current += Math.min(300, remaining) * 3
            remaining -= Math.min(300, remaining)
            score.update(state.score, {magnitude: 0.25, duration: 250})
          }
        }, 150)
      }

      if (state.stages.current === state.stages.total) {
        events.emit(['level', 'completed'], formatEvent({ level: level.config.name }))
        setTimeout(function () {
          score.hide()
          energy.hide()
          stages.hide()
          endgame('COMPLETE!')
        }, 1000)
      } else {
        
        setTimeout(function () {
          main.hide()
          setTimeout(function () {
            game.reload(level.maps[state.stages.current])
            setTimeout(function () {
              state.energy.current += 600
              energy.update(state.energy)
              main.show()
            }, 400)
          }, 400)
        }, 700)
      }
    }, 400)
  }

  function start () {
    if (state.stages.current === 0 && state.lives.current === state.lives.total) {
      events.emit(['level', 'started'], formatEvent({ level: level.config.name }))
    }
    energy.update(state.energy)
    stages.update(state.stages)
    score.update(state.score)
    message.show('FIND THE <br><br> \n WHITE HEX')

    //events.emit(['map', 'started'], formatEvent({ map: state.stages.current }))
    setTimeout(function () {
      game.start()
      setTimeout(function () {
        message.hide()
        score.show()
        energy.show()
        stages.show()
        main.show()
      }, 1200)
    }, 600) 
  }

  function reload (updated) {
    score.hide()
    energy.hide()
    stages.hide()
    main.hideQuick()
    message.hideQuick()
    action.hideQuick()
    level = load(updated)
    state.reload(level.config)
    main.canvas.style.opacity = 0
    game.reload(level.maps[state.stages.current])
    start()
  }

  return {
    pause: function () {
      game.pause()
    },

    resume: function () {
      game.resume()
    },

    reload: reload,

    start: start,

    events: events
  }
}
