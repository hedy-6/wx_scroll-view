const app = getApp()
import list from './data.js'
Page({
  data: {
    page: 0,
    size: 10,
    loading: false,
    allloaded: false,
    list: []
  },
  onLoad: function() {

  },
  onShow() {
    this.getList();
  },
  // 加载更多
  loadmore({
    detail
  }) {
    this.getList().then(res => {
      detail.success();
    });
  },
  // 刷新
  refresh({
    detail
  }) {
    this.setData({
      list: [],
      loading: false,
      allloaded: false,
      page: 0
    })
    this.getList().then(res => {
      detail.success();
    });
  },
  getList() {
    return new Promise((resolve, reject) => {
      if (this.data.loading || this.data.allloaded) {
        resolve();
        return;
      }
      this.setData({
        loading: true
      })
      setTimeout(() => {
        let resData = [].concat(JSON.parse(JSON.stringify(list)));
        let addList = resData.slice(this.data.size * this.data.page, (this.data.page + 1) * this.data.size);
        let newList = this.data.list.concat(addList)
        if (addList.length < this.data.size) {
          this.setData({
            allloaded: true
          })
        }
        this.setData({
          list: newList,
          loading: false,
          page: this.data.page + 1
        })
        resolve();
      }, 500)
    })
  }
})