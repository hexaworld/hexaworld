module.exports = {
  formatEvent: function formatEvent (event) {
    event = event || {}
    event['time'] = (new Date()).toISOString()
    return event
  }
}
