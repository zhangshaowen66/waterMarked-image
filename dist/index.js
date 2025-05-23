export default function (file, name) {
  return new Promise(async (resolve, reject) => {
    const readFileAsDataURL = async (file)=> {
      return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = (e) => resolve(e.target.result)
        reader.onerror = reject
        reader.readAsDataURL(file)
      })
    }

    const addWatermark = async (imgUrl, watermarkText) => {
      return new Promise((resolve, reject) => {
        const img = new Image()
        img.crossOrigin = 'anonymous' // 跨域图片
        img.onload = () => {
          const canvas = document.createElement('canvas')
          const ctx = canvas.getContext('2d')
          canvas.width = img.width
          canvas.height = img.height

          ctx.drawImage(img, 0, 0)

          const fontSize = 24
          ctx.font = `bold ${ fontSize }px Arial`
          ctx.fillStyle = 'rgba(0, 0, 0, 0.15)'
          ctx.textAlign = 'center'
          ctx.textBaseline = 'middle'

          const angle = -30 * Math.PI / 180
          ctx.translate(0, 0)
          ctx.rotate(angle)

          const textWidth = ctx.measureText(watermarkText).width
          const gapX = textWidth + 100
          const gapY = fontSize + 80

          const rows = Math.ceil(canvas.height / gapY) + 2
          const cols = Math.ceil(canvas.width / gapX) + 2

          for (let i = -1; i < cols; i++) {
            for (let j = -1; j < rows; j++) {
              const x = i * gapX
              const y = j * gapY
              ctx.fillText(watermarkText, x, y)
            }
          }

          ctx.rotate(-angle)

          canvas.toBlob(blob => {
            console.log(blob, 'blobblobblob')
            if (blob) resolve(blob)
            else reject(new Error('canvas 转 blob 失败'))
          }, 'image/png')
        }
        img.onerror = () => reject(new Error('图片加载失败'))
        img.src = imgUrl
      })
    }
    const imgDataUrl = await readFileAsDataURL(file)
    const watermarkedBlob = await addWatermark(imgDataUrl, name)
    if (watermarkedBlob) {
      resolve(watermarkedBlob)
    }  else {
      reject('')
    }
  })
}