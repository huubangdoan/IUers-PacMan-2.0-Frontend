import { DIRECTIONS } from './directions';
import MoveCommand from './MoveCommand';

export default class KeyboardController {
  constructor(dispatchCommand) {
    this.dispatchCommand = dispatchCommand;
    this.handleKeyDown = this.handleKeyDown.bind(this);
  }

  start() {
    window.addEventListener('keydown', this.handleKeyDown);
  }

  stop() {
    window.removeEventListener('keydown', this.handleKeyDown);
  }

  handleKeyDown(event) {
    const direction = DIRECTIONS[event.key];
    if (!direction) return;
    event.preventDefault();
    this.dispatchCommand(new MoveCommand(direction));
  }
}
