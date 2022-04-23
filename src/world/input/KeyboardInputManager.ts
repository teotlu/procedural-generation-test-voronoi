import Phaser from 'phaser';

export type KeyBinds = {
  up: Phaser.Input.Keyboard.Key;
  down: Phaser.Input.Keyboard.Key;
  left: Phaser.Input.Keyboard.Key;
  right: Phaser.Input.Keyboard.Key;
};

export class KeyboardInputManager {
  public keyBinds: KeyBinds;

  constructor(private keyboard: Phaser.Input.Keyboard.KeyboardPlugin) {
    this.keyBinds = {
      up: keyboard.addKey('W'),
      down: keyboard.addKey('S'),
      left: keyboard.addKey('A'),
      right: keyboard.addKey('D'),
    };
  }
}
