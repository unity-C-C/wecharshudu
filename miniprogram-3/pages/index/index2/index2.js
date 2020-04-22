const app = getApp()


var numxx=false;
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

console.log(numxx);
numxx=!numxx;

},

jiugongge:function(e){
 console.log(e);
  for(var i=0;i<81;++i){
    if(app.gamedata.jiujiudata[i].xuanzhong==true&&i!=(e.currentTarget.dataset.id-1)){
      app.gamedata.jiujiudata[i].xuanzhong=false
    }else if(i==(e.currentTarget.dataset.id-1)){
app.gamedata.jiujiudata[e.currentTarget.dataset.id-1].xuanzhong=!app.gamedata.jiujiudata[e.currentTarget.dataset.id-1].xuanzhong;
    }
  }
  

  this.setData({jiulis:app.gamedata.jiujiudata});

if(numxx){
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
      for(var i=0;i<app.gamedata.jiujiudata.length;++i){
        app.gamedata.jiujiudata[i].biaojihong=false;

      }

      app.panding0(app.gamedata.jiujiudata)
      //console.log(app.gamedata.jiujiudata)
  }


  
this.setData({jiulis:app.gamedata.jiujiudata})
console.log(numxx);
numxx=false;
}


},

queding:function(e){

var pan=false;
//先判断符不符合规则
      //重复显示为红 //原生数字显示为红 候选数删除
      for(var i=0;i<app.gamedata.jiujiudata.length;++i){
        app.gamedata.jiujiudata[i].biaojihong=false;

      }

      app.panding0(app.gamedata.jiujiudata)

      for(var i=0;i<app.gamedata.jiujiudata.length;++i){
        if(app.gamedata.jiujiudata[i].biaojihong){

          //调用窗口
          wx.showToast({
            title:"不符合规则",
            duration: 2000,//提示的延迟时间，单位毫秒，默认：1500 
            mask: false,//是否显示透明蒙层，防止触摸穿透，默认：false 
            success:function(){}
          });

          pan=true;
          break;
        }
      }

//判断是否有解

    app.gamedata.qiujie=[];
    app.gamedata.jiujiudata = app.panding3(app.gamedata.jiujiudata);
    var jiujiucopy =JSON.parse(JSON.stringify(app.gamedata.jiujiudata));
    console.log(jiujiucopy);
    app.panding6(jiujiucopy);
    console.log(app.gamedata.qiujie.length);
    if(app.gamedata.qiujie.length<=0){
 
      if(!pan){

          wx.showToast({
            title:"数独无解",
            duration: 2000,//提示的延迟时间，单位毫秒，默认：1500 
            mask: false,//是否显示透明蒙层，防止触摸穿透，默认：false 
            success:function(){}
          });
          pan=true;
      }
        
    }else if(app.gamedata.qiujie.length>1){

      if(!pan){
           wx.showToast({
            title:"数独多解",
            duration: 2000,//提示的延迟时间，单位毫秒，默认：1500 
            mask: false,//是否显示透明蒙层，防止触摸穿透，默认：false 
            success:function(){}
          });
          pan=true;
      }
       
    }else{
      app.gamedata.dangqiantimu=JSON.parse(JSON.stringify(app.gamedata.jiujiudata));

      app.gamedata.indexbutt=2;
      app.gamedata.qiujiecopy=app.gamedata.qiujie[0];

      var numss=0;
      for(var i=0;i<app.gamedata.jiujiudata;++i){
        if(app.gamedata.jiujiudata[i].date==""){
          numss++;
        }
      }

      if(numss<10){
          app.gamedata.nandu="难度:容易";
      }else if(numss>=10&&numss<20){
        app.gamedata.nandu="难度:一般";
      }else if(numss>=20&&numss<30){
        app.gamedata.nandu="难度:困难"
      }else if(numss>=30&&numss<40){
        app.gamedata.nandu="难度:专家"
      }else{
        app.gamedata.nandu="难度:大师"
      }

    wx.navigateTo({
      url:'../index/index2/index1',
      
      success:function(){
        
        app.gamedata.indexbutt=2;
      },
      fail:function(){
        console.log("3");
      },
      complete:function(){
        console.log("2");
      }
    })


    }

    for(var i=0;i<app.gamedata.jiujiudata.length;++i){
      app.gamedata.jiujiudata[i].shujuchi=[];
    }


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