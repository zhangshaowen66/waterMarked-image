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

    const addWatermark = async (imgUrl, watermarkText, options = {}) => {
      return new Promise((resolve, reject) => {
        const img = new Image()
        img.crossOrigin = 'anonymous'
        const {
          fontSize = 20,
          gapX = 300,
          gapY = 100,
          opacity = 0.15,
          size = 0.6
        } = options

        // 配置项
        const angle = -30 * Math.PI / 180
        const font = 'Microsoft YaHei'
        img.onload = () => {
          const canvas = document.createElement('canvas')
          const ctx = canvas.getContext('2d')
          canvas.width = img.width
          canvas.height = img.height

          ctx.drawImage(img, 0, 0)


          const dynamicFontSize = Math.max(20, img.width * 0.02)
          // 设置字体样式
          ctx.font = `bold ${dynamicFontSize}px ${font}`
          ctx.fillStyle = `rgba(0, 0, 0, ${opacity})`
          ctx.textAlign = 'center'
          ctx.textBaseline = 'middle'

          // 动态计算安全间距，避免水印重叠
          const textWidth = ctx.measureText(watermarkText).width
          const safeGapX = Math.max(gapX, textWidth + 50)

          // 旋转画布以生成倾斜水印
          ctx.translate(canvas.width / 2, canvas.height / 2)
          ctx.rotate(angle)
          ctx.translate(-canvas.width / 2, -canvas.height / 2)

          // 计算铺满所需列行数
          const diagonal = Math.sqrt(canvas.width ** 2 + canvas.height ** 2)
          const cols = Math.ceil(diagonal / safeGapX)
          const rows = Math.ceil(diagonal / gapY)

          // 绘制水印
          for (let i = -cols; i < cols; i++) {
            for (let j = -rows; j < rows; j++) {
              const x = i * safeGapX + canvas.width / 2
              const y = j * gapY + canvas.height / 2
              ctx.fillText(watermarkText, x, y)
            }
          }

          ctx.setTransform(1, 0, 0, 1, 0, 0) // 重置旋转变换

          canvas.toBlob(blob => {
            if (blob) resolve(blob)
            else reject(new Error('canvas 转 blob 失败'))
          }, 'image/jpeg', size)
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