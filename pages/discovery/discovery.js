// pages/discovery/discovery.js
var Api=require('../../utils/api.js')
var WARP_SECOND = 1000 * 60;
var CACHED_TIME = WARP_SECOND * 2; 
var featuresOptions=['Editor', 'Today', 'Week', 'Upcoming'];

Page({

  /**
   * 页面的初始数据
   */
  data: {
    title:'Explore',
    photos:[],
    feature:'fresh_today',
    loading:true,
    hasMore:true,
    rpp:20,
  
  },


  showFeatureOptions: function (e) {
  /*  this.setData({
      featureOptionHidden: !this.data.featureOptionHidden
    })*/
    var that=this;
    wx.showActionSheet({
      itemList: featuresOptions,
      success: function (res) {
        var currentFeature = featuresOptions[res.tapIndex];
        console.log(currentFeature);
        that.chooseFeature(currentFeature);
      }

    }
    ); 
  },

  chooseFeature: function(f){
    this.data.feature = f;
    this.fetchData();
  },

  loadMore:function(e){
    console.log('down');
    if (this.data.hasMore) {
      this.fetchData();
    }
  },

  //取得数据
  fetchData: function () {
    var that = this;
    console.log("fetching ...feature=" + this.data.feature)
    var theRPP = that.data.rpp;
    console.log(theRPP);
    wx.request({
      url: Api.getPhotos(),
      data: {
        feature: that.data.feature,
        consumer_key: Api.getConsumerKey(),
        sort: 'votes_count',
        sort_direction: 'desc',
        image_size: '3',
        include_store: 'store_download',
        include_states: 'voted',
        rpp: theRPP
      },
      success: function (res) {
        console.log(res);
        var fetchedData = res.data.photos;

        var newData = that.data.photos;
        newData.push.apply(newData, fetchedData.slice(theRPP - 20, theRPP));

        wx.setStorageSync(that.data.feature, newData);
        wx.setStorageSync('requestTs', Date.now());

        var hasMore = true;
        var newRPP = theRPP + 20;
        var equalOne = false;
        if (fetchedData.length < theRPP) {
          hasMore = false;
          newRPP = fetchedData.length;
        } else if (that.equalOne) {
          hasMore = false;
          newRPP = fetchedData.length;
        } else {
          equalOne = true;
        }

        that.setData({
          photos: newData,
          loading: false,
          hasMore: hasMore,
          equalOne: equalOne,
          rpp: newRPP
        },
        wx.hideLoading()
        )
      }
    })
  },

  lookPhoto:function(event){
    var id=event.currentTarget.id;
    var urls = '../detail/detail?id='+id;
    wx.navigateTo({
      url: urls
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log('load explore');
    var that = this
    console.log("loading = ",that.data.loading)
 
    if(that.data.loading)
    {
      wx.showLoading({
        title: 'Loading',
      })
    }else{
      wx.hideLoading()
    }
    this.fetchData()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})