export function palette({
  goodsImages,
  goodsName,
  productName,
  goodsPrice,
  goodsOriginalPrice
}, qrCode) {
  return {
    "width": "1500px",
    "height": "2938px",
    "background": "rgba(0,0,0,0)",
    "views": [
      // 背景图
      {
        "type": "image",
        "url": "https://static.coolpad.com/main-package/poster-base2.png",
        "css": {
          "width": "1500px",
          "height": "2938px",
          "top": "0px",
          "left": "0px",
          "rotate": "0",
          "borderRadius": "",
          "borderWidth": "",
          "borderColor": "#000000",
          "shadow": "",
          "mode": "scaleToFill"
        }
      },
      // 主图
      {
        "type": "image",
        "url": goodsImages.replace("http:", "https:") || "", // https://static.coolpad.com/mall/files/image/A/T2kNouUyL7zs7NtJnuNYYZq06GQ66sz3.png
        "css": {
          "width": "1080px", // 880
          "height": "928px", // 880
          "top": "852px",
          "left": "210px",
          "rotate": "0",
          "borderRadius": "",
          "borderWidth": "",
          "borderColor": "#000000",
          "shadow": "",
          "mode": "aspectFill"
        }
      },
      // 抽奖团 图标
      {
        "type": "image",
        "url": "https://static.coolpad.com/main-package/poster-icon@2.png",
        "css": {
          "width": "164px",
          "height": "72px",
          "top": ((979 - 32) * 2) + "px",
          "left": "122px",
          "rotate": "0",
          "borderRadius": "",
          "borderWidth": "",
          "borderColor": "#000000",
          "shadow": "",
          "mode": "aspectFill"
        }
      },
      // 二维码
      {
        "type": "image",
        "url": qrCode || "", // https://static.coolpad.com/zg/hK3anrIK3UrN1xkdhMIAS9OVoKbNEDoF.jpg
        "css": {
          "width": "296px",
          "height": "296px",
          "top": (1297 * 2) + "px",
          "left": "120px",
          "rotate": "0",
          "borderRadius": "148px",
          "borderWidth": "",
          "borderColor": "#000000",
          "shadow": "",
          "mode": "aspectFill"
        }
      },
      // 商品名称
      {
        "type": "text",
        "text": goodsName || "-", // "COOL 20S 8G+128G超大储存超大储存超大储存",
        "css": {
          "color": "#202020",
          "background": "rgba(0,0,0,0)",
          "width": "1060px",
          "top": (1946 - 64) + "px",
          "left": "310px",
          "rotate": "0",
          "borderRadius": "",
          "borderWidth": "",
          "borderColor": "#000000",
          "shadow": "",
          "padding": "0px",
          "fontSize": "72px",
          "fontWeight": "normal",
          "maxLines": "1",
          "lineHeight": "100px",
          "textStyle": "fill",
          "textDecoration": "none",
          "fontFamily": "",
          "textAlign": "left"
        }
      },
      // 商品简介
      {
        "type": "text",
        "text": productName || "", // 酷派新机 | 锋尚A12 疾速实力派双模 4600mAh大电池 128GB 超大扬声器 E4材料大屏
        "css": {
          "color": "#888888",
          "background": "rgba(0,0,0,0)",
          "width": "1260px",
          "top": (2062 - 64) + "px",
          "left": "120px",
          "rotate": "0",
          "borderRadius": "",
          "borderWidth": "",
          "borderColor": "#000000",
          "shadow": "",
          "padding": "0px",
          "fontSize": "48px",
          "fontWeight": "normal",
          "maxLines": "2",
          "lineHeight": "68px",
          "textStyle": "fill",
          "textDecoration": "none",
          "fontFamily": "",
          "textAlign": "left"
        }
      },
      {
        "type": "text",
        "text": "￥",
        "css": {
          "top": ((1113 + 40 - 36) * 2) + "px",
          "left": ((247 + 4) * 2) + "px",
          "color": "#F01824",
          "fontSize": "80px",
          "fontWeight": "blod",
          "lineHeight": "80px"
        }
      },
      // 价格
      {
        "type": "text",
        "text": goodsPrice,
        "css": {
          "top": ((1113 + 12 - 36) * 2) + "px",
          "left": ((247 + 38) * 2) + "px",
          "color": "#F01824",
          "fontSize": "136px",
          "fontWeight": "blod",
          "lineHeight": "136px"
        }
      },
      // 原价
      {
        "type": "text",
        "text": "￥" + goodsOriginalPrice,
        "css": {
          "top": ((1164 + 5 - 36) * 2) + "px",
          "left": "844px",
          "color": "#bbbbbb",
          "fontSize": "48px",
          "lineHeight": "48px",
          "textDecoration": "line-through",
        }
      }
    ]
  }
}
