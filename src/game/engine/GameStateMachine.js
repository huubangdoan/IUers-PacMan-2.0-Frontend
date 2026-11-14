class GameState {
  constructor(name) {
    this.name = name;
  }

  update() {}
  handleCommand() {}
  handleMessage() {}

  handleClose(game) {
    game.setConnection('Mất kết nối tới máy chủ game.');
    game.stateMachine.transition(new DisconnectedState());
  }

  finish() {}
}

class ConnectingState extends GameState {
  constructor() { super('connecting'); }

  update(game, deltaSeconds) {
    game.updateGhosts(deltaSeconds);
  }

  handleCommand(game, command) {
    command.execute(game);
  }

  handleMessage(game, message) {
    if (message.type === 'READY') {
      game.acceptReady(message);
      game.stateMachine.transition(new PlayingState());
    }
    else if (message.type === 'ERROR') {
      game.showServerError(message);
      game.stateMachine.transition(new DisconnectedState());
    }
  }
}

class PlayingState extends GameState {
  constructor() { super('playing'); }

  update(game, deltaSeconds) {
    game.advancePlayer(deltaSeconds);
    game.updateGhosts(deltaSeconds);
  }

  handleCommand(game, command) {
    command.execute(game);
  }

  handleMessage(game, message) {
    if (message.type === 'STATE') game.acceptState(message);
    else if (message.type === 'ERROR') {
      game.showServerError(message);
      game.stateMachine.transition(new DisconnectedState());
    }
    else if (message.type === 'FINISHED') {
      game.acceptFinished(message);
      game.stateMachine.transition(new FinishedState());
    }
  }

  handleClose(game) {
    game.setConnection('Mất kết nối tới máy chủ game.');
    game.stateMachine.transition(new DisconnectedState());
  }

  finish(game) {
    game.requestFinish();
    game.stateMachine.transition(new SavingState());
  }
}

class DisconnectedState extends GameState {
  constructor() { super('disconnected'); }

  update(game, deltaSeconds) {
    game.updateGhosts(deltaSeconds);
  }

  handleCommand(game, command) {
    command.execute(game);
  }

  handleMessage(game, message) {
    if (message.type === 'READY') {
      game.acceptReady(message);
      game.stateMachine.transition(new PlayingState());
    }
    else if (message.type === 'ERROR') game.showServerError(message);
  }
}

class SavingState extends GameState {
  constructor() { super('saving'); }

  handleMessage(game, message) {
    if (message.type === 'FINISHED') {
      game.acceptFinished(message);
      game.stateMachine.transition(new FinishedState());
    } else if (message.type === 'ERROR') {
      game.showServerError(message);
      game.failSave();
      game.stateMachine.transition(new DisconnectedState());
    }
  }

  handleClose(game) {
    game.failSave('Mất kết nối trước khi xác nhận lưu điểm.');
    game.stateMachine.transition(new DisconnectedState());
  }
}

class FinishedState extends GameState {
  constructor() { super('finished'); }

  handleClose() {}
}

export default class GameStateMachine {
  constructor() {
    this.state = new ConnectingState();
  }

  transition(nextState) {
    this.state = nextState;
  }

  update(game, deltaSeconds) {
    this.state.update(game, deltaSeconds);
  }

  handleCommand(game, command) {
    this.state.handleCommand(game, command);
  }

  handleMessage(game, message) {
    this.state.handleMessage(game, message);
  }

  handleClose(game) {
    this.state.handleClose(game);
  }

  finish(game) {
    this.state.finish(game);
  }
}
