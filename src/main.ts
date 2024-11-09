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

let pos = 50
let speed = 0
let acceleration = 0;

setInterval(() => {
  if (currentButtonPressed === 'ArrowLeft') {
    acceleration = -0.1
  } else if (currentButtonPressed === 'ArrowRight') {
    acceleration = 0.1
  } else {
    acceleration = 0
  }

  if (pos === 0) {
    speed = Math.max(0, speed)
  } else if (pos === MAX_POS) {
    speed = Math.min(0, speed)
  }

  speed = Math.max(-MAX_SPEED, Math.min(MAX_SPEED, speed + acceleration))

  pos = Math.max(0, Math.min(MAX_POS, pos + speed))

  const spacecraft = document.querySelector<HTMLDivElement>('.spacecraft')!

  spacecraft.style.left = `calc(max(0px, min(${pos}vw, 100vw - 24px))`
}, 1000 / 60 /* 60 FPS */)
