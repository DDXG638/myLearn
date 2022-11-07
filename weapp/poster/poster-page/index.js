import { palette } from "./config"

const {
  miniProgram: { envVersion }
} = wx.getAccountInfoSync()

const Api = wx.X.Api

Component({
  options: {
    // 允许页面的样式影响到组件
    styleIsolation: "shared"
  },

  properties: {
    orderDetail: {
      type: Object,
      value: {}
    },
    show: {
      type: Boolean,
      value: false
    },
    taskRecordId: {
      type: String,
      value: ""
    },
    pplInviterId: {
      type: String,
      value: ""
    }
  },
  data: {
    image: '',
    customActionStyle: {},
    palette: {}
  },
  observers: {
    'show': function(show) {
      if (show && !this.data.image) {
        this.makePoster()
      }
    }
  },
  methods: {
    async makePoster() {
      wx.showLoading({ title: "海报生成中", mask: true })
      const { taskRecordId, pplInviterId } = this.data
      try {
        // 因为scene有最大32字符的限制，故采用缩写形式，taskRecordId => trd; pplInviterId => pid
        // see: https://developers.weixin.qq.com/miniprogram/dev/api-backend/open-api/qr-code/wxacode.getUnlimited.html
        const url = await Api.PPLApi.getWukongPinPinLeQrCode({
          path: "packages/pages/product/pinpinle-detail/index",
          scene: `trd=${taskRecordId}&pid=${pplInviterId}`,
          width: 296,
          envVersion: envVersion,
        })
        if (url) {
          this.setData({
            palette: palette(this.data.orderDetail, url)
          })
        } else {
          wx.showToast({ title: "未获取到小程序二维码", icon: "none" })
          wx.hideLoading()
        }
      } catch(err) {
        wx.hideLoading()
      }
    },
    showSharePoster() {
      this.triggerEvent("showSharePoster")
    },
    saveImage() {
      if (this.data.image && typeof this.data.image === "string") {
        wx.saveImageToPhotosAlbum({
          filePath: this.data.image,
          success: () => {
            wx.showToast({ title: "已保存到相册" })
          },
          fail: () => {
            wx.showToast({ title: "保存失败", icon: "error" })
          }
        })
      } else {
        wx.showToast({ title: "暂无海报", icon: "error" })
      }
    },
    onClickLeft() {
      wx.navigateBack()
    },
    onImgOK(e) {
      wx.hideLoading()
      console.log('ok', e)
      this.setData({
        image: e.detail.path
      })
    },
    onImgErr(e) {
      wx.hideLoading()
      console.error("海报生成失败：", e)
      wx.showToast({ title: e.detail.error || "海报生成失败", icon: "none" })
      console.log("onImgErr", e.detail.error)
    },
    beforeleave() {
      console.log("---beforeleave---")
      wx.hideLoading()
    },
    onClose() {
      this.triggerEvent("hide")
    }
  }
})
