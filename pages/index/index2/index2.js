const app = getApp()

var lis=new Array()
Page({
  data:{
   nandu:"难度:",
   jishiqi:"计时器:",
   caidan:"菜单",
   view0:0,
   candan:["一键计算候选数","一键清除候选数","查看答案","重置游戏","分享数独题目"],
   showhid:false,
   jiulis:[],

   jw:70,//九宫格宽高
   jh:70,
   gg0:2,//九宫格的格子间隙
   gg1:6,//九宫格的九格的间隙
   wxx:0,//像素

   imgw:50
  },

//菜单显示和隐藏
 caidanvi:function(){
   this.setData({showhid:!this.data.showhid});
 },



  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数
    //console.log(750/app.globalData.wx*app.globalData.wx/3);
    //console.log(app.globalData.hg);
    this.setData({'view0':750/app.globalData.wx*app.globalData.wx/3});
    this.setData({'nandu':app.gamedata.nandu});

    for(var i=0;i<5;++i){
      var li = app.jiujiudata();
      li.date="";
      li.yuanshengdata=false;
      li.xuanzhong=false;
      li.id=i+1;
      lis.push(li);

      
    }
    
    app.gamedata.jiujiudata = lis;

    this.setData({jiulis:app.gamedata.jiujiudata});
    this.setData({wxx:app.globalData.wx});
  },


jiugongge123:function(e){
  console.log(e);
},



  onReady:function(){
    // 页面渲染完成
  },
  onShow:function(){
    // 页面显示
  },
  onHide:function(){
    // 页面隐藏
  },
  onUnload:function(){
    // 页面关闭
  }


})