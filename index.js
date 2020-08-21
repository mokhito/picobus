const MQTT = require('mqtt')
const Utils = require('./utils')

class PicoBus {
  constructor(url) {
    let _this = this
    _this.client = MQTT.connect(url)
    _this.subscriptions = {}

    _this.client.on('connect', function() {
      console.log("PicoBus:", "Connected to event bus.")
    })

    _this.client.on('message', function(channel, payload) {
      let { eventName, content } = JSON.parse(payload)

      if (eventName in _this.subscriptions[channel]) {
        console.log("PicoBus:", `Received '${eventName}' in '${channel}'.`)
        let cb = _this.subscriptions[channel][eventName]
        cb(content)
      }

    })

  }

  subscribe(channel, channelCallback) {
    console.log("PicoBus:", `Subscribing to '${channel}'.`)
    let _this = this
    _this.client.subscribe(channel)
    _this.subscriptions[channel] = {}

    channelCallback({
      on(eventName, eventCallback) {
        _this.subscriptions[channel][eventName] = eventCallback
      }
    })
  }

  unsubscribe(channel) {
    delete this.subscriptions[channel]
    this.client.unsubscribe(channel)
  }

  emit(channel, eventName, content) {
    console.log("PicoBus:", `Emitting '${eventName}' in '${channel}'.`)
    let payload = Utils.safeStringify({
      eventName: eventName,
      content: content
    })
    this.client.publish(channel, payload)
  }
}

module.exports = PicoBus