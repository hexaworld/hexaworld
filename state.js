module.exports = State

function State (schema) {
  if (!(this instanceof State)) {
    return new State(schema)
  }
  this.reload(schema)
}

State.prototype.reload = function (schema) {
  this.score = 0
  this.lives = {current: schema.lives, total: schema.lives}
  this.steps = {current: schema.steps, total: schema.steps}
  this.stages = {name: schema.name, current: 1, total: schema.stages}
}
