module.exports = State

function State (opts) {
  if (!(this instanceof State)) {
    return new State(opts)
  }
  this.reload(opts)
}

State.prototype.reload = function (opts) {
  this.completed = 0
  this.score = {current: 0}
  this.lives = {current: opts.lives, total: opts.lives}
  this.steps = {current: opts.steps, total: opts.steps}
  this.stages = {name: opts.name, current: 0, total: opts.stages}
}
