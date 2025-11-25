const app = getApp();

Page({
  data: {
    diaryList: []
  },

  onLoad() {
    // 首次加载
  },

  onShow() {
    this.getDiaryList();
  },

  async getDiaryList() {
    wx.showLoading({
      title: '加载中...',
    });
    try {
      const db = wx.cloud.database();
      const res = await db.collection('diary')
        .orderBy('createTime', 'desc')
        .get();
      
      this.setData({
        diaryList: res.data
      });
      wx.hideLoading();
    } catch (err) {
      console.error(err);
      wx.hideLoading();
      // 如果集合不存在，可能是第一次使用，不报错
      if (err.errCode !== -502001) { // DATABASE_COLLECTION_NOT_EXIST
         wx.showToast({
          title: '加载失败',
          icon: 'none'
        });
      }
    }
  },

  gotoWrite() {
    wx.navigateTo({
      url: '/pages/diary/write'
    });
  },

  gotoDetail(e) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/diary/detail?id=${id}`
    });
  },

  onShareAppMessage() {
    return {
      title: '我们的恋爱日记',
      path: '/pages/index/index'
    };
  }
});