// Fish.js
// Fish class for the fish simulation

export default class Fish {
  constructor(app, x, y, Victor) {
    this.sprite = PIXI.Sprite.from('img/fish.png');
    this.sprite.anchor.set(0.5);
    this.sprite.x = x;
    this.sprite.y = y;
    this.sprite.width = 14;
    this.sprite.height = 24;
    this.velocity = new Victor(Math.random() - 0.5, Math.random() - 0.5);
    if (this.velocity.length() > 0) {
      this.velocity.normalize().multiplyScalar(2);
    }
    app.stage.addChild(this.sprite);
  }

  update(app) {
    this.sprite.x += this.velocity.x;
    this.sprite.y += this.velocity.y;
    this.wrapAround(app);
    this.sprite.rotation = Math.atan2(this.velocity.y, this.velocity.x) - Math.PI / 2;
  }

  wrapAround(app) {
    if (this.sprite.x < 0) this.sprite.x = app.screen.width;
    if (this.sprite.x > app.screen.width) this.sprite.x = 0;
    if (this.sprite.y < 0) this.sprite.y = app.screen.height;
    if (this.sprite.y > app.screen.height) this.sprite.y = 0;
  }
}
