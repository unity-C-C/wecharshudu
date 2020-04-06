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
   nandu:"难度:",
   jishiqi:"计时器:",
   caidan:"菜单",
   view0:0,
   candan:["一键计算候选数","一键清除候选数","查看答案","重置游戏","分享数独题目"],
   showhid:false,//菜单显示和隐藏
   jiulis:[],//81个子格对象数组

   jw:70,//九宫格宽高
   jh:70,
   gg0:2,//九宫格的格子间隙
   gg1:6,//九宫格的九格的间隙
   wxx:0,//像素

   imgw:50,//工具栏图片宽高
   xuanzhongbool:xuanzhongbool//工具栏选中按钮
   
  },

//菜单显示和隐藏
 caidanvi:function(){
   this.setData({showhid:!this.data.showhid});
 },



  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数
    //console.log(750/app.globalData.wx*app.globalData.wx/3);
    //console.log(app.globalData.hg);

    //重置
    this.czdata();

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


    //游戏初始化数据 map数据
    switch(app.gamedata.nandu){
      case "难度:容易":{
        app.createmap(app.gamedata.jiujiudata,5);
      }break;
      case "难度:一般":{
        app.createmap(app.gamedata.jiujiudata,15);
      }break;
      case "难度:困难":{
        app.createmap(app.gamedata.jiujiudata,25);
      }break;
      case "难度:专家":{
        app.createmap(app.gamedata.jiujiudata,30);
      }break;
      case "难度:大师":{
        app.createmap(app.gamedata.jiujiudata,35);
      }break;
    }

    app.draw(app.gamedata.jiujiudata);

    console.log(app.gamedata.jiujiudata);    
    chongzhi=JSON.parse(JSON.stringify(app.gamedata.jiujiudata));//深度克隆

    //console.log(app.gamedata.jiujiudata);
    
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

},











//工具栏的选中事件
xuan:function(e){
  console.log("选中目标");
  //xuanzhongbool=!xuanzhongbool;
  if(xuanzhongbool==1){
     xuanzhongbool=0
  }else{
      xuanzhongbool=1;
  }
 
  this.setData({xuanzhongbool:xuanzhongbool})
},

//橡皮擦
xpc:function(e){
  if(xuanzhongbool==2){
    xuanzhongbool=0
  }else{
    xuanzhongbool=2
  }

  this.setData({xuanzhongbool:xuanzhongbool})
},

ch:function(e){
  if(xuanzhongbool==3){
    xuanzhongbool=0
  }
  else{
    xuanzhongbool=3

    //撤回功能
    console.log(app.gamedata.jiujiudataold.length-1)
    if(app.gamedata.jiujiudataold.length-1>=0){
        //app.gamedata.jiujiudataold.splice(app.gamedata.jiujiudataold.length-1,1)

        if(app.gamedata.jiujiudataold.length-1>=0){
          console.log(app.gamedata.jiujiudataold)
              app.gamedata.jiujiudata[
                app.gamedata.jiujiudataold[app.gamedata.jiujiudataold.length-1].id
                ].date=app.gamedata.jiujiudataold[app.gamedata.jiujiudataold.length-1].date
              app.gamedata.jiujiudata[
                app.gamedata.jiujiudataold[app.gamedata.jiujiudataold.length-1].id
                ].shujuchi=app.gamedata.jiujiudataold[app.gamedata.jiujiudataold.length-1].shujuchi
              app.gamedata.jiujiudata[
                app.gamedata.jiujiudataold[app.gamedata.jiujiudataold.length-1].id
                ].biaojihong=app.gamedata.jiujiudataold[app.gamedata.jiujiudataold.length-1].biaojihong
              app.gamedata.jiujiudata[
                app.gamedata.jiujiudataold[app.gamedata.jiujiudataold.length-1].id
                ].yuanshengdata=app.gamedata.jiujiudataold[app.gamedata.jiujiudataold.length-1].yuanshengdata
              
              app.gamedata.jiujiudataold.splice(app.gamedata.jiujiudataold.length-1,1)
        }
       
        app.panding0(app.gamedata.jiujiudata)
        this.setData({jiulis:app.gamedata.jiujiudata})

    }
    
  }
this.setData({xuanzhongbool:xuanzhongbool})
},

ts:function(e){
  if(xuanzhongbool==4){
    xuanzhongbool=0
  }else{
    xuanzhongbool=4

    app.gamedata.jiujiudata = app.panding2(app.gamedata.jiujiudata)
    console.log(app.gamedata.jiujiudata)
    this.setData({jiulis:app.gamedata.jiujiudata})
  }
  this.setData({xuanzhongbool:xuanzhongbool})
},

//数据池
num1:function(e){
//this.biaojihongfalse()
var linshi=true
//没选择工具栏 点击了数独数字框 点击了数据池的事件  还有一点是不能修改原生数字 只能修改候选数或者是后来添加的
  if(xuanzhongbool==0){
      for(var i=0;i<app.gamedata.jiujiudata.length;++i){
        if(app.gamedata.jiujiudata[i].xuanzhong&&app.gamedata.jiujiudata[i].yuanshengdata==false){
           
           //记录上一步
          app.gamedata.jiujiudataold.push(JSON.parse(JSON.stringify(app.gamedata.jiujiudata[i])))
          
          app.gamedata.jiujiudata[i].date=e.currentTarget.dataset.id
          app.gamedata.jiujiudata[i].yuanshengdata=true
          app.gamedata.jiujiudata[i].shujuchi=[]
         
          //记录上一步
          app.gamedata.jiujiudataold.push(JSON.parse(JSON.stringify(app.gamedata.jiujiudata[i])))
          
          break
        }
      }

      //重复显示为红 //原生数字显示为红 候选数删除
      app.panding0(app.gamedata.jiujiudata)
      //console.log(app.gamedata.jiujiudata)
  }


  else if(xuanzhongbool==1){
    for(var i=0;i<app.gamedata.jiujiudata.length;++i){
        if(app.gamedata.jiujiudata[i].xuanzhong&&app.gamedata.jiujiudata[i].yuanshengdata==false){
          for(var j=0;j<app.gamedata.jiujiudata[i].shujuchi.length;++j){
              if(app.gamedata.jiujiudata[i].shujuchi[j].date==e.currentTarget.dataset.id&&
              app.gamedata.jiujiudata[i].shujuchi[j].date!=""){
                linshi=false
                break
              }
          }
          if(linshi){

          //记录上一步
          app.gamedata.jiujiudataold.push(JSON.parse(JSON.stringify(app.gamedata.jiujiudata[i])))
          

            var ii = app.jiujiudata()
            ii.date = e.currentTarget.dataset.id
            ii.id=e.currentTarget.dataset.id-1
            ii.idvalue=e.currentTarget.dataset.id

            app.gamedata.jiujiudata[i].shujuchi.push(ii)
              //记录上一步
            app.gamedata.jiujiudataold.push(JSON.parse(JSON.stringify(app.gamedata.jiujiudata[i])))
          
            break
          }
          
        }
      }

      app.panding1(app.gamedata.jiujiudata)
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
           //记录上一步
          app.gamedata.jiujiudataold.push(JSON.parse(JSON.stringify(app.gamedata.jiujiudata[i])))
          
          
          app.gamedata.jiujiudata[i].date=e.currentTarget.dataset.id
          app.gamedata.jiujiudata[i].yuanshengdata=true
          app.gamedata.jiujiudata[i].shujuchi=[]
          //记录上一步
          app.gamedata.jiujiudataold.push([app.gamedata.jiujiudata[i]])
          break
        }
      }

      //重复显示为红 //原生数字显示为红 候选数删除
      app.panding0(app.gamedata.jiujiudata)
      //console.log(app.gamedata.jiujiudata)
  }


  else if(xuanzhongbool==1){
    for(var i=0;i<app.gamedata.jiujiudata.length;++i){
        if(app.gamedata.jiujiudata[i].xuanzhong&&app.gamedata.jiujiudata[i].yuanshengdata==false){
          for(var j=0;j<app.gamedata.jiujiudata[i].shujuchi.length;++j){
              if(app.gamedata.jiujiudata[i].shujuchi[j].date==e.currentTarget.dataset.id&&
              app.gamedata.jiujiudata[i].shujuchi[j].date!=""){
                linshi=false
                break
              }
          }
          if(linshi){

             //记录上一步
          app.gamedata.jiujiudataold.push(JSON.parse(JSON.stringify(app.gamedata.jiujiudata[i])))
          
            var ii = app.jiujiudata()
            ii.date = e.currentTarget.dataset.id
            ii.id=e.currentTarget.dataset.id-1
            ii.idvalue=e.currentTarget.dataset.id

            app.gamedata.jiujiudata[i].shujuchi.push(ii)
             //记录上一步
          app.gamedata.jiujiudataold.push(JSON.parse(JSON.stringify(app.gamedata.jiujiudata[i])))
          
            break
          }
          
        }
      }

      app.panding1(app.gamedata.jiujiudata)
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
          //记录上一步
          app.gamedata.jiujiudataold.push(JSON.parse(JSON.stringify(app.gamedata.jiujiudata[i])))
          
         
          app.gamedata.jiujiudata[i].date=e.currentTarget.dataset.id
          app.gamedata.jiujiudata[i].yuanshengdata=true
          app.gamedata.jiujiudata[i].shujuchi=[]
          //记录上一步
          app.gamedata.jiujiudataold.push(JSON.parse(JSON.stringify(app.gamedata.jiujiudata[i])))
          
          break
        }
      }

      //重复显示为红 //原生数字显示为红 候选数删除
      app.panding0(app.gamedata.jiujiudata)
      //console.log(app.gamedata.jiujiudata)
  }


  else if(xuanzhongbool==1){
    for(var i=0;i<app.gamedata.jiujiudata.length;++i){
        if(app.gamedata.jiujiudata[i].xuanzhong&&app.gamedata.jiujiudata[i].yuanshengdata==false){
          for(var j=0;j<app.gamedata.jiujiudata[i].shujuchi.length;++j){
              if(app.gamedata.jiujiudata[i].shujuchi[j].date==e.currentTarget.dataset.id&&
              app.gamedata.jiujiudata[i].shujuchi[j].date!=""){
                linshi=false
                break
              }
          }
          if(linshi){

             //记录上一步
          app.gamedata.jiujiudataold.push(JSON.parse(JSON.stringify(app.gamedata.jiujiudata[i])))
          
            var ii = app.jiujiudata()
            ii.date = e.currentTarget.dataset.id
            ii.id=e.currentTarget.dataset.id-1
            ii.idvalue=e.currentTarget.dataset.id

            app.gamedata.jiujiudata[i].shujuchi.push(ii)
             //记录上一步
          app.gamedata.jiujiudataold.push(JSON.parse(JSON.stringify(app.gamedata.jiujiudata[i])))
          
            break
          }
          
        }
      }

      app.panding1(app.gamedata.jiujiudata)
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
          
           //记录上一步
          app.gamedata.jiujiudataold.push(JSON.parse(JSON.stringify(app.gamedata.jiujiudata[i])))
          
          
          app.gamedata.jiujiudata[i].date=e.currentTarget.dataset.id
          app.gamedata.jiujiudata[i].yuanshengdata=true
          app.gamedata.jiujiudata[i].shujuchi=[]
          //记录上一步
          app.gamedata.jiujiudataold.push(JSON.parse(JSON.stringify(app.gamedata.jiujiudata[i])))
          
          break
        }
      }

      //重复显示为红 //原生数字显示为红 候选数删除
      app.panding0(app.gamedata.jiujiudata)
      //console.log(app.gamedata.jiujiudata)
  }


  else if(xuanzhongbool==1){
    for(var i=0;i<app.gamedata.jiujiudata.length;++i){
        if(app.gamedata.jiujiudata[i].xuanzhong&&app.gamedata.jiujiudata[i].yuanshengdata==false){
          for(var j=0;j<app.gamedata.jiujiudata[i].shujuchi.length;++j){
              if(app.gamedata.jiujiudata[i].shujuchi[j].date==e.currentTarget.dataset.id&&
              app.gamedata.jiujiudata[i].shujuchi[j].date!=""){
                linshi=false
                break
              }
          }
          if(linshi){
             //记录上一步
          app.gamedata.jiujiudataold.push(JSON.parse(JSON.stringify(app.gamedata.jiujiudata[i])))
          
            var ii = app.jiujiudata()
            ii.date = e.currentTarget.dataset.id
            ii.id=e.currentTarget.dataset.id-1
            ii.idvalue=e.currentTarget.dataset.id

            app.gamedata.jiujiudata[i].shujuchi.push(ii)
              //记录上一步
          app.gamedata.jiujiudataold.push(JSON.parse(JSON.stringify(app.gamedata.jiujiudata[i])))
          
            break
          }
          
        }
      }

      app.panding1(app.gamedata.jiujiudata)
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
          
           //记录上一步
          app.gamedata.jiujiudataold.push(JSON.parse(JSON.stringify(app.gamedata.jiujiudata[i])))
          
          app.gamedata.jiujiudata[i].date=e.currentTarget.dataset.id
          app.gamedata.jiujiudata[i].yuanshengdata=true
          app.gamedata.jiujiudata[i].shujuchi=[]
           //记录上一步
          app.gamedata.jiujiudataold.push(JSON.parse(JSON.stringify(app.gamedata.jiujiudata[i])))
          
          break
        }
      }

      //重复显示为红 //原生数字显示为红 候选数删除
      app.panding0(app.gamedata.jiujiudata)
      //console.log(app.gamedata.jiujiudata)
  }


  else if(xuanzhongbool==1){
    for(var i=0;i<app.gamedata.jiujiudata.length;++i){
        if(app.gamedata.jiujiudata[i].xuanzhong&&app.gamedata.jiujiudata[i].yuanshengdata==false){
          for(var j=0;j<app.gamedata.jiujiudata[i].shujuchi.length;++j){
              if(app.gamedata.jiujiudata[i].shujuchi[j].date==e.currentTarget.dataset.id&&
              app.gamedata.jiujiudata[i].shujuchi[j].date!=""){
                linshi=false
                break
              }
          }
          if(linshi){

             //记录上一步
          app.gamedata.jiujiudataold.push(JSON.parse(JSON.stringify(app.gamedata.jiujiudata[i])))
          
            var ii = app.jiujiudata()
            ii.date = e.currentTarget.dataset.id
            ii.id=e.currentTarget.dataset.id-1
            ii.idvalue=e.currentTarget.dataset.id

            app.gamedata.jiujiudata[i].shujuchi.push(ii)
             //记录上一步
          app.gamedata.jiujiudataold.push(JSON.parse(JSON.stringify(app.gamedata.jiujiudata[i])))
          
            break
          }
          
        }
      }

      app.panding1(app.gamedata.jiujiudata)
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
         
          //记录上一步
          app.gamedata.jiujiudataold.push(JSON.parse(JSON.stringify(app.gamedata.jiujiudata[i])))
          
          app.gamedata.jiujiudata[i].date=e.currentTarget.dataset.id
          app.gamedata.jiujiudata[i].yuanshengdata=true
          app.gamedata.jiujiudata[i].shujuchi=[]
          //记录上一步
          app.gamedata.jiujiudataold.push(JSON.parse(JSON.stringify(app.gamedata.jiujiudata[i])))
          
          break
        }
      }

      //重复显示为红 //原生数字显示为红 候选数删除
      app.panding0(app.gamedata.jiujiudata)
      //console.log(app.gamedata.jiujiudata)
  }


  else if(xuanzhongbool==1){
    for(var i=0;i<app.gamedata.jiujiudata.length;++i){
        if(app.gamedata.jiujiudata[i].xuanzhong&&app.gamedata.jiujiudata[i].yuanshengdata==false){
          for(var j=0;j<app.gamedata.jiujiudata[i].shujuchi.length;++j){
              if(app.gamedata.jiujiudata[i].shujuchi[j].date==e.currentTarget.dataset.id&&
              app.gamedata.jiujiudata[i].shujuchi[j].date!=""){
                linshi=false
                break
              }
          }
          if(linshi){

             //记录上一步
          app.gamedata.jiujiudataold.push(JSON.parse(JSON.stringify(app.gamedata.jiujiudata[i])))
          
            var ii = app.jiujiudata()
            ii.date = e.currentTarget.dataset.id
            ii.id=e.currentTarget.dataset.id-1
            ii.idvalue=e.currentTarget.dataset.id

            app.gamedata.jiujiudata[i].shujuchi.push(ii)
             //记录上一步
          app.gamedata.jiujiudataold.push(JSON.parse(JSON.stringify(app.gamedata.jiujiudata[i])))
          
            break
          }
          
        }
      }

      app.panding1(app.gamedata.jiujiudata)
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
          
           //记录上一步
          app.gamedata.jiujiudataold.push(JSON.parse(JSON.stringify(app.gamedata.jiujiudata[i])))
          
          app.gamedata.jiujiudata[i].date=e.currentTarget.dataset.id
          app.gamedata.jiujiudata[i].yuanshengdata=true
          app.gamedata.jiujiudata[i].shujuchi=[]
           //记录上一步
          app.gamedata.jiujiudataold.push(JSON.parse(JSON.stringify(app.gamedata.jiujiudata[i])))
          
          break
        }
      }

      //重复显示为红 //原生数字显示为红 候选数删除
      app.panding0(app.gamedata.jiujiudata)
      //console.log(app.gamedata.jiujiudata)
  }


  else if(xuanzhongbool==1){
    for(var i=0;i<app.gamedata.jiujiudata.length;++i){
        if(app.gamedata.jiujiudata[i].xuanzhong&&app.gamedata.jiujiudata[i].yuanshengdata==false){
          for(var j=0;j<app.gamedata.jiujiudata[i].shujuchi.length;++j){
              if(app.gamedata.jiujiudata[i].shujuchi[j].date==e.currentTarget.dataset.id&&
              app.gamedata.jiujiudata[i].shujuchi[j].date!=""){
                linshi=false
                break
              }
          }
          if(linshi){

             //记录上一步
          app.gamedata.jiujiudataold.push(JSON.parse(JSON.stringify(app.gamedata.jiujiudata[i])))
          
            var ii = app.jiujiudata()
            ii.date = e.currentTarget.dataset.id
            ii.id=e.currentTarget.dataset.id-1
            ii.idvalue=e.currentTarget.dataset.id

            app.gamedata.jiujiudata[i].shujuchi.push(ii)
             //记录上一步
          app.gamedata.jiujiudataold.push(JSON.parse(JSON.stringify(app.gamedata.jiujiudata[i])))
          
            break
          }
          
        }
      }

      app.panding1(app.gamedata.jiujiudata)
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
          
           //记录上一步
          app.gamedata.jiujiudataold.push(JSON.parse(JSON.stringify(app.gamedata.jiujiudata[i])))
          
          
          app.gamedata.jiujiudata[i].date=e.currentTarget.dataset.id
          app.gamedata.jiujiudata[i].yuanshengdata=true
          app.gamedata.jiujiudata[i].shujuchi=[]
          //记录上一步
          app.gamedata.jiujiudataold.push(JSON.parse(JSON.stringify(app.gamedata.jiujiudata[i])))
          
          break
        }
      }

      //重复显示为红 //原生数字显示为红 候选数删除
      app.panding0(app.gamedata.jiujiudata)
      //console.log(app.gamedata.jiujiudata)
  }


  else if(xuanzhongbool==1){
    for(var i=0;i<app.gamedata.jiujiudata.length;++i){
        if(app.gamedata.jiujiudata[i].xuanzhong&&app.gamedata.jiujiudata[i].yuanshengdata==false){
          for(var j=0;j<app.gamedata.jiujiudata[i].shujuchi.length;++j){
              if(app.gamedata.jiujiudata[i].shujuchi[j].date==e.currentTarget.dataset.id&&
              app.gamedata.jiujiudata[i].shujuchi[j].date!=""){
                linshi=false
                break
              }
          }
          if(linshi){

             //记录上一步
          app.gamedata.jiujiudataold.push(JSON.parse(JSON.stringify(app.gamedata.jiujiudata[i])))
          
            var ii = app.jiujiudata()
            ii.date = e.currentTarget.dataset.id
            ii.id=e.currentTarget.dataset.id-1
            ii.idvalue=e.currentTarget.dataset.id

            app.gamedata.jiujiudata[i].shujuchi.push(ii)
            //记录上一步
          app.gamedata.jiujiudataold.push(JSON.parse(JSON.stringify(app.gamedata.jiujiudata[i])))
          
            break
          }
          
        }
      }

      app.panding1(app.gamedata.jiujiudata)
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
          
           //记录上一步
          app.gamedata.jiujiudataold.push(JSON.parse(JSON.stringify(app.gamedata.jiujiudata[i])))
          
          
          app.gamedata.jiujiudata[i].date=e.currentTarget.dataset.id
          app.gamedata.jiujiudata[i].yuanshengdata=true
          app.gamedata.jiujiudata[i].shujuchi=[]
           //记录上一步
          app.gamedata.jiujiudataold.push(JSON.parse(JSON.stringify(app.gamedata.jiujiudata[i])))
          
          break
        }
      }

      //重复显示为红 //原生数字显示为红 候选数删除
      app.panding0(app.gamedata.jiujiudata)
      //console.log(app.gamedata.jiujiudata)
  }


  else if(xuanzhongbool==1){
    for(var i=0;i<app.gamedata.jiujiudata.length;++i){
        if(app.gamedata.jiujiudata[i].xuanzhong&&app.gamedata.jiujiudata[i].yuanshengdata==false){
          for(var j=0;j<app.gamedata.jiujiudata[i].shujuchi.length;++j){
              if(app.gamedata.jiujiudata[i].shujuchi[j].date==e.currentTarget.dataset.id&&
              app.gamedata.jiujiudata[i].shujuchi[j].date!=""){
                linshi=false
                break
              }
          }
          if(linshi){

             //记录上一步
          app.gamedata.jiujiudataold.push(JSON.parse(JSON.stringify(app.gamedata.jiujiudata[i])))
          
            var ii = app.jiujiudata()
            ii.date = e.currentTarget.dataset.id
            ii.id=e.currentTarget.dataset.id-1
            ii.idvalue=e.currentTarget.dataset.id

            app.gamedata.jiujiudata[i].shujuchi.push(ii)
             //记录上一步
          app.gamedata.jiujiudataold.push(JSON.parse(JSON.stringify(app.gamedata.jiujiudata[i])))
          
            break
          }
          
        }
      }

      app.panding1(app.gamedata.jiujiudata)
  }

  
this.setData({jiulis:app.gamedata.jiujiudata})

},













//选择数独框 只能选择一个
//这里还可以修改橡皮擦功能 ——先点击橡皮擦 再点击格子 只能删除候选数和填数  不能删除原生数字
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

  if(xuanzhongbool==2){
    if(chongzhi[(e.currentTarget.dataset.id-1)].date!=app.gamedata.jiujiudata[(e.currentTarget.dataset.id-1)].date){
      
       //记录上一步
      app.gamedata.jiujiudataold.push(JSON.parse(JSON.stringify(app.gamedata.jiujiudata[(e.currentTarget.dataset.id-1)])))
          
      app.gamedata.jiujiudata[(e.currentTarget.dataset.id-1)].date=chongzhi[(e.currentTarget.dataset.id-1)].date
      app.gamedata.jiujiudata[(e.currentTarget.dataset.id-1)].shujuchi=[]
      app.gamedata.jiujiudata[(e.currentTarget.dataset.id-1)].biaojihong=false
      app.gamedata.jiujiudata[(e.currentTarget.dataset.id-1)].yuanshengdata=false

      app.gamedata.jiujiudataold.push(JSON.parse(JSON.stringify(app.gamedata.jiujiudata[(e.currentTarget.dataset.id-1)])))
    }else if(chongzhi[(e.currentTarget.dataset.id-1)].shujuchi.length!=app.gamedata.jiujiudata[(e.currentTarget.dataset.id-1)].shujuchi.length){
      
      app.gamedata.jiujiudataold.push(JSON.parse(JSON.stringify(app.gamedata.jiujiudata[(e.currentTarget.dataset.id-1)])))
      
      app.gamedata.jiujiudata[(e.currentTarget.dataset.id-1)].date=chongzhi[(e.currentTarget.dataset.id-1)].date
      app.gamedata.jiujiudata[(e.currentTarget.dataset.id-1)].shujuchi=[]
      app.gamedata.jiujiudata[(e.currentTarget.dataset.id-1)].biaojihong=false
      app.gamedata.jiujiudata[(e.currentTarget.dataset.id-1)].yuanshengdata=false

      app.gamedata.jiujiudataold.push(JSON.parse(JSON.stringify(app.gamedata.jiujiudata[(e.currentTarget.dataset.id-1)])))
    }

    this.biaojihongfalse()
    this.setData({jiulis:app.gamedata.jiujiudata})
  }

  


},


caidanvi1:function(e){

  console.log(e)

  if(e.currentTarget.dataset.id==1){//一键计算候选数
      app.gamedata.jiujiudata = app.panding3(app.gamedata.jiujiudata)
      this.setData({jiulis:app.gamedata.jiujiudata})
  }else if(e.currentTarget.dataset.id==2){//一键清除候选数
       app.gamedata.jiujiudata = app.panding5(app.gamedata.jiujiudata)
       this.setData({jiulis:app.gamedata.jiujiudata})
  }else if(e.currentTarget.dataset.id==3){//一键查看答案

  }else if(e.currentTarget.dataset.id==4){//重置游戏

  }else if(e.currentTarget.dataset.id==5){//分享小程序

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