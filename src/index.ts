import './styles.css';
import Phaser from 'phaser';
import { WorldScene } from './world/scenes/WorldScene';

const WIDTH = window.innerWidth;
const HEIGHT = window.innerHeight;

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
