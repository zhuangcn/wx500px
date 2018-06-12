var Api = require('../../utils/api.js');
var util = require('../../utils/util.js');

Page(
  {

  /**
   * 页面的初始数据
   */
  data: {
    title:'Photo',
    photo:{},
    comments:[],
    tags:[],
    id:0,
    height:0,
    pages:[],
    loading:true,
    hideInfo: true,
    hideCamera: true,
    hideLens: true,
    hideAperture: true,
    hideISO: true,
    hideRate: true,
    hideVote: true,
    hideView: true

     },

fetchDetail:function(id){
  var that=this;
  console.log(id);
  wx.request({
    url: Api.getPhoto(id),
    data:{
      image_size:4,
      tag:'1',
      consumer_key:Api.getConsumerKey()
    },
    success:function(res){
      console.log(res)
      var photo=res.data.photo;
      console.log(photo.tags)
      that.setData({
        photo: photo,
        height: photo.height * 750 / photo.width,
        pages: util.getXML(photo.description),
        hideCamera: Api.isNone(photo.camera),
        hideLens: Api.isNone(photo.lens),
        hideAperture: Api.isNone(photo.aperture),
        hideISO: Api.isNone(photo.iso),
        hideRate: Api.isNone(photo.rating),
        hideVote: Api.isNone(photo.votes_count),
        hideView: Api.isNone(photo.times_viewed),
        tags:photo.tags
      });
      wx.hideLoading();
      that.data.loading=false;
    }
  })
  that.fetchReplies(id);
},

fetchReplies: function (id) {
  var that = this;
  wx.request({
    url: Api.getComments(id),
    data: {
      consumer_key: Api.getConsumerKey()
    },
    success: function (res) {
      that.setData({
        loading: false,
        comments: res.data.comments
      })
    }
  })
},

//用户profile页面
loadUser: function(event){
  var id=event.currentTarget.id,
  url = '../user/user?id='+id;
  wx.navigateTo({
    url: url,
  })
},

showPhotoInfo: function (e) {
  wx.showModal({
    title: 'Photo Info',
    content: 'Camera: '+this.data.photo.camera+'\r\n'+'Lens: '+this.data.photo.lens,
  })
  this.setData({
    hideInfo: false
  })
},

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log('loading photo detail')
    if(this.data.loading){
      wx.showLoading({
        title: 'Loading',
      })
    }
    this.fetchDetail(options.id);
    
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