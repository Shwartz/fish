import Fish from './Fish.js';

const app = new PIXI.Application();
let fishes = [];

// Constants
const FISH_COUNT = 5;
const FLOCK_DISTANCE = 20;
const ALIGN_ANGLE_DEG = 90;
const FISH_SPEED = 2;
const ROTATE_RAD = Math.PI / 6;

async function setup() {
  await app.init({
    background: '#1099bb',
    resizeTo: window,
  });
  document.getElementById('container').appendChild(app.canvas);
  try {
    await PIXI.Assets.load('img/fish.png');
  } catch (error) {
    console.error('Failed to load fish image:', error);
    return;
  }

  initFishApp();

  // Add FISH_COUNT fishes with random positions and directions on first load
  for (let i = 0; i < FISH_COUNT; i++) {
    const x = Math.random() * app.screen.width;
    const y = Math.random() * app.screen.height;
    const fish = new Fish(app, x, y, Victor);
    fishes.push(fish);
  }

  app.ticker.add(update);
}

function initFishApp() {
  app.canvas.addEventListener('click', (event) => {
    const rect = app.canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const fish = new Fish(app, x, y, Victor);
    fishes.push(fish);
  });
}

function update() {
  for (const fish of fishes) {
    fish.update(app);
  }
  flockBehavior();
}

function flockBehavior() {
  for (let i = 0; i < fishes.length; i++) {
    for (let j = i + 1; j < fishes.length; j++) {
      const fish1 = fishes[i];
      const fish2 = fishes[j];
      const distance = new Victor(fish1.sprite.x - fish2.sprite.x, fish1.sprite.y - fish2.sprite.y).length();
      if (distance < FLOCK_DISTANCE) {
        const angle = Math.abs(fish1.velocity.angleDeg() - fish2.velocity.angleDeg());
        if (angle < ALIGN_ANGLE_DEG) {
          // Align trajectories
          fish1.velocity.add(fish2.velocity).normalize().multiplyScalar(FISH_SPEED);
          fish2.velocity.add(fish1.velocity).normalize().multiplyScalar(FISH_SPEED);
        } else {
          // Impact directions
          fish1.velocity.rotate(ROTATE_RAD);
          fish2.velocity.rotate(-ROTATE_RAD);
        }
      }
    }
  }
}

setup();
