const presets = [
  {
    text: 'Tree',
    successor: 'FF+[+F-F-F]-[-F+F+F]',
    length: 50,
    degrees: 25,
    generations: 3
  },
  {
    text: 'Hi',
    successor: 'FFFFF------------FF++++++F[++++++FF]------FFF++++++G++++++FFF',
    length: 55,
    degrees: -15,
    generations: 1
  },
  {
    text: 'Bowties',
    successor: 'F+F-----+F',
    length: 55,
    degrees: 25,
    generations: 3
  },
  {
    text: 'Antenna',
    successor: 'FF[++++F][----F]',
    length: 55,
    degrees: -22,
    generations: 3
  },
  {
    text: 'Barbed Wire',
    successor: 'F+++[--FF]FFF',
    length: 55,
    degrees: 4,
    generations: 3
  }
]

const canvas = document.querySelector('#canvas')

const presetSelect = document.querySelector('#preset-select')

const successorField = document.querySelector('#successor-field')

const lengthSlider = document.querySelector('#length-slider')
const degreesSlider = document.querySelector('#degrees-slider')
const generationsSlider = document.querySelector('#generations-slider')

const resetLengthButton = document.querySelector('#reset-length-button')
const resetDegreesButton = document.querySelector('#reset-degrees-button')
const resetGenerationsButton = document.querySelector('#reset-generations-button')
const resetAllButton = document.querySelector('#reset-all-controls-button')
const copyToClipboardButton = document.querySelector('#copy-to-clipboard-button')
const saveAsImageButton = document.querySelector('#save-as-image-button')

presets.forEach(preset => {
  const option = document.createElement('option')
  option.value = preset.successor
  option.text = preset.text
  presetSelect.add(option)
})

const presetTree = presets.find(preset => preset.text === 'Tree')

presetSelect.value = presetTree.successor
successorField.value = presetSelect.value

let successor = successorField.value
let length = presetTree.length
let degrees = presetTree.degrees
let generations = presetTree.generations

lengthSlider.value = presetTree.length
degreesSlider.value = presetTree.degrees
generationsSlider.value = presetTree.generations

let width
let height

const redraw = () => {
  clearScreen()
  context.translate(width / 2, height)
  draw()
}

presetSelect.addEventListener('input', (event) => {
  const selectedSuccessor = event.target.value
  successorField.value = selectedSuccessor
  successor = selectedSuccessor

  const selectedPreset = presets[event.target.selectedIndex]
  lengthSlider.value = selectedPreset.length
  length = selectedPreset.length
  degreesSlider.value = selectedPreset.degrees
  degrees = selectedPreset.degrees
  generationsSlider.value = selectedPreset.generations
  generations = selectedPreset.generations

  resetLengthButton.removeAttribute('disabled')
  resetDegreesButton.removeAttribute('disabled')
  resetGenerationsButton.removeAttribute('disabled')
  resetAllButton.removeAttribute('disabled')

  redraw()
})

successorField.addEventListener('input', (event) => {
  const userInputSuccessor = event.target.value
  const values = [...presetSelect.options].map(option => option.value)

  if (!values.includes(userInputSuccessor)) {
    presetSelect.value = ''
    resetLengthButton.setAttribute('disabled', true)
    resetDegreesButton.setAttribute('disabled', true)
    resetGenerationsButton.setAttribute('disabled', true)
    resetAllButton.setAttribute('disabled', true)
  } else {
    presetSelect.value = userInputSuccessor
    resetLengthButton.removeAttribute('disabled')
    resetDegreesButton.removeAttribute('disabled')
    resetGenerationsButton.removeAttribute('disabled')
    resetAllButton.removeAttribute('disabled')
  }

  successor = userInputSuccessor
  length = lengthSlider.value
  generations = generationsSlider.value
  degrees = degreesSlider.value

  redraw()
})

lengthSlider.addEventListener('input', (event) => {
  length = event.target.value
  successor = successorField.value
  redraw()
})

degreesSlider.addEventListener('input', (event) => {
  degrees = event.target.value
  length = lengthSlider.value
  successor = successorField.value
  generations = generationsSlider.value
  redraw()
})

generationsSlider.addEventListener('input', (event) => {
  generations = event.target.value
  successor = successorField.value
  length = lengthSlider.value
  redraw()
})

const resetLength = () => {
  const preset = presets[presetSelect.selectedIndex]
  length = preset.length
  lengthSlider.value = preset.length
}

const resetDegrees = () => {
  const preset = presets[presetSelect.selectedIndex]
  degrees = preset.degrees
  degreesSlider.value = preset.degrees
}

const resetGenerations = () => {
  const preset = presets[presetSelect.selectedIndex]
  generations = preset.generations
  generationsSlider.value = preset.generations
}

resetLengthButton.addEventListener('click', () => {
  resetLength()
  generations = generationsSlider.value
  successor = successorField.value
  degrees = degreesSlider.value
  redraw()
})

resetDegreesButton.addEventListener('click', () => {
  resetDegrees()
  length = lengthSlider.value
  generations = generationsSlider.value
  successor = successorField.value
  redraw()
})

resetGenerationsButton.addEventListener('click', () => {
  resetGenerations()
  length = lengthSlider.value
  degrees = degreesSlider.value
  successor = successorField.value
  redraw()
})

resetAllButton.addEventListener('click', () => {
  const preset = presetSelect.selectedIndex === -1 ? presetTree : presets[presetSelect.selectedIndex]

  presetSelect.value = preset.successor
  successorField.value = preset.successor
  successor = preset.successor

  lengthSlider.value = preset.length
  length = preset.length

  degreesSlider.value = preset.degrees
  degrees = preset.degrees

  generationsSlider.value = preset.generations
  generations = preset.generations

  redraw()
})

copyToClipboardButton.addEventListener('click', () => {
  const notification = document.querySelector('#copy-to-clipboard-notification')
  navigator.permissions.query({ name: 'clipboard-write' })
    .then(result => {
      canvas.toBlob(blob => {
        const item = new ClipboardItem({ 'image/png': blob })
        if (result.state === 'granted' || result.state === 'prompt') {
          navigator.clipboard.write([item])
          notification.textContent = 'Drawing copied to Clipboard!'
          return
        }
        notification.textContent = 'Unable to copy to Clipboard! The necessary permissions were not granted.'
      })
    },
      () => {
        notification.textContent = 'Unable to copy to Clipboard! Does your browser support the Clipboard API?'
      })
    .finally(() => {
      notification.removeAttribute('hidden')
      setTimeout(() => {
        notification.setAttribute('hidden', true)
      }, 5000)
    })
})

saveAsImageButton.addEventListener('click', () => {
  const link = document.createElement('a')
  link.download = 'image.png'
  canvas.toBlob(blob => {
    link.href = URL.createObjectURL(blob)
    link.click()
  }, 'image/png')
})

const toRadians = (degreesToConvert) => (degreesToConvert * Math.PI) / 180

const draw = () => {
  const radians = toRadians(degrees)
  const predecessorRegex = /F/g
  for (let i = 0; i < generations; i++) {
    for (const char of successor) {
      switch (char) {
        case 'F':
          context.beginPath()
          context.moveTo(0, 0)
          context.lineTo(0, -length)
          context.stroke()
          context.translate(0, -length)
          break
        case 'G':
          context.translate(0, -length)
          break
        case '+':
          context.rotate(radians)
          break
        case '-':
          context.rotate(-radians)
          break
        case '[':
          context.save()
          break
        case ']':
          context.restore()
          break
      }
    }
    length *= 0.5
    successor = successor.replace(predecessorRegex, successor)
  }
}

const clearScreen = () => {
  // Clear canvas completely
  context.setTransform(1, 0, 0, 1, 0, 0)
  context.clearRect(0, 0, canvas.width, canvas.height)

  // Fill canvas with white - to avoid transparent images in clipboard or file
  context.fillStyle = 'white'
  context.fillRect(0, 0, canvas.width, canvas.height)
  context.fillStyle = 'black'
}

const setupCanvas = () => {
  width = document.body.clientWidth
  height = document.body.clientHeight

  canvas.width = width
  canvas.height = height
}

setupCanvas()

const context = canvas.getContext('2d')

window.addEventListener('resize', () => {
  setupCanvas()

  length = lengthSlider.value
  generations = generationsSlider.value
  degrees = degreesSlider.value
  successor = successorField.value

  redraw()
})

redraw()
