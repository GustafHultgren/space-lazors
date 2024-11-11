const root = document.documentElement;

const SHIP_HEIGHT = getComputedStyle(root).getPropertyValue('--ship-height');
const SHIP_WIDTH = getComputedStyle(root).getPropertyValue('--ship-width');
const SHIP_OFFSET_Y = getComputedStyle(root).getPropertyValue('--ship-offset-y');

const app = document.querySelector('#app')

app.innerHTML = `
  <div class="ship">
    <div style="transform: rotate(-45deg) translateX(-8px); position: relative;">
     🚀
    </div>
  </div>
`

let currentArrowPressed = null
let isFiring = false

window.addEventListener('keydown', (event) => {
  if (event.key === 'ArrowLeft') {
    currentArrowPressed = 'ArrowLeft'
  }

  if (event.key === 'ArrowRight') {
    currentArrowPressed = 'ArrowRight'
  }

  if (event.key === ' ') {
    isFiring = true
  }
})

window.addEventListener('keyup', (event) => {
  if (event.key === 'ArrowLeft' && currentArrowPressed === 'ArrowLeft') {
    currentArrowPressed = null
  }

  if (event.key === 'ArrowRight' && currentArrowPressed === 'ArrowRight') {
    currentArrowPressed = null
  }

  if (event.key === ' ') {
    isFiring = false
  }
})

const MAX_POS = 100
const MAX_SPEED = 10 * 0.5
const DAMPING_FACTOR = 0.2 // Adjust this value to control the bounce effect
const BOUNCE_THRESHOLD = 0.05
const BASE_ACCELERATION = 0.1
const BASE_DECELERATION = 0.015

let shipPos = 50
let shipSpeed = 0
let shipAcceleration = 0

const aliens = []
const lasers = []

let lastFire = Date.now()
let LASER_COOLDOWN = 150
function shootLaser() {
  const now = Date.now()

  if (now - lastFire > LASER_COOLDOWN) {
    const element = document.createElement('div')
    element.classList.add('laser')

    const posX = shipPos
    const posY = 0

    const laser = {
      element,
      posX,
      posY
    }

    lasers.push(laser)
    app.appendChild(element)

    lastFire = now
  }
}

const LASER_SPEED = 1

function drawLasers() {
  for (const laser of lasers) {
    laser.posY += LASER_SPEED

    if (laser.posY >= 100) {
      laser.element.remove()
      lasers.splice(lasers.indexOf(laser), 1)
    }

    const collidingAlienIndex = aliens.findIndex(alien => {
      const laserRect = laser.element.getBoundingClientRect()
      const alienRect = alien.element.getBoundingClientRect()

      return laserRect.left < alienRect.right &&
        laserRect.right > alienRect.left &&
        laserRect.top < alienRect.bottom &&
        laserRect.bottom > alienRect.top
    })

    if (collidingAlienIndex !== -1) {
      const [collidingAlien] = aliens.splice(collidingAlienIndex, 1)
      collidingAlien.element.remove()

      laser.element.remove()
      lasers.splice(lasers.indexOf(laser), 1)
    } else {
      laser.element.style.bottom = `calc(${laser.posY}vh + ${SHIP_OFFSET_Y} + ${SHIP_HEIGHT})`
      laser.element.style.left = `calc(${laser.posX}vw + ${SHIP_WIDTH} / 2)`
    }
  }
}

function spawnAlien() {
  const element = document.createElement('div')
  element.classList.add('alien')

  const posX = Math.random() * 100
  const posY = 100

  const alien = {
    element,
    posX,
    posY
  }

  aliens.push(alien)
  app.appendChild(element)
}

const ALIEN_SPEED = 0.2



function drawAliens() {

  for (const alien of aliens) {
    alien.posY -= ALIEN_SPEED

    if (alien.posY <= 0) {
      alien.element.remove()
      aliens.splice(aliens.indexOf(alien), 1)
    }

    alien.element.style.bottom = `calc(${alien.posY}vh + ${SHIP_OFFSET_Y} + ${SHIP_HEIGHT})`
    alien.element.style.left = `calc(${alien.posX}vw + ${SHIP_WIDTH} / 2)`
  }
}

setInterval(() => {
  if (Math.random() < 0.01) {
    spawnAlien()
  }

  drawAliens()

  if (isFiring) {
    shootLaser()
  }

  drawLasers()


  if (currentArrowPressed === 'ArrowLeft') {
    shipAcceleration = -BASE_ACCELERATION
  } else if (currentArrowPressed === 'ArrowRight') {
    shipAcceleration = BASE_ACCELERATION
  } else {
    if (Math.abs(shipSpeed) <= BASE_DECELERATION * 4) {
      shipSpeed = 0
      shipAcceleration = 0
    } else {
      shipAcceleration = -Math.sign(shipSpeed) * BASE_DECELERATION
    }
  }

  if (shipPos <= 0) {
    shipPos = 0
    if (Math.abs(shipSpeed) >= BOUNCE_THRESHOLD) {
      shipAcceleration = 0
      shipSpeed = -shipSpeed * DAMPING_FACTOR
    } else {
      shipSpeed = 0
    }
  } else if (shipPos >= MAX_POS) {
    shipPos = MAX_POS
    if (Math.abs(shipSpeed) >= BOUNCE_THRESHOLD) {
      shipAcceleration = 0
      shipSpeed = -shipSpeed * DAMPING_FACTOR
    } else {
      shipSpeed = 0
    }
  }

  shipSpeed = Math.max(-MAX_SPEED, Math.min(MAX_SPEED, shipSpeed + shipAcceleration))

  shipPos = Math.max(0, Math.min(MAX_POS, shipPos + shipSpeed))

  const ship = document.querySelector('.ship')

  ship.style.left = `calc(max(0px, min(${shipPos}vw, 100vw - var(--ship-width)))`
}, 1000 / 60 /* 60 FPS */)
