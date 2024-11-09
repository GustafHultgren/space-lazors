import './style.css'

const app = document.querySelector<HTMLDivElement>('#app')!

app.innerHTML = `
  <div class="spacecraft"></div>
`

let currentButtonPressed: 'ArrowLeft' | 'ArrowRight' | null = null
window.addEventListener('keydown', (event) => {
  if (event.key === 'ArrowLeft') {
    currentButtonPressed = 'ArrowLeft'
  }

  if (event.key === 'ArrowRight') {
    currentButtonPressed = 'ArrowRight'
  }
})

window.addEventListener('keyup', (event) => {
  if (event.key === 'ArrowLeft' && currentButtonPressed === 'ArrowLeft') {
    currentButtonPressed = null
  }

  if (event.key === 'ArrowRight' && currentButtonPressed === 'ArrowRight') {
    currentButtonPressed = null
  }
})

const MAX_POS = 100
const MAX_SPEED = 10
const DAMPING_FACTOR = 0.25 // Adjust this value to control the bounce effect
const BOUNCE_THRESHOLD = 0.01 * MAX_SPEED

let pos = 50
let speed = 0
let acceleration = 0

setInterval(() => {
  if (currentButtonPressed === 'ArrowLeft') {
    acceleration = -0.1
  } else if (currentButtonPressed === 'ArrowRight') {
    acceleration = 0.1
  } else {
    acceleration = 0
  }

  if (pos <= 0) {
    pos = 0
    if (Math.abs(speed) >= BOUNCE_THRESHOLD) {
      speed = -speed * DAMPING_FACTOR
    } else {
      speed = 0
    }
  } else if (pos >= MAX_POS) {
    pos = MAX_POS
    if (Math.abs(speed) >= BOUNCE_THRESHOLD) {
      speed = -speed * DAMPING_FACTOR
    } else {
      speed = 0
    }
  }

  speed = Math.max(-MAX_SPEED, Math.min(MAX_SPEED, speed + acceleration))

  pos = Math.max(0, Math.min(MAX_POS, pos + speed))

  const spacecraft = document.querySelector<HTMLDivElement>('.spacecraft')!

  spacecraft.style.left = `calc(max(0px, min(${pos}vw, 100vw - 24px))`
}, 1000 / 60 /* 60 FPS */)
