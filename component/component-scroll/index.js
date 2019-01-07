// component/component-scroll/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    pulldownDistance: { // 下拉距离
      type: Number,
      value: '50'
    },
    refreshPulldownText: { // 下拉文字
      type: String,
      value: '下拉刷新'
    },
    refreshUndoText: { // 松开文字
      type: String,
      value: '释放刷新'
    },
    refreshLoadingText: { // 刷新加载文字
      type: String,
      value: '正在加载'
    },
    isNeedLoadmore: { // 是否需要加载更多
      type: Boolean,
      value: false
    },
    allloaded: { // 全部加载完毕
      type: Boolean,
      value: false
    },
    isEmpty: { // 是否为空
      type: Boolean,
      value: false
    },
    loadmoreLoadingText: { // 加载更多文字
      type: String,
      value: '正在加载'
    },
    loadmoreAllloadedText: {
      type: String,
      value: '已经到最底部了~'
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    scrollTop: 0, // 是否在顶部
    touchStartY: 0, // 触摸的起始位置
    refreshHeight: 0, // 下拉高度
    refreshText: '', // 下拉文字
    isRefresh: false, // 是否下拉刷新
    loadmoreHidden: true, // 加载更多显示
    loadmoreText: '' // 加载更多文字提示
  },

  /**
   * 组件的方法列表
   */
  methods: {
    loadmore(e) {
      if (this.properties.allloaded && !this.properties.isEmpty) {
        this.setData({
          loadmoreHidden: false,
          loadmoreText: this.properties.loadmoreAllloadedText
        })
        return;
      }
      this.setData({
        loadmoreText: this.properties.loadmoreLoadingText,
        loadmoreHidden: false
      })
      setTimeout(() => {
        this.triggerEvent('_loadmore', {
          success: () => {
            this.setData({
              loadmoreHidden: true
            })
          }
        })
      }, 500)
    },
    scroll(e) {
      this.setData({
        scrollTop: e.detail.scrollTop
      })
    },
    touchStart(e) {
      this.setData({
        touchStartY: e.touches[0].pageY
      })
    },
    touchMove(e) {
      if (this.data.scrollTop <= 0) {
        let height = e.touches[0].pageY - this.data.touchStartY;
        if (height < 0) {
          this.setData({
            isRefresh: false,
            refreshHeight: 0
          })
        } else if (height < this.properties.pulldownDistance) {
          this.setData({
            refreshHeight: height,
            isRefresh: false,
            refreshText: this.properties.refreshPulldownText
          })
        } else if (height >= this.properties.pulldownDistance) {
          this.setData({
            refreshHeight: this.properties.pulldownDistance,
            refreshText: this.properties.refreshUndoText,
            isRefresh: true
          })
        }
      } else {
        this.setData({
          refreshHeight: 0,
          refreshText: '',
          isRefresh: false
        })
      }
    },
    touchEnd(e) {
      if (this.data.scrollTop <= 0 && this.data.isRefresh) {
        this.setData({
          refreshText: this.properties.refreshLoadingText,
          loadmoreHidden: true
        })
        setTimeout(() => {
          this.triggerEvent('_refresh', {
            success: () => {
              this.setData({
                refreshHeight: 0,
                refreshText: '',
                isRefresh: false
              })
            }
          })
        }, 1000)
      } else {
        this.setData({
          refreshHeight: 0,
          refreshText: '',
          isRefresh: false
        })
      }
    },

  }
})