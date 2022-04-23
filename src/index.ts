import './styles.css';
import Phaser from 'phaser';
import { WorldScene } from './world/scenes/WorldScene';

const WIDTH = 500;
const HEIGHT = 500;

class Game {
  game: Phaser.Game;

  constructor() {
    this.game = new Phaser.Game({
      type: Phaser.AUTO,
      width: WIDTH,
      height: HEIGHT,
      scene: [WorldScene],
    });
  }
}

new Game();
