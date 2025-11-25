Page({
  data: {
    diary: {}
  },

  onLoad(options) {
    if (options.id) {
      this.getDiaryDetail(options.id);
    }
  },

  async getDiaryDetail(id) {
    wx.showLoading({
      title: '加载中...',
    });
    try {
      const db = wx.cloud.database();
      const res = await db.collection('diary').doc(id).get();
      console.log('Diary Detail:', res.data); // Debug log
      this.setData({
        diary: res.data
      });
      wx.hideLoading();
    } catch (err) {
      console.error(err);
      wx.hideLoading();
      wx.showToast({
        title: '加载失败',
        icon: 'none'
      });
    }
  },

  previewImage(e) {
    const index = e.currentTarget.dataset.index;
    wx.previewImage({
      current: this.data.diary.images[index],
      urls: this.data.diary.images
    });
  },

  onDelete() {
    wx.showModal({
      title: '提示',
      content: '确定要删除这篇日记吗？',
      confirmColor: '#FF69B4',
      success: (res) => {
        if (res.confirm) {
          this.deleteDiary();
        }
      }
    });
  },

  async deleteDiary() {
    wx.showLoading({
      title: '删除中...',
    });
    try {
      const db = wx.cloud.database();
      
      // 1. 如果有图片，先删除云存储的图片（可选，为了节省空间）
      if (this.data.diary.images && this.data.diary.images.length > 0) {
        await wx.cloud.deleteFile({
          fileList: this.data.diary.images
        }).catch(console.error); // 忽略图片删除错误，确保记录能被删除
      }

      // 2. 删除数据库记录
      await db.collection('diary').doc(this.data.diary._id).remove();

      wx.hideLoading();
      wx.showToast({
        title: '删除成功',
      });

      // 返回上一页
      setTimeout(() => {
        wx.navigateBack();
      }, 1500);

    } catch (err) {
      console.error(err);
      wx.hideLoading();
      wx.showToast({
        title: '删除失败',
        icon: 'none'
      });
    }
  }
});