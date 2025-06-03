# watermark-image

一个纯浏览器端的图片加水印工具函数，基于 Canvas 实现。

## ✨ 安装

```bash
npm install z-watermark-image
```
## 🚀 使用
```js
// 返回的是blob对象
/* options 可选提供  {
    fontSize,
    gapX,
    gapY,
    opacity
}
*/
const watermarkedBlob = await watermarkImage(file, '文本文本', options)
// 创建一个File对象
const watermarkedFile = new File([watermarkedBlob], file.name, { type: file.type })
```