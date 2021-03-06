/**
 * Responsible for initializing the connection to socket.io.
 * @param io [Socket]
 * @param fsm [StateMachine]
 */
var SocketLayer = function(io, proxy) {
  this.io = io;
  this.proxy = proxy;
}

/**
 * Attempt a connection to socket.io server.
 * If this fails, will no-op and silently continue.
 */
SocketLayer.prototype.init = function() {
  try {
    this.socket = this.io.connect("/");
    this.proxy.lateInitialize(this.socket);
  } catch(e) {
    console.log("Error initializing socket connection: " + e);
  }
  return this;
}

/**
 * Register bindings and callbacks.
 */
SocketLayer.prototype.register = function(fsm) {
  this.fsm = fsm;
  var self = this;

  this.proxy.on('message', function(data) {
    console.log('message evt: data is:' + data);
  });

  this.proxy.on('connect', function() {
    console.log('connected evt');
    self.fsm.connected();
  });
  this.proxy.on('brew_started', function() {
    console.log('brew_started evt');
    self.fsm.brew_started();
  });
  this.proxy.on('camera_snapped', function() {
    console.log('camera_snapped evt');
    //fsm.camera_snapped();
  })
  this.proxy.on('brew_stopped', function() {
    console.log('brew_stopped evt');
    self.fsm.brew_stopped();
  });

  this.proxy.on('photo_saved', function(data) {
    for(item in data){
      console.log('photo_saved evt: ' + item.filename);
    }
    self.fsm.photo_saved(data);
  });
}
