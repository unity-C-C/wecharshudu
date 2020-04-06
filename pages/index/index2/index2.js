const app = getApp()



var lis=new Array()//81个子格对象数组

var map=[
  ["0","0","0","0","0","0","0","0","0"],
  ["0","0","0","0","0","0","0","0","0"],
  ["0","0","0","0","0","0","0","0","0"],
  ["0","0","0","0","0","0","0","0","0"],
  ["0","0","0","0","0","0","0","0","0"],
  ["0","0","0","0","0","0","0","0","0"],
  ["0","0","0","0","0","0","0","0","0"],
  ["0","0","0","0","0","0","0","0","0"],
  ["0","0","0","0","0","0","0","0","0"]
]

var mapclone=null//map克隆

var mapshujuchi=[]//所有格子的数据池
var mapshujuchis=[1,2,3,4,5,6,7,8,9]
var chongzhi=[]//重置原生数据


//工具栏的判定 当选中哪一个按钮 对map的事件产生影响
var xuanzhongbool=0;//默认选中 不选中工具栏 1 标记 2 橡皮擦 3 撤回 4 提示


Page({
  data:{
  
   view0:0,
  
   showhid:false,//菜单显示和隐藏
   jiulis:[],//81个子格对象数组

   jw:70,//九宫格宽高
   jh:70,
   gg0:2,//九宫格的格子间隙
   gg1:6,//九宫格的九格的间隙
   wxx:0,//像素

   imgw:50,//工具栏图片宽高
   xuanzhongbool:xuanzhongbool
  },





  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数
    //console.log(750/app.globalData.wx*app.globalData.wx/3);
    //console.log(app.globalData.hg);


    
    this.setData({'view0':750/app.globalData.wx*app.globalData.wx/3});
    this.setData({'nandu':app.gamedata.nandu});



for(var i=0;i<81;++i){
      var li = app.jiujiudata();
      li.date="";
      li.yuanshengdata=false;
      li.xuanzhong=false;
      li.id=i;//这里不能为0  为0 那么bindtag绑定事件就会默认为最后一个 而不是”0“这一个事件
      li.idvalue=i+1;
      lis.push(li);

      
    }
    
    app.gamedata.jiujiudata = lis;

    //this.setData({jiulis:app.gamedata.jiujiudata});
    this.setData({wxx:app.globalData.wx});


    
    app.draw(app.gamedata.jiujiudata);

    console.log(app.gamedata.jiujiudata);    
    
    this.setData({jiulis:app.gamedata.jiujiudata});
     
    
    
},


//重置所有数据
czdata:function(){
  map=[
  ["0","0","0","0","0","0","0","0","0"],
  ["0","0","0","0","0","0","0","0","0"],
  ["0","0","0","0","0","0","0","0","0"],
  ["0","0","0","0","0","0","0","0","0"],
  ["0","0","0","0","0","0","0","0","0"],
  ["0","0","0","0","0","0","0","0","0"],
  ["0","0","0","0","0","0","0","0","0"],
  ["0","0","0","0","0","0","0","0","0"],
  ["0","0","0","0","0","0","0","0","0"]
];
lis=new Array();

mapclone=null;

mapshujuchi=[];
chongzhi=[];

app.gamedata.jiujiudata=[];
app.gamedata.jiujiudataold=[];
app.gamedata.qiujie=[];

},









//数据池
num1:function(e){
//this.biaojihongfalse()
var linshi=true
//没选择工具栏 点击了数独数字框 点击了数据池的事件  还有一点是不能修改原生数字 只能修改候选数或者是后来添加的
  if(xuanzhongbool==0){
      for(var i=0;i<app.gamedata.jiujiudata.length;++i){
        if(app.gamedata.jiujiudata[i].xuanzhong&&app.gamedata.jiujiudata[i].yuanshengdata==false){
           
          app.gamedata.jiujiudata[i].date=e.currentTarget.dataset.id
          app.gamedata.jiujiudata[i].yuanshengdata=true
          app.gamedata.jiujiudata[i].shujuchi=[]
         
         
          break
        }
      }

      //重复显示为红 //原生数字显示为红 候选数删除
      app.panding0(app.gamedata.jiujiudata)
      //console.log(app.gamedata.jiujiudata)
  }



  
this.setData({jiulis:app.gamedata.jiujiudata})

},

num2:function(e){
//this.biaojihongfalse()
var linshi=true
//没选择工具栏 点击了数独数字框 点击了数据池的事件  还有一点是不能修改原生数字 只能修改候选数或者是后来添加的
  if(xuanzhongbool==0){
      for(var i=0;i<app.gamedata.jiujiudata.length;++i){
        if(app.gamedata.jiujiudata[i].xuanzhong&&app.gamedata.jiujiudata[i].yuanshengdata==false){
          
          app.gamedata.jiujiudata[i].date=e.currentTarget.dataset.id
          app.gamedata.jiujiudata[i].yuanshengdata=true
          app.gamedata.jiujiudata[i].shujuchi=[]
        
          break
        }
      }

      //重复显示为红 //原生数字显示为红 候选数删除
      app.panding0(app.gamedata.jiujiudata)
      //console.log(app.gamedata.jiujiudata)
  }


  
  
this.setData({jiulis:app.gamedata.jiujiudata})

},

num3:function(e){
//this.biaojihongfalse()
var linshi=true
//没选择工具栏 点击了数独数字框 点击了数据池的事件  还有一点是不能修改原生数字 只能修改候选数或者是后来添加的
  if(xuanzhongbool==0){
      for(var i=0;i<app.gamedata.jiujiudata.length;++i){
        if(app.gamedata.jiujiudata[i].xuanzhong&&app.gamedata.jiujiudata[i].yuanshengdata==false){
         
          app.gamedata.jiujiudata[i].date=e.currentTarget.dataset.id
          app.gamedata.jiujiudata[i].yuanshengdata=true
          app.gamedata.jiujiudata[i].shujuchi=[]
           
          break
        }
      }

      //重复显示为红 //原生数字显示为红 候选数删除
      app.panding0(app.gamedata.jiujiudata)
      //console.log(app.gamedata.jiujiudata)
  }


  
this.setData({jiulis:app.gamedata.jiujiudata})

},


num4:function(e){
//this.biaojihongfalse()
var linshi=true
//没选择工具栏 点击了数独数字框 点击了数据池的事件  还有一点是不能修改原生数字 只能修改候选数或者是后来添加的
  if(xuanzhongbool==0){
      for(var i=0;i<app.gamedata.jiujiudata.length;++i){
        if(app.gamedata.jiujiudata[i].xuanzhong&&app.gamedata.jiujiudata[i].yuanshengdata==false){
         
          app.gamedata.jiujiudata[i].date=e.currentTarget.dataset.id
          app.gamedata.jiujiudata[i].yuanshengdata=true
          app.gamedata.jiujiudata[i].shujuchi=[]
          
          break
        }
      }

      //重复显示为红 //原生数字显示为红 候选数删除
      app.panding0(app.gamedata.jiujiudata)
      //console.log(app.gamedata.jiujiudata)
  }


  
this.setData({jiulis:app.gamedata.jiujiudata})

},


num5:function(e){
//this.biaojihongfalse()
var linshi=true
//没选择工具栏 点击了数独数字框 点击了数据池的事件  还有一点是不能修改原生数字 只能修改候选数或者是后来添加的
  if(xuanzhongbool==0){
      for(var i=0;i<app.gamedata.jiujiudata.length;++i){
        if(app.gamedata.jiujiudata[i].xuanzhong&&app.gamedata.jiujiudata[i].yuanshengdata==false){
         
          app.gamedata.jiujiudata[i].date=e.currentTarget.dataset.id
          app.gamedata.jiujiudata[i].yuanshengdata=true
          app.gamedata.jiujiudata[i].shujuchi=[]
         
          break
        }
      }

      //重复显示为红 //原生数字显示为红 候选数删除
      app.panding0(app.gamedata.jiujiudata)
      //console.log(app.gamedata.jiujiudata)
  }


  
this.setData({jiulis:app.gamedata.jiujiudata})

},


num6:function(e){
//this.biaojihongfalse()
var linshi=true
//没选择工具栏 点击了数独数字框 点击了数据池的事件  还有一点是不能修改原生数字 只能修改候选数或者是后来添加的
  if(xuanzhongbool==0){
      for(var i=0;i<app.gamedata.jiujiudata.length;++i){
        if(app.gamedata.jiujiudata[i].xuanzhong&&app.gamedata.jiujiudata[i].yuanshengdata==false){
         
          app.gamedata.jiujiudata[i].date=e.currentTarget.dataset.id
          app.gamedata.jiujiudata[i].yuanshengdata=true
          app.gamedata.jiujiudata[i].shujuchi=[]
         
          break
        }
      }

      //重复显示为红 //原生数字显示为红 候选数删除
      app.panding0(app.gamedata.jiujiudata)
      //console.log(app.gamedata.jiujiudata)
  }


  
this.setData({jiulis:app.gamedata.jiujiudata})

},


num7:function(e){
//this.biaojihongfalse()
var linshi=true
//没选择工具栏 点击了数独数字框 点击了数据池的事件  还有一点是不能修改原生数字 只能修改候选数或者是后来添加的
  if(xuanzhongbool==0){
      for(var i=0;i<app.gamedata.jiujiudata.length;++i){
        if(app.gamedata.jiujiudata[i].xuanzhong&&app.gamedata.jiujiudata[i].yuanshengdata==false){
          
          
          app.gamedata.jiujiudata[i].date=e.currentTarget.dataset.id
          app.gamedata.jiujiudata[i].yuanshengdata=true
          app.gamedata.jiujiudata[i].shujuchi=[]
          
          break
        }
      }

      //重复显示为红 //原生数字显示为红 候选数删除
      app.panding0(app.gamedata.jiujiudata)
      //console.log(app.gamedata.jiujiudata)
  }


  
this.setData({jiulis:app.gamedata.jiujiudata})

},


num8:function(e){
//this.biaojihongfalse()
var linshi=true
//没选择工具栏 点击了数独数字框 点击了数据池的事件  还有一点是不能修改原生数字 只能修改候选数或者是后来添加的
  if(xuanzhongbool==0){
      for(var i=0;i<app.gamedata.jiujiudata.length;++i){
        if(app.gamedata.jiujiudata[i].xuanzhong&&app.gamedata.jiujiudata[i].yuanshengdata==false){
          
          app.gamedata.jiujiudata[i].date=e.currentTarget.dataset.id
          app.gamedata.jiujiudata[i].yuanshengdata=true
          app.gamedata.jiujiudata[i].shujuchi=[]
          
          break
        }
      }

      //重复显示为红 //原生数字显示为红 候选数删除
      app.panding0(app.gamedata.jiujiudata)
      //console.log(app.gamedata.jiujiudata)
  }


  
this.setData({jiulis:app.gamedata.jiujiudata})

},


num9:function(e){
//this.biaojihongfalse()
var linshi=true
//没选择工具栏 点击了数独数字框 点击了数据池的事件  还有一点是不能修改原生数字 只能修改候选数或者是后来添加的
  if(xuanzhongbool==0){
      for(var i=0;i<app.gamedata.jiujiudata.length;++i){
        if(app.gamedata.jiujiudata[i].xuanzhong&&app.gamedata.jiujiudata[i].yuanshengdata==false){
        
          app.gamedata.jiujiudata[i].date=e.currentTarget.dataset.id
          app.gamedata.jiujiudata[i].yuanshengdata=true
          app.gamedata.jiujiudata[i].shujuchi=[]
         
          break
        }
      }

      //重复显示为红 //原生数字显示为红 候选数删除
      app.panding0(app.gamedata.jiujiudata)
      //console.log(app.gamedata.jiujiudata)
  }


  
this.setData({jiulis:app.gamedata.jiujiudata})

},

numx:function(e){

 if(xuanzhongbool==0){
      for(var i=0;i<app.gamedata.jiujiudata.length;++i){
        if(app.gamedata.jiujiudata[i].xuanzhong&&app.gamedata.jiujiudata[i].yuanshengdata==true){
          
          app.gamedata.jiujiudata[i].date=""
          app.gamedata.jiujiudata[i].yuanshengdata=false
          app.gamedata.jiujiudata[i].shujuchi=[]
          
          break
        }
      }

      //重复显示为红 //原生数字显示为红 候选数删除
      app.panding0(app.gamedata.jiujiudata)
      //console.log(app.gamedata.jiujiudata)
  }


  
this.setData({jiulis:app.gamedata.jiujiudata})

},

jiugongge:function(e){

},

queding:function(e){

},



biaojihongfalse:function(){
  for(var i=0;i<app.gamedata.jiujiudata.length;++i){
    app.gamedata.jiujiudata[i].biaojihong=false
  }

  //app.panding0(app.gamedata.jiujiudata)
  app.panding1(app.gamedata.jiujiudata)

  this.setData({jiulis:app.gamedata.jiujiudata})
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