import Phaser from 'phaser';
import { Vector2D } from '../../helpers/geometry';
import { Limits } from '../../helpers/limits';
import { getPointColor } from '../biomes';
import { WorldChunk } from '../chunks/WorldChunk';
import { WorldChunksManager } from '../chunks/WorldChunksManager';
import { KeyboardInputManager } from '../input/KeyboardInputManager';

export class WorldScene extends Phaser.Scene {
  private graphics?: Phaser.GameObjects.Graphics;
  private chunkSize = 256;
  private reservedChunks = 1;

  private chunkTextures: Record<string, Phaser.GameObjects.RenderTexture> = {};

  private cameraPosition = new Vector2D(0, 0);
  private cameraZoom = 1;
  private cameraZoomLimits = new Limits(0.5, 5);
  private cameraVelocity = 2;

  private inputManager?: KeyboardInputManager;

  private chunksManager = new WorldChunksManager('see694', this.chunkSize);

  constructor() {
    super({ key: 'world' });
  }

  preload() {
    this.graphics = this.add.graphics().setVisible(false);
    this.inputManager = new KeyboardInputManager(this.input.keyboard);
  }

  create() {
    this.cameras.main.centerOn(this.cameraPosition.x, this.cameraPosition.y);
    this.updateVisibleChunks();
  }

  update() {
    this.applyInput();

    this.updateVisibleChunks();
    this.cameras.main.centerOn(this.cameraPosition.x, this.cameraPosition.y);
    this.cameras.main.setZoom(this.cameraZoom);
  }

  private updateVisibleChunks() {
    const chunkPositions = this.visibleChunkPositions;

    chunkPositions.forEach((p) => {
      if (!!this.chunksManager.spawnedChunks[p.hash]) return;
      // console.log(`spawn chunk with position ${p.x},${p.y}`);
      const chunk = this.chunksManager.spawnChunk(p);
      // console.log(`draw chunk at position ${p.x},${p.y}`);
      this.drawChunk(chunk);
    });

    Object.values(this.chunksManager.spawnedChunks).forEach((c) => {
      if (!chunkPositions.some((p) => p.hash === c.position.hash)) {
        this.chunksManager.removeChunk(c.position);
        this.undrawChunk(c);
      }
    });

    // console.log(
    //   `chunks count: ${Object.values(this.chunksManager.spawnedChunks).length}`,
    // );
  }

  private get visibleChunkPositions(): Vector2D[] {
    const centerPosition = new Vector2D(
      Math.floor(this.cameraPosition.x / this.chunkSize + 0.5),
      Math.floor(this.cameraPosition.y / this.chunkSize + 0.5),
    );
    const chunksCountInViewport = this.chunksCountInViewport;
    const halfOfChunksInViewPort = new Vector2D(
      Math.floor(chunksCountInViewport.x / 2),
      Math.floor(chunksCountInViewport.y / 2),
    );
    const positions = [];
    for (let x = 0; x < chunksCountInViewport.x; x++) {
      for (let y = 0; y < chunksCountInViewport.y; y++) {
        positions.push(
          new Vector2D(
            centerPosition.x - halfOfChunksInViewPort.x + x,
            centerPosition.y - halfOfChunksInViewPort.y + y,
          ),
        );
      }
    }
    return positions;
  }

  get chunksCountInViewport() {
    const viewportWidth = this.cameras.main.width / this.cameras.main.zoom;
    const viewportHeight = this.cameras.main.height / this.cameras.main.zoom;
    return new Vector2D(
      viewportWidth / this.chunkSize + this.reservedChunks * 2,
      viewportHeight / this.chunkSize + this.reservedChunks * 2,
    );
  }

  private applyInput() {
    if (!this.inputManager) return;
    const {
      up,
      down,
      left,
      right,
      zoomIn,
      zoomOut,
    } = this.inputManager.keyBinds;

    if (up.isDown) {
      this.cameraPosition = new Vector2D(
        this.cameraPosition.x,
        this.cameraPosition.y - this.cameraVelocity / this.cameraZoom,
      );
    }

    if (down.isDown) {
      this.cameraPosition = new Vector2D(
        this.cameraPosition.x,
        this.cameraPosition.y + this.cameraVelocity / this.cameraZoom,
      );
    }

    if (left.isDown) {
      this.cameraPosition = new Vector2D(
        this.cameraPosition.x - this.cameraVelocity / this.cameraZoom,
        this.cameraPosition.y,
      );
    }

    if (right.isDown) {
      this.cameraPosition = new Vector2D(
        this.cameraPosition.x + this.cameraVelocity / this.cameraZoom,
        this.cameraPosition.y,
      );
    }

    if (zoomIn.isDown) {
      this.cameraZoom = this.cameraZoomLimits.getLimitedValue(
        this.cameraZoom * 1.05,
      );
    }

    if (zoomOut.isDown) {
      this.cameraZoom = this.cameraZoomLimits.getLimitedValue(
        this.cameraZoom / 1.05,
      );
    }
  }

  private drawChunk(chunk: WorldChunk) {
    // TODO World renderer
    if (!this.graphics) return;
    this.graphics.clear();
    const chunkShiftX = (chunk.position.x - 0.5) * this.chunkSize;
    const chunkShiftY = (chunk.position.y - 0.5) * this.chunkSize;

    this.chunkTextures[chunk.position.hash] = this.add.renderTexture(
      chunkShiftX - this.chunkSize / 2,
      chunkShiftY - this.chunkSize / 2,
      2 * this.chunkSize,
      2 * this.chunkSize,
    );

    chunk.voronoi.forEachCell((p, vertices) => {
      const site = chunk.sites[p];
      if (!chunk.isSiteInBounds(site.center)) return;
      this.graphics?.beginPath();
      this.graphics?.moveTo(
        this.chunkSize / 2 + vertices[0][0],
        this.chunkSize / 2 + vertices[0][1],
      );
      for (let i = 1; i < vertices.length; i++) {
        const vertice = vertices[i];
        this.graphics?.lineTo(
          this.chunkSize / 2 + vertice[0],
          this.chunkSize / 2 + vertice[1],
        );
      }
      this.graphics?.closePath();
      this.graphics?.fillStyle(getPointColor(site.biome), 1);
      this.graphics?.fillPath();
      // this.graphics?.lineStyle(1, getPointColor(site.biome), 0.8);
      // this.graphics?.strokePath();
    });

    // chunk.sites.forEach((s) => {
    //   if (!chunk.isSiteInBounds(s.center)) return;
    //   this.graphics?.fillPoint(
    //     chunkShiftX + s.center[0],
    //     chunkShiftY + s.center[1],
    //     2,
    //   );
    // });

    this.chunkTextures[chunk.position.hash].draw(this.graphics);
  }

  private undrawChunk(chunk: WorldChunk) {
    this.chunkTextures[chunk.position.hash]?.destroy();
  }
}
