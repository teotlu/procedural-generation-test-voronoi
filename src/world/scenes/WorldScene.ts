import Phaser from 'phaser';
import seedrandom from 'seedrandom';
import { Vector2D } from '../../helpers/geometry';
import { getPointColor } from '../biomes';
import { WorldChunk } from '../chunks/WorldChunk';
import { WorldChunksManager } from '../chunks/WorldChunksManager';
import { KeyboardInputManager } from '../input/KeyboardInputManager';

export class WorldScene extends Phaser.Scene {
  private graphics?: Phaser.GameObjects.Graphics;
  private chunkSize = 100;

  private cameraPosition = new Vector2D(0, 0);
  private cameraVelocity = 3;

  private inputManager?: KeyboardInputManager;

  private chunksManager = new WorldChunksManager('seed4', this.chunkSize);
  private prng = seedrandom('seed');

  constructor() {
    super({ key: 'world' });
  }

  preload() {
    this.graphics = this.add.graphics(); //.setVisible(false);
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
    // console.log(
    //   `spawn chunk with position ${chunkPosition.x},${chunkPosition.y}`,
    // );
    const chunk = this.chunksManager.spawnChunk(chunkPosition);
    // console.log(
    //   `draw chunk at position ${chunk.position.x},${chunk.position.y}`,
    // );
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
    // TODO World renderer
    if (!this.graphics) return;
    const chunkShiftX = (chunk.position.x - 0.5) * this.chunkSize;
    const chunkShiftY = (chunk.position.y - 0.5) * this.chunkSize;
    // const chunkTexture = this.add.renderTexture(
    //   chunkShiftX,
    //   chunkShiftY,
    //   this.chunkSize,
    //   this.chunkSize,
    // );
    // for (let x = 0; x < this.chunkSize; x += this.chunkCellSize) {
    //   for (let y = 0; y < this.chunkSize; y += this.chunkCellSize) {
    //     this.graphics.fillStyle(getPointColor(chunk.points[x][y]), 1);
    //     this.graphics.fillPoint(
    //       chunkShiftX + x + this.chunkCellSize / 2,
    //       chunkShiftY + y + this.chunkCellSize / 2,
    //       this.chunkCellSize,
    //     );
    //   }
    // }
    // this.graphics.lineStyle(1, 0x00ff00, 1);
    // this.graphics.strokeRect(
    //   chunkShiftX + chunk.position.x,
    //   chunkShiftY + chunk.position.y,
    //   this.chunkSize,
    //   this.chunkSize,
    // );
    // const color = 0.5 + (Math.random() / 0.5) * 16777215;
    // this.graphics.fillStyle(color, 1);
    // this.graphics.lineStyle(1, color, 1);

    chunk.voronoi.forEachCell((p, vertices) => {
      if (!chunk.isSiteInBounds(chunk.sites[p].center)) return;
      this.graphics?.beginPath();
      this.graphics?.moveTo(
        chunkShiftX + vertices[0][0],
        chunkShiftY + vertices[0][1],
      );
      for (let i = 1; i < vertices.length; i++) {
        const vertice = vertices[i];
        this.graphics?.lineTo(
          chunkShiftX + vertice[0],
          chunkShiftY + vertice[1],
        );
      }
      this.graphics?.closePath();
      this.graphics?.fillStyle(
        getPointColor(chunk.sites[p].biome),
        this.prng() * 0.1 + 0.7,
      );
      this.graphics?.fillPath();
      // this.graphics?.lineStyle(
      //   1,
      //   getPointColor(chunk.sites[p].biome),
      //   this.prng() * 0.2,
      // );
      // this.graphics?.strokePath();
    });

    // chunk.sites.forEach((s) => {
    //   if (!chunk.isSiteInBounds(s)) return;
    //   this.graphics?.fillPoint(chunkShiftX + s[0], chunkShiftY + s[1], 2);
    // });

    // chunkTexture.draw(this.graphics);
  }
}
