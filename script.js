let canvas = document.getElementById('canvas')
let ctx = canvas.getContext('2d')
canvas.width = document.documentElement.clientWidth
canvas.height = document.documentElement.clientHeight
//icon
let penCanvas = document.querySelector('.pen')
let eraserCanvas = document.querySelector('.eraser')
let resetCanvas = document.querySelector('.clear')
let downloadButton = document.querySelector('.download')
let back = document.querySelector('.back')

let colorItems = document.querySelectorAll('.color-item')
let optionsItems = document.querySelectorAll('.options-item')
let inputRange = document.querySelector('#range')

ctx.strokeStyle = '#393b44'
ctx.lineWidth = 12
let historyData = []
let hasChanged = false
let painting = false
let clear = false
if (document.body.ontouchstart !== undefined) {
    canvas.ontouchstart = (e) => {
        let x = e.touches[0].clientX
        let y = e.touches[0].clientY
        painting = true
        if (clear) {
            ctx.clearRect(x-15, y-15, 30, 30)
        }

        last = [x, y]
    }
    canvas.ontouchmove = (e) => {
        let x = e.touches[0].clientX
        let y = e.touches[0].clientY
        if (painting) {
            if (clear) {
                ctx.clearRect(x-15, y-15, 30, 30)
            }else {
                drawLine(last[0], last[1], x, y)
            }
            last = [x, y]
        }

    }
    canvas.ontouchend = (e) => {
        painting = false
        forwardImg = ctx.getImageData(0, 0, canvas.width, canvas.height)
        saveData(forwardImg)
    }
} else {
    canvas.onmousedown = (e) => {
        painting = true
        if (clear) {
            ctx.clearRect(e.clientX - 15, e.clientY - 15, 30, 30)
        }
        last = [e.clientX, e.clientY]
        console.log(e.clientX)
        console.log(e.clientY)
    }

    canvas.onmousemove = (e) => {
        if (painting === true) {
            if (clear) {
                ctx.clearRect(e.clientX - 15, e.clientY - 15, 30, 30)
            } else {
                console.log(e.clientX)
                console.log(e.clientY)
                drawLine(last[0], last[1], e.clientX, e.clientY)
                last = [e.clientX, e.clientY]
            }
        }
    }
    canvas.onmouseup = () => {
        painting = false
        forwardImg = ctx.getImageData(0, 0, canvas.width, canvas.height)
        saveData(forwardImg)
    }
}

function drawLine(startX, startY, endX, endY) {
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
    ctx.beginPath()
    ctx.moveTo(startX, startY)
    ctx.lineTo(endX, endY)
    ctx.closePath()
    ctx.stroke()
    hasChanged = true
}

//??????
//
// window.onload= function (){
//     console.log(optionsItems);
//     let index = 0
//     for(let i = 0;i< optionsItems.length;i++){
//         optionsItems[i].addEventListener('click',()=>{
//             console.log(optionsItems);
//             optionsItems[index].classList.remove('active')
//             index = i
//             optionsItems[i].classList.add('active')
//         },false)
//     }
// }
penCanvas.addEventListener('click', () => {
    clear = false
    eraserCanvas.classList.remove('active')
    penCanvas.classList.add('active')
})
//?????????
eraserCanvas.addEventListener('mousedown', () => {
    clear = true
    eraserCanvas.classList.add('active')
    penCanvas.classList.remove('active')
    canvas.classList.add('eraser-icon')
})
//??????
resetCanvas.addEventListener('mousedown', () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
})
resetCanvas.addEventListener('mouseup', () => {
    resetCanvas.classList.remove('active')
})


//??????
downloadButton.addEventListener('click', () => {
    let imgUrl = canvas.toDataURL('image/png')
    let saveA = document.createElement('a')
    document.body.appendChild(saveA)
    saveA.href = imgUrl
    saveA.download = 'img' + (new Date).getTime()
    saveA.target = '_blank'
    saveA.click()
    hasChanged = false
}, false)

// ??????
back.addEventListener('click', () => {
    if (historyData.length < 2) return window.alert('?????????????????????')
    ctx.putImageData(historyData[historyData.length - 2], 0, 0)
    historyData.pop()
}, false)


// ??????
window.onload = function () {
    let index = 0;
    for (let i = 0; i < colorItems.length; i++) {
        colorItems[i].addEventListener('mousedown', () => {
            colorItems[index].classList.remove('color-active')
            index = i
            colorItems[i].classList.add('color-active')
        }, false)
    }
}
for (let i = 0; i < colorItems.length; i++) {
    colorItems[i].addEventListener('click', () => {
        ctx.strokeStyle = colorItems[i].style.backgroundColor
    }, false)
}
//??????
inputRange.addEventListener('change', () => {
    ctx.lineWidth = inputRange.value
}, false)

function show() {
    ctx.lineWidth = inputRange.value
    document.getElementById('value').innerHTML = ctx.lineWidth
}

function saveData(data) {
    return historyData.length <= 10 ? historyData.push(data) : historyData.shift()
}

//??????????????????
window.onbeforeunload = () => {
    if (hasChanged)
        return '????????????????????????????????????'
}