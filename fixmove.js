function Fixmove (data) {
  if (!data) data = {}
  this.speed = data.speed || {translation: 1, rotation: 10}
}

Fixmove.prototype.compute = function (current, target) {
  return this.delta(current, target)
}

Fixmove.prototype.delta = function (current, target) {
  var dist = current.distance(target)

  var speed = this.speed
  var velocity = {translation: 1, rotation: 1}
  var diff = current.difference(target)

  if (dist.translation > speed.translation) {
    diff.translation[0] = diff.translation[0] / dist.translation
    diff.translation[1] = diff.translation[1] / dist.translation
    velocity.translation = speed.translation
  }

  if (dist.rotation > speed.rotation) {
    diff.rotation = diff.rotation / dist.rotation
    velocity.rotation = speed.rotation
    if (dist.translation > speed.translation) velocity.rotation = speed.translation * dist.rotation / dist.translation
  }

  return {
    translation: [
      diff.translation[0] * velocity.translation,
      diff.translation[1] * velocity.translation
    ],
    rotation: diff.rotation * velocity.rotation
  }
}

module.exports = Fixmove
