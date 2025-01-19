const app = new PIXI.Application();
let fishes = [];


async function setup() {
  let elapsedTime = 0.0;
  await app.init({
    background: '#1099bb',
    resizeTo: window,
  });
  document.getElementById('container').appendChild(app.canvas);
  await PIXI.Assets.load('img/fish.png');

  // Initialize the fish app
  initFishApp();

  // Start the animation loop
  app.ticker.add((ticker) => {
    elapsedTime += ticker.deltaTime;
    update();
  });

  // test if img src is correct
  const elSpan = document.getElementsByTagName('span')[0];
  const elImg = document.createElement('img')
  elImg.setAttribute('src', `img/fish.png`);
  elSpan.appendChild(elImg);
}

function initFishApp() {
  //const fishTexture = PIXI.Texture.from('/img/fish.png');
  //console.log('fishTexture: ', fishTexture)
  class Fish {
    constructor(x, y) {
      this.sprite = PIXI.Sprite.from('img/fish.png');
      this.sprite.anchor.set(0.5);
      this.sprite.x = x;
      this.sprite.y = y;
      this.velocity = new Victor(Math.random() - 0.5, Math.random() - 0.5).normalize().multiplyScalar(2);
      app.stage.addChild(this.sprite);
    }

    update() {
      this.sprite.x += this.velocity.x;
      this.sprite.y += this.velocity.y;
      this.wrapAround();
      this.sprite.rotation = Math.atan2(this.velocity.y, this.velocity.x);
    }

    wrapAround() {
      if (this.sprite.x < 0) this.sprite.x = app.screen.width;
      if (this.sprite.x > app.screen.width) this.sprite.x = 0;
      if (this.sprite.y < 0) this.sprite.y = app.screen.height;
      if (this.sprite.y > app.screen.height) this.sprite.y = 0;
    }
  }

  // Add fish on click
  app.canvas.addEventListener('click', (event) => {
    console.log({event});
    const fish = new Fish(event.clientX, event.clientY);
    fishes.push(fish);
  });
}

// Update function
function update() {
  for (const fish of fishes) {
    fish.update();
  }
  flockBehavior();

}

// Flocking behavior
function flockBehavior() {
  for (const fish1 of fishes) {
    for (const fish2 of fishes) {
      if (fish1 !== fish2) {
        const distance = new Victor(fish1.sprite.x - fish2.sprite.x, fish1.sprite.y - fish2.sprite.y).length();
        if (distance < 20) {
          const angle = Math.abs(fish1.velocity.angleDeg() - fish2.velocity.angleDeg());
          if (angle < 90) {
            // Align trajectories
            fish1.velocity.add(fish2.velocity).normalize().multiplyScalar(2);
            fish2.velocity.add(fish1.velocity).normalize().multiplyScalar(2);
          } else {
            // Impact directions
            fish1.velocity.rotate(Math.PI / 6);
            fish2.velocity.rotate(-Math.PI / 6);
          }
        }
      }
    }
  }
}

setup();
