# wx_scroll-view
微信小程序基于scroll-view组件的下拉刷新,上拉加载更多的功能实现

## 使用方法

### 引用组件

在页面json(本例如index.json)文件中配置:

```
{
  "usingComponents": {
    "component-scroll": "../component/component-scroll/index"
  }
}
```

在页面wxml(本例如index.wxml)文件中:

```
<view class='container'>
  <component-scroll isNeedLoadmore bind:_loadmore="loadmore" bind:_refresh="refresh" allloaded="{{allloaded}}" isEmpty="{{!loading &&list.length<=0}}">
    <view class='list'>
      <block wx:for="{{list}}" wx:key="{{index}}">
        <view class='list-item'>{{item.name}}</view>
      </block>
    </view>
  </component-scroll>
</view>
```

#### 主要设置项

- isNeedLoadmore —— 是否需要加载更多
- refresh —— 绑定下拉刷新事件
- loadmore —— 绑定加载更多事件
- allloaded —— 判断是否已经加载完毕
- isEmpty —— 判断页面是否为空

#### 其他配置项

- pulldownDistance —— 下拉多少距离触发刷新事件
- refreshPulldownText —— 下拉动作时的提示文字,如“下拉刷新”
- refreshUndoText —— 松开动作的提示文字,如“释放刷新”
- refreshLoadingText —— 下拉刷新加载中的文字提示
- loadmoreLoadingText —— 底部加载更多的文字提示
- loadmoreAllloadedText —— 底部记载完毕的文字提示

在页面js( 本例如index.js)文件中:
配置loadmore,refresh事件

```
  data: {
    page: 0,
    size: 10,
    loading: false,
    allloaded: false,
    list: []
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
        // 此处为虚拟数据
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
```
