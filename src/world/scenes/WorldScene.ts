import Phaser from 'phaser';
import { Vector2D } from '../../helpers/geometry';
// import { getPointColor } from '../biomes';
import { WorldChunk } from '../chunks/WorldChunk';
import { WorldChunksManager } from '../chunks/WorldChunksManager';
import { KeyboardInputManager } from '../input/KeyboardInputManager';

export class WorldScene extends Phaser.Scene {
  private graphics?: Phaser.GameObjects.Graphics;
  private chunkCellSize = 40;
  private chunkSize = 200;

  private cameraPosition = new Vector2D(0, 0);
  private cameraVelocity = 3;

  private inputManager?: KeyboardInputManager;

  private chunksManager = new WorldChunksManager(
    'seed',
    this.chunkSize,
    this.chunkCellSize,
  );

  constructor() {
    super({ key: 'world' });
  }

  preload() {
    this.graphics = this.add.graphics().setVisible(false);
    this.inputManager = new KeyboardInputManager(this.input.keyboard);
  }

  create() {
    this.cameras.main.centerOn(this.cameraPosition.x, this.cameraPosition.y);
    this.cameras.main.setZoom(1);
    this.updateVisibleChunks();
  }

  update() {
    this.updatePlayerPosition();

    this.updateVisibleChunks();
    this.cameras.main.centerOn(this.cameraPosition.x, this.cameraPosition.y);
  }

  private updateVisibleChunks() {
    const chunkPosition = this.getChunkPosition();
    if (!!this.chunksManager.spawnedChunks[chunkPosition.hash]) return;
    console.log(
      `spawn chunk with position ${chunkPosition.x},${chunkPosition.y}`,
    );
    const chunk = this.chunksManager.spawnChunk(chunkPosition);
    console.log(
      `draw chunk at position ${chunk.position.x},${chunk.position.y}`,
    );
    this.drawChunk(chunk);
  }

  private getChunkPosition() {
    return new Vector2D(
      Math.floor(
        (this.cameraPosition.x + 0.5 * this.chunkSize) / this.chunkSize,
      ),
      Math.floor(
        (this.cameraPosition.y + 0.5 * this.chunkSize) / this.chunkSize,
      ),
    );
  }

  private updatePlayerPosition() {
    if (!this.inputManager) return;
    const { up, down, left, right } = this.inputManager.keyBinds;

    if (up.isDown) {
      this.cameraPosition = new Vector2D(
        this.cameraPosition.x,
        this.cameraPosition.y - this.cameraVelocity,
      );
    }

    if (down.isDown) {
      this.cameraPosition = new Vector2D(
        this.cameraPosition.x,
        this.cameraPosition.y + this.cameraVelocity,
      );
    }

    if (left.isDown) {
      this.cameraPosition = new Vector2D(
        this.cameraPosition.x - this.cameraVelocity,
        this.cameraPosition.y,
      );
    }

    if (right.isDown) {
      this.cameraPosition = new Vector2D(
        this.cameraPosition.x + this.cameraVelocity,
        this.cameraPosition.y,
      );
    }
  }

  private drawChunk(chunk: WorldChunk) {
    if (!this.graphics) return;
    const chunkTexture = this.add.renderTexture(
      (chunk.position.x - 0.5) * this.chunkSize,
      (chunk.position.y - 0.5) * this.chunkSize,
      this.chunkSize,
      this.chunkSize,
    );
    // for (let x = 0; x < this.chunkSize; x += this.chunkCellSize) {
    //   for (let y = 0; y < this.chunkSize; y += this.chunkCellSize) {
    //     this.graphics.fillStyle(getPointColor(chunk.points[x][y]), 1);
    //     this.graphics.fillPoint(x, y, this.chunkCellSize);
    //   }
    // }
    this.graphics.fillStyle(0x00ff00, 1);
    this.graphics.fillRect(
      chunk.position.x,
      chunk.position.y,
      this.chunkSize,
      this.chunkSize,
    );
    this.graphics.fillStyle(0x0000ff, 1);
    chunk.sites.forEach((s) => this.graphics?.fillPoint(s[0], s[1], 2));

    chunkTexture.draw(this.graphics);
  }
}
