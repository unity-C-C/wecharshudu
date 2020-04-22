//index.js
//获取应用实例
const app = getApp()

Page({
  
  data:{
      zhi:app.gamedata.dangqiantimu
  },
  //绑定点击事件
  newgame:function(){
    console.log("0");
    var List = ['难度:容易', '难度:一般', '难度:困难','难度:专家','难度:大师'];
    wx.showActionSheet({
      itemList: List,
      success (res) {
        console.log(res.tapIndex)
        app.gamedata.nandu=List[res.tapIndex];//记录玩家选择的难度
        app.gamedata.indexbutt=0;
          wx.navigateTo({
          url:'../index/index1/index1',
          success:function(){
            console.log("1");
          },
          fail:function(){
            
          },
          complete:function(){
            
          }
      })
      },
      fail (res) {
        console.log(res.errMsg)
      }

    })

    
  },

  gameold:function(){

if(app.gamedata.dangqiantimu!=null){
    wx.navigateTo({
      url:'../index/index1/index1',
      success:function(){
        console.log("1");
        app.gamedata.indexbutt=1;
      },
      fail:function(){
        console.log("3");
      },
      complete:function(){
        console.log("2");
      }
    })
}
    
    
  },

  fleergame:function(){
    wx.navigateTo({
      url:'../index/index1/index1',
      
      success:function(){
        console.log("1");
        app.gamedata.indexbutt=2;
      },
      fail:function(){
        console.log("3");
      },
      complete:function(){
        console.log("2");
      }
    })
  },
  
  onLoad: function () {
    wx.getSystemInfo({
        success: function (res) {
        app.globalData.wx=res.windowWidth;
        app.globalData.hg=res.windowHeight;
      }
    })
    
  },
  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },

  onShow:function(){
    console.log("zhi")
    console.log(app.gamedata.dangqiantimu);
    this.setData({zhi:app.gamedata.dangqiantimu})
  }
})
