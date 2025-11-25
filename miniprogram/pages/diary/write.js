const app = getApp();

Page({
  data: {
    date: '',
    content: '',
    images: []
  },

  onLoad() {
    const now = new Date();
    const dateStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
    this.setData({
      date: dateStr
    });
  },

  bindDateChange(e) {
    this.setData({
      date: e.detail.value
    });
  },

  onContentInput(e) {
    this.setData({
      content: e.detail.value
    });
  },

  chooseImage() {
    wx.chooseImage({
      count: 9 - this.data.images.length,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        this.setData({
          images: this.data.images.concat(res.tempFilePaths)
        });
      }
    });
  },

  deleteImage(e) {
    const index = e.currentTarget.dataset.index;
    const images = this.data.images;
    images.splice(index, 1);
    this.setData({
      images
    });
  },

  previewImage(e) {
    const index = e.currentTarget.dataset.index;
    wx.previewImage({
      current: this.data.images[index],
      urls: this.data.images
    });
  },

  async submitDiary() {
    if (!this.data.content && this.data.images.length === 0) {
      wx.showToast({
        title: '写点什么吧~',
        icon: 'none'
      });
      return;
    }

    wx.showLoading({
      title: '保存中...',
    });

    try {
      // 1. 上传图片
      const fileIDs = [];
      for (let i = 0; i < this.data.images.length; i++) {
        const filePath = this.data.images[i];
        const cloudPath = `diary/${Date.now()}-${i}-${Math.random().toString(36).slice(-6)}${filePath.match(/\.[^.]+?$/)[0]}`;
        const res = await wx.cloud.uploadFile({
          cloudPath,
          filePath,
        });
        fileIDs.push(res.fileID);
      }

      // 2. 保存到数据库
      const db = wx.cloud.database();
      await db.collection('diary').add({
        data: {
          content: this.data.content,
          images: fileIDs,
          date: this.data.date,
          createTime: db.serverDate()
        }
      });

      wx.hideLoading();
      wx.showToast({
        title: '保存成功',
      });

      // 返回上一页
      setTimeout(() => {
        wx.navigateBack();
      }, 1500);

    } catch (err) {
      console.error(err);
      wx.hideLoading();
      wx.showToast({
        title: '保存失败',
        icon: 'none'
      });
    }
  }
});