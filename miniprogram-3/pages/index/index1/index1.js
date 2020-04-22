//import "../sudoku.js"
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
var x = null;
// var x = require("../sudoku.js");
// console.log(x);
//x.Sudoku();
//x=x.Sudoku.prototype.classfunc();

var xuanzhong_id=-1;//记录清除选中的格子

var chongzhi=[]//重置原生数据


//工具栏的判定 当选中哪一个按钮 对map的事件产生影响
var xuanzhongbool=0;//默认选中 不选中工具栏 1 标记 2 橡皮擦 3 撤回 4 提示
var Selfdetermination=0;

Page({
  data:{
   nandu:"难度:",
   jishiqi:"计时器:",
   caidan:"菜单",
   view0:0,
   candan:["一键计算候选数","一键清除候选数","查看答案","重置游戏","分享本局"],
   showhid:false,//菜单显示和隐藏
   jiulis:[],//81个子格对象数组

   jw:70,//九宫格宽高
   jh:70,
   gg0:2,//九宫格的格子间隙
   gg1:6,//九宫格的九格的间隙
   wxx:0,//像素

   imgw:50,//工具栏图片宽高
   xuanzhongbool:xuanzhongbool,//工具栏选中按钮
   
   news_id:12,
   Selfdetermination:0//0为非自定义局面 1 为自定义局面
  },

//菜单显示和隐藏
 caidanvi:function(){
   console.log("1234");
   if(Selfdetermination==0){
   this.setData({showhid:!this.data.showhid});
   }
 },

 caidanvi2:function(e){
   console.log("123456");
   if(Selfdetermination==0){
     if(this.data.showhid){
        console.log("12345");
        this.setData({showhid:!this.data.showhid});
     }
   }
 },



  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数
    //console.log(750/app.globalData.wx*app.globalData.wx/3);
    //console.log(app.globalData.hg);

    if(options.url){
 
      let url = decodeURIComponent(options.url);
 
      wx.navigateTo({
        url
      })
 
    }

    //重置
    this.czdata();

    this.setData({'view0':750/app.globalData.wx*app.globalData.wx/3});
    this.setData({'nandu':app.gamedata.nandu});

    x = require("../sudoku.js");
if(app.gamedata.indexbutt==0){
    x=x.Sudoku.prototype.classfunc();

    this.setData({wxx:app.globalData.wx});
    console.log(x);
    console.log(x.gird);
    x.biaojifun(0);
    //游戏初始化数据 map数据
    switch(app.gamedata.nandu){
      case "难度:容易":{
        x.initSudoku(1);
        //app.createmap(app.gamedata.jiujiudata,5);
      }break;
      case "难度:一般":{
        x.initSudoku(2);
        //app.createmap(app.gamedata.jiujiudata,15);
      }break;
      case "难度:困难":{
        x.initSudoku(3);
        //app.createmap(app.gamedata.jiujiudata,25);
      }break;
      case "难度:专家":{
        x.initSudoku(4);
        //app.createmap(app.gamedata.jiujiudata,30);
      }break;
      case "难度:大师":{
        x.initSudoku(5);
        //app.createmap(app.gamedata.jiujiudata,35);
      }break;
    }

    x.valuefunc();
    app.gamedata.jiujiudata = x.gird;
    //app.draw(app.gamedata.jiujiudata);

    console.log(app.gamedata.jiujiudata); 
    x.puzzlefunc();
    chongzhi=x.puzzlecopy;
    app.gamedata.dangqiantimu=JSON.parse(JSON.stringify(x.puzzlecopy));   
    
    app.gamedata.sudukucopy=JSON.parse(JSON.stringify(x));
    

    this.setData({jiulis:app.gamedata.jiujiudata});
    
    clearInterval(app.gamedata.timeout);
    app.gamedata.timeout=null;
    app.gamedata.timenum=0;

    app.gamedata.timeout = setInterval(function(){

      app.gamedata.timenum+=1;
      this.setData({jishiqi:"计时器:"+parseInt(app.gamedata.timenum/3600)+":"+
      parseInt(app.gamedata.timenum/60%60)+":"+app.gamedata.timenum%60});

    }.bind(this),1000);

    clearInterval(app.gamedata.victorytime);
    app.gamedata.victorytime=null;
    app.gamedata.victorytime=setInterval(function(){
      this.victory();
    }.bind(this),3000);

    Selfdetermination=0;
    this.setData({Selfdetermination:Selfdetermination});

}else if(app.gamedata.indexbutt==1){
    x=x.Sudoku.prototype.classfunc();
    var xcopy = JSON.parse(JSON.stringify(app.gamedata.sudukucopy));
    x.answercopy=xcopy.answercopy;
    x.puzzlecopy=xcopy.puzzlecopy;
    x.answer=xcopy.answer;
    x.puzzle=xcopy.puzzle;
    x.gird=JSON.parse(JSON.stringify(app.gamedata.dangqiantimu));
    x.valuefunc();
    app.gamedata.jiujiudata = x.gird;

    //this.setData({jiulis:app.gamedata.jiujiudata});
    this.setData({wxx:app.globalData.wx});


    

    

    console.log(x.gird);    
   
    this.setData({jiulis:app.gamedata.jiujiudata});

    clearInterval(app.gamedata.timeout);
    app.gamedata.timeout=null;
   

    app.gamedata.timeout = setInterval(function(){
      app.gamedata.timenum+=1;
      this.setData({jishiqi:"计时器:"+parseInt(app.gamedata.timenum/3600)+":"+
      parseInt(app.gamedata.timenum/60%60)+":"+app.gamedata.timenum%60});
    }.bind(this),1000);

    clearInterval(app.gamedata.victorytime);
    app.gamedata.victorytime=null;
    app.gamedata.victorytime=setInterval(function(){
      this.victory();
    }.bind(this),3000);
    

    Selfdetermination=0;
    this.setData({Selfdetermination:Selfdetermination});
}
else if(app.gamedata.indexbutt==2){//自定义局面
    console.log("自定义界面");
    xuanzhongbool=0;
    x=x.Sudoku.prototype.classfunc();

    x.initSudoku(0);
    //console.log(x.gird);
    x.valuefunc();
    app.gamedata.nandu="自定义";
    app.gamedata.jiujiudata = x.gird;
    this.setData({nandu:app.gamedata.nandu});
    //this.setData({jiulis:app.gamedata.jiujiudata});
    this.setData({wxx:app.globalData.wx});



    console.log(app.gamedata.jiujiudata);    
    
    this.setData({jiulis:app.gamedata.jiujiudata});
    this.setData({xuanzhongbool:xuanzhongbool});
    clearInterval(app.gamedata.timeout);
    app.gamedata.timeout=null;
    app.gamedata.timenum=0;

    app.gamedata.timeout = setInterval(function(){

       this.setData({jishiqi:"计时器:"+parseInt(app.gamedata.timenum/3600)+":"+
      parseInt(app.gamedata.timenum/60%60)+":"+app.gamedata.timenum%60});

    }.bind(this),1000);

    Selfdetermination=1;
    this.setData({Selfdetermination:Selfdetermination});

}
    
    
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

chongzhi=[];

app.gamedata.jiujiudata=[];
app.gamedata.jiujiudataold=[];
app.gamedata.qiujie=[];
xuanzhong_id=-1;
},











//工具栏的标记事件
xuan:function(e){
  if(Selfdetermination==0){
    console.log("选中目标");
    //xuanzhongbool=!xuanzhongbool;
    if(xuanzhongbool==1){
      xuanzhongbool=0
    }else{
        xuanzhongbool=1;
    }
  
    this.setData({xuanzhongbool:xuanzhongbool})
  }
  
},

//橡皮擦
xpc:function(e){
  
  {
      if(xuanzhong_id!=-1&&(x.gird[parseInt(xuanzhong_id/9)][parseInt(xuanzhong_id%9)].biaojihong!=0
          &&x.gird[parseInt(xuanzhong_id/9)][parseInt(xuanzhong_id%9)].biaojihong!=2)
          &&x.gird[parseInt(xuanzhong_id/9)][parseInt(xuanzhong_id%9)].shujuchi.length<=0){
            x.gird[parseInt(xuanzhong_id/9)][parseInt(xuanzhong_id%9)].value="";
            x.gird[parseInt(xuanzhong_id/9)][parseInt(xuanzhong_id%9)].biaojihong=1;
            //x.gird[parseInt(xuanzhong_id/9)][parseInt(xuanzhong_id%9)].xuanzhong=false;
          }else if(xuanzhong_id!=-1
          &&x.gird[parseInt(xuanzhong_id/9)][parseInt(xuanzhong_id%9)].shujuchi.length>0){
            x.gird[parseInt(xuanzhong_id/9)][parseInt(xuanzhong_id%9)].shujuchi=[];
            x.gird[parseInt(xuanzhong_id/9)][parseInt(xuanzhong_id%9)].cand="";
            x.gird[parseInt(xuanzhong_id/9)][parseInt(xuanzhong_id%9)].biaojihong=1;
            //x.gird[parseInt(xuanzhong_id/9)][parseInt(xuanzhong_id%9)].xuanzhong=false;
        }
        x.checkCell20copy0();
        
        x.checkCell20copy2();
        x.checkCell20copy1();
        x.checkCell20copy3();
        //xuanzhong_id=-1;
        app.gamedata.jiujiudata=x.gird;
        this.setData({jiulis:app.gamedata.jiujiudata});
  }

    
},


ts:function(e){
  
  if(Selfdetermination==0){
    var rands = x.promptfunc();
    if(rands!=null){
      x.answerfunc();
      x.gird[rands[0]][rands[1]].value=x.answercopy[rands[0]][rands[1]].value;
      x.gird[rands[0]][rands[1]].biaojihong=1;
    }

    x.checkCell20copy1();
    x.checkCell20copy3();

    app.gamedata.jiujiudata = x.gird;

    //这里等会写候选数删除

    this.setData({jiulis:app.gamedata.jiujiudata})
    this.setData({xuanzhongbool:xuanzhongbool})
  }
  
},

//自定义i界面按钮
determine:function(){
  console.log("自定义生成");
  console.log(JSON.parse(JSON.stringify(x.gird)));
  if(Selfdetermination==1){
     if(!x.initUserDefined()){
       wx.showToast({
         title: x.initUserDefined1(),
         icon: "none",
         duration:2000,
         success:function(e){
           
         }
       })
     }
     
     else if(x.initUserDefined()){
       console.log(JSON.parse(JSON.stringify(x.gird)));
       wx.showToast({
         title: x.initUserDefined1(),
         icon: "none",
         duration:2000,
         success:function(e){

           //将自定义改为解题
           //console.log("解题");
           //console.log(x.answer);
           Selfdetermination=0;
           this.setData({Selfdetermination:Selfdetermination})
           //当前题目进行保存
           x.valuefunc();
           //当前题目biaojihong=0 加粗
           for(var i=0;i<9;++i){
             for(var j=0;j<9;++j){
               if(x.gird[i][j].value!=0&&x.gird[i][j].value!=""){
                 x.gird[i][j].biaojihong=0;
               }
             }
           }

           app.gamedata.dangqiantimu=JSON.parse(JSON.stringify(x.gird));
           x.puzzlefunc();
           //x.puzzle=JSON.parse(JSON.stringify(x.gird));
           //x.puzzlecopy=JSON.parse(JSON.stringify(x.gird));
           app.gamedata.sudukucopy=JSON.parse(JSON.stringify(x));
           app.gamedata.jiujiudata=x.gird;
           this.setData({jiulis:app.gamedata.jiujiudata});
           //计时器

           clearInterval(app.gamedata.timeout);
          app.gamedata.timeout=null;
        

          app.gamedata.timeout = setInterval(function(){
            app.gamedata.timenum+=1;
            this.setData({jishiqi:"计时器:"+parseInt(app.gamedata.timenum/3600)+":"+
            parseInt(app.gamedata.timenum/60%60)+":"+app.gamedata.timenum%60});
          }.bind(this),1000);

          clearInterval(app.gamedata.victorytime);
          app.gamedata.victorytime=null;
          app.gamedata.victorytime=setInterval(function(){
            this.victory();
          }.bind(this),3000);

          var nu = x.degreeCheck();
          switch(nu){
            
            case 1:{
                app.gamedata.nandu="难度:容易";
            }break;
            case 2:{
                app.gamedata.nandu="难度:一般";
            }break;
            case 3:{
                app.gamedata.nandu="难度:困难";
            }break;
            case 4:{
                app.gamedata.nandu="难度:专家";
            }break;
          }

          this.setData({nandu:app.gamedata.nandu});

         }.bind(this)
       })

     }
  }
},

//数据池
num1:function(e){

  console.log(xuanzhong_id);
  console.log(xuanzhongbool);
  x.checkCell20copy0();//填数全部变为1

  //标记全部变为1
  x.checkCell20copy2();
  //填数
  if(xuanzhongbool==0){
    if(xuanzhong_id!=-1){
      console.log(parseInt(xuanzhong_id/9));
      console.log(parseInt(xuanzhong_id%9));
      if(x.gird[parseInt(xuanzhong_id/9)][parseInt(xuanzhong_id%9)].xuanzhong){
          x.gird[parseInt(xuanzhong_id/9)][parseInt(xuanzhong_id%9)].shujuchi=[];
          x.gird[parseInt(xuanzhong_id/9)][parseInt(xuanzhong_id%9)].cand="";
          x.gird[parseInt(xuanzhong_id/9)][parseInt(xuanzhong_id%9)].value=e.currentTarget.dataset.id;
          
          x.checkCell20copy1();
 
          //有候选数 删除候选数
          x.checkCell20copy5(parseInt(xuanzhong_id/9),parseInt(xuanzhong_id%9),e.currentTarget.dataset.id);
          x.checkCell20copy3();
      }
    }
  }

  //标记
  else if(xuanzhongbool==1){
   
    if(xuanzhong_id!=-1){
        if(x.gird[parseInt(xuanzhong_id/9)][parseInt(xuanzhong_id%9)].xuanzhong){
            x.gird[parseInt(xuanzhong_id/9)][parseInt(xuanzhong_id%9)].value="";

            var bool = false;//判断当前数据池里面有没有当前值
            if(x.gird[parseInt(xuanzhong_id/9)][parseInt(xuanzhong_id%9)].shujuchi.length<=0){
                    var ce = x.cell0(parseInt(xuanzhong_id/9),parseInt(xuanzhong_id%9));
                    //console.log(ce);
                      ce.id=e.currentTarget.dataset.id-1;
                      ce.value=e.currentTarget.dataset.id;
                      ce.biaojihong=1;
                      x.gird[parseInt(xuanzhong_id/9)][parseInt(xuanzhong_id%9)].shujuchi.push(ce);
                   bool=true;
            }else{
                  //console.log(x.gird[parseInt(xuanzhong_id/9)][parseInt(xuanzhong_id%9)].shujuchi);
                  for(var k=0;k<x.gird[parseInt(xuanzhong_id/9)][parseInt(xuanzhong_id%9)].shujuchi.length;++k){
                    if(e.currentTarget.dataset.id==
                    x.gird[parseInt(xuanzhong_id/9)][parseInt(xuanzhong_id%9)].shujuchi[k].value){
                      x.gird[parseInt(xuanzhong_id/9)][parseInt(xuanzhong_id%9)].shujuchi.splice(k,1);
                      bool=true;
                      //console.log("123");
                    }
                }
            }

            if(bool==false){
             
                      var ce = x.cell0(parseInt(xuanzhong_id/9),parseInt(xuanzhong_id%9));
                      ce.id=e.currentTarget.dataset.id-1;
                      ce.value=e.currentTarget.dataset.id;
                      ce.biaojihong=1;
                      x.gird[parseInt(xuanzhong_id/9)][parseInt(xuanzhong_id%9)].shujuchi.push(ce);
                
            }
            


            x.checkCell20copy3();

        }
    }
  }
  app.gamedata.jiujiudata=x.gird;
  this.setData({jiulis:app.gamedata.jiujiudata});
},

num2:function(e){

  console.log(xuanzhong_id);
  console.log(xuanzhongbool);
  x.checkCell20copy0();//填数全部变为1

  //标记全部变为1
  x.checkCell20copy2();
  //填数
  if(xuanzhongbool==0){
    if(xuanzhong_id!=-1){
      console.log(parseInt(xuanzhong_id/9));
      console.log(parseInt(xuanzhong_id%9));
      if(x.gird[parseInt(xuanzhong_id/9)][parseInt(xuanzhong_id%9)].xuanzhong){
          x.gird[parseInt(xuanzhong_id/9)][parseInt(xuanzhong_id%9)].shujuchi=[];
          x.gird[parseInt(xuanzhong_id/9)][parseInt(xuanzhong_id%9)].cand="";
          x.gird[parseInt(xuanzhong_id/9)][parseInt(xuanzhong_id%9)].value=e.currentTarget.dataset.id;
          
          x.checkCell20copy1();
 
          //有候选数 删除候选数
          x.checkCell20copy5(parseInt(xuanzhong_id/9),parseInt(xuanzhong_id%9),e.currentTarget.dataset.id);
          x.checkCell20copy3();
      }
    }
  }

  //标记
  else if(xuanzhongbool==1){
   
    if(xuanzhong_id!=-1){
        if(x.gird[parseInt(xuanzhong_id/9)][parseInt(xuanzhong_id%9)].xuanzhong){
            x.gird[parseInt(xuanzhong_id/9)][parseInt(xuanzhong_id%9)].value="";

            var bool = false;//判断当前数据池里面有没有当前值
            if(x.gird[parseInt(xuanzhong_id/9)][parseInt(xuanzhong_id%9)].shujuchi.length<=0){
                    var ce = x.cell0(parseInt(xuanzhong_id/9),parseInt(xuanzhong_id%9));
                    //console.log(ce);
                      ce.id=e.currentTarget.dataset.id-1;
                      ce.value=e.currentTarget.dataset.id;
                      ce.biaojihong=1;
                      x.gird[parseInt(xuanzhong_id/9)][parseInt(xuanzhong_id%9)].shujuchi.push(ce);
                   bool=true;
            }else{
                  //console.log(x.gird[parseInt(xuanzhong_id/9)][parseInt(xuanzhong_id%9)].shujuchi);
                  for(var k=0;k<x.gird[parseInt(xuanzhong_id/9)][parseInt(xuanzhong_id%9)].shujuchi.length;++k){
                    if(e.currentTarget.dataset.id==
                    x.gird[parseInt(xuanzhong_id/9)][parseInt(xuanzhong_id%9)].shujuchi[k].value){
                      x.gird[parseInt(xuanzhong_id/9)][parseInt(xuanzhong_id%9)].shujuchi.splice(k,1);
                      bool=true;
                      //console.log("123");
                    }
                }
            }

            if(bool==false){
             
                      var ce = x.cell0(parseInt(xuanzhong_id/9),parseInt(xuanzhong_id%9));
                      ce.id=e.currentTarget.dataset.id-1;
                      ce.value=e.currentTarget.dataset.id;
                      ce.biaojihong=1;
                      x.gird[parseInt(xuanzhong_id/9)][parseInt(xuanzhong_id%9)].shujuchi.push(ce);
                
            }
            


            x.checkCell20copy3();

        }
    }
  }
  app.gamedata.jiujiudata=x.gird;
  this.setData({jiulis:app.gamedata.jiujiudata});
},

num3:function(e){

  console.log(xuanzhong_id);
  console.log(xuanzhongbool);
  x.checkCell20copy0();//填数全部变为1

  //标记全部变为1
  x.checkCell20copy2();
  //填数
  if(xuanzhongbool==0){
    if(xuanzhong_id!=-1){
      console.log(parseInt(xuanzhong_id/9));
      console.log(parseInt(xuanzhong_id%9));
      if(x.gird[parseInt(xuanzhong_id/9)][parseInt(xuanzhong_id%9)].xuanzhong){
          x.gird[parseInt(xuanzhong_id/9)][parseInt(xuanzhong_id%9)].shujuchi=[];
          x.gird[parseInt(xuanzhong_id/9)][parseInt(xuanzhong_id%9)].cand="";
          x.gird[parseInt(xuanzhong_id/9)][parseInt(xuanzhong_id%9)].value=e.currentTarget.dataset.id;
          
          x.checkCell20copy1();
 
          //有候选数 删除候选数
          x.checkCell20copy5(parseInt(xuanzhong_id/9),parseInt(xuanzhong_id%9),e.currentTarget.dataset.id);
          x.checkCell20copy3();
      }
    }
  }

  //标记
  else if(xuanzhongbool==1){
   
    if(xuanzhong_id!=-1){
        if(x.gird[parseInt(xuanzhong_id/9)][parseInt(xuanzhong_id%9)].xuanzhong){
            x.gird[parseInt(xuanzhong_id/9)][parseInt(xuanzhong_id%9)].value="";

            var bool = false;//判断当前数据池里面有没有当前值
            if(x.gird[parseInt(xuanzhong_id/9)][parseInt(xuanzhong_id%9)].shujuchi.length<=0){
                    var ce = x.cell0(parseInt(xuanzhong_id/9),parseInt(xuanzhong_id%9));
                    //console.log(ce);
                      ce.id=e.currentTarget.dataset.id-1;
                      ce.value=e.currentTarget.dataset.id;
                      ce.biaojihong=1;
                      x.gird[parseInt(xuanzhong_id/9)][parseInt(xuanzhong_id%9)].shujuchi.push(ce);
                   bool=true;
            }else{
                  //console.log(x.gird[parseInt(xuanzhong_id/9)][parseInt(xuanzhong_id%9)].shujuchi);
                  for(var k=0;k<x.gird[parseInt(xuanzhong_id/9)][parseInt(xuanzhong_id%9)].shujuchi.length;++k){
                    if(e.currentTarget.dataset.id==
                    x.gird[parseInt(xuanzhong_id/9)][parseInt(xuanzhong_id%9)].shujuchi[k].value){
                      x.gird[parseInt(xuanzhong_id/9)][parseInt(xuanzhong_id%9)].shujuchi.splice(k,1);
                      bool=true;
                      //console.log("123");
                    }
                }
            }

            if(bool==false){
             
                      var ce = x.cell0(parseInt(xuanzhong_id/9),parseInt(xuanzhong_id%9));
                      ce.id=e.currentTarget.dataset.id-1;
                      ce.value=e.currentTarget.dataset.id;
                      ce.biaojihong=1;
                      x.gird[parseInt(xuanzhong_id/9)][parseInt(xuanzhong_id%9)].shujuchi.push(ce);
                
            }
            


            x.checkCell20copy3();

        }
    }
  }
  app.gamedata.jiujiudata=x.gird;
  this.setData({jiulis:app.gamedata.jiujiudata});
},


num4:function(e){

  console.log(xuanzhong_id);
  console.log(xuanzhongbool);
  x.checkCell20copy0();//填数全部变为1

  //标记全部变为1
  x.checkCell20copy2();
  //填数
  if(xuanzhongbool==0){
    if(xuanzhong_id!=-1){
      console.log(parseInt(xuanzhong_id/9));
      console.log(parseInt(xuanzhong_id%9));
      if(x.gird[parseInt(xuanzhong_id/9)][parseInt(xuanzhong_id%9)].xuanzhong){
          x.gird[parseInt(xuanzhong_id/9)][parseInt(xuanzhong_id%9)].shujuchi=[];
          x.gird[parseInt(xuanzhong_id/9)][parseInt(xuanzhong_id%9)].cand="";
          x.gird[parseInt(xuanzhong_id/9)][parseInt(xuanzhong_id%9)].value=e.currentTarget.dataset.id;
          
          x.checkCell20copy1();
 
          //有候选数 删除候选数
          x.checkCell20copy5(parseInt(xuanzhong_id/9),parseInt(xuanzhong_id%9),e.currentTarget.dataset.id);
          x.checkCell20copy3();
      }
    }
  }

  //标记
  else if(xuanzhongbool==1){
   
    if(xuanzhong_id!=-1){
        if(x.gird[parseInt(xuanzhong_id/9)][parseInt(xuanzhong_id%9)].xuanzhong){
            x.gird[parseInt(xuanzhong_id/9)][parseInt(xuanzhong_id%9)].value="";

            var bool = false;//判断当前数据池里面有没有当前值
            if(x.gird[parseInt(xuanzhong_id/9)][parseInt(xuanzhong_id%9)].shujuchi.length<=0){
                    var ce = x.cell0(parseInt(xuanzhong_id/9),parseInt(xuanzhong_id%9));
                    //console.log(ce);
                      ce.id=e.currentTarget.dataset.id-1;
                      ce.value=e.currentTarget.dataset.id;
                      ce.biaojihong=1;
                      x.gird[parseInt(xuanzhong_id/9)][parseInt(xuanzhong_id%9)].shujuchi.push(ce);
                   bool=true;
            }else{
                  //console.log(x.gird[parseInt(xuanzhong_id/9)][parseInt(xuanzhong_id%9)].shujuchi);
                  for(var k=0;k<x.gird[parseInt(xuanzhong_id/9)][parseInt(xuanzhong_id%9)].shujuchi.length;++k){
                    if(e.currentTarget.dataset.id==
                    x.gird[parseInt(xuanzhong_id/9)][parseInt(xuanzhong_id%9)].shujuchi[k].value){
                      x.gird[parseInt(xuanzhong_id/9)][parseInt(xuanzhong_id%9)].shujuchi.splice(k,1);
                      bool=true;
                      //console.log("123");
                    }
                }
            }

            if(bool==false){
             
                      var ce = x.cell0(parseInt(xuanzhong_id/9),parseInt(xuanzhong_id%9));
                      ce.id=e.currentTarget.dataset.id-1;
                      ce.value=e.currentTarget.dataset.id;
                      ce.biaojihong=1;
                      x.gird[parseInt(xuanzhong_id/9)][parseInt(xuanzhong_id%9)].shujuchi.push(ce);
                
            }
            


            x.checkCell20copy3();

        }
    }
  }
  app.gamedata.jiujiudata=x.gird;
  this.setData({jiulis:app.gamedata.jiujiudata});
},


num5:function(e){
 
  console.log(xuanzhong_id);
  console.log(xuanzhongbool);
  x.checkCell20copy0();//填数全部变为1

  //标记全部变为1
  x.checkCell20copy2();
  //填数
  if(xuanzhongbool==0){
    if(xuanzhong_id!=-1){
      console.log(parseInt(xuanzhong_id/9));
      console.log(parseInt(xuanzhong_id%9));
      if(x.gird[parseInt(xuanzhong_id/9)][parseInt(xuanzhong_id%9)].xuanzhong){
          x.gird[parseInt(xuanzhong_id/9)][parseInt(xuanzhong_id%9)].shujuchi=[];
          x.gird[parseInt(xuanzhong_id/9)][parseInt(xuanzhong_id%9)].cand="";
          x.gird[parseInt(xuanzhong_id/9)][parseInt(xuanzhong_id%9)].value=e.currentTarget.dataset.id;
          
          x.checkCell20copy1();
 
          //有候选数 删除候选数
          x.checkCell20copy5(parseInt(xuanzhong_id/9),parseInt(xuanzhong_id%9),e.currentTarget.dataset.id);
          x.checkCell20copy3();
      }
    }
  }

  //标记
  else if(xuanzhongbool==1){
   
    if(xuanzhong_id!=-1){
        if(x.gird[parseInt(xuanzhong_id/9)][parseInt(xuanzhong_id%9)].xuanzhong){
            x.gird[parseInt(xuanzhong_id/9)][parseInt(xuanzhong_id%9)].value="";

            var bool = false;//判断当前数据池里面有没有当前值
            if(x.gird[parseInt(xuanzhong_id/9)][parseInt(xuanzhong_id%9)].shujuchi.length<=0){
                    var ce = x.cell0(parseInt(xuanzhong_id/9),parseInt(xuanzhong_id%9));
                    //console.log(ce);
                      ce.id=e.currentTarget.dataset.id-1;
                      ce.value=e.currentTarget.dataset.id;
                      ce.biaojihong=1;
                      x.gird[parseInt(xuanzhong_id/9)][parseInt(xuanzhong_id%9)].shujuchi.push(ce);
                   bool=true;
            }else{
                  //console.log(x.gird[parseInt(xuanzhong_id/9)][parseInt(xuanzhong_id%9)].shujuchi);
                  for(var k=0;k<x.gird[parseInt(xuanzhong_id/9)][parseInt(xuanzhong_id%9)].shujuchi.length;++k){
                    if(e.currentTarget.dataset.id==
                    x.gird[parseInt(xuanzhong_id/9)][parseInt(xuanzhong_id%9)].shujuchi[k].value){
                      x.gird[parseInt(xuanzhong_id/9)][parseInt(xuanzhong_id%9)].shujuchi.splice(k,1);
                      bool=true;
                      //console.log("123");
                    }
                }
            }

            if(bool==false){
             
                      var ce = x.cell0(parseInt(xuanzhong_id/9),parseInt(xuanzhong_id%9));
                      ce.id=e.currentTarget.dataset.id-1;
                      ce.value=e.currentTarget.dataset.id;
                      ce.biaojihong=1;
                      x.gird[parseInt(xuanzhong_id/9)][parseInt(xuanzhong_id%9)].shujuchi.push(ce);
                
            }
            


            x.checkCell20copy3();

        }
    }
  }
  app.gamedata.jiujiudata=x.gird;
  this.setData({jiulis:app.gamedata.jiujiudata});
},


num6:function(e){
 
  console.log(xuanzhong_id);
  console.log(xuanzhongbool);
  x.checkCell20copy0();//填数全部变为1

  //标记全部变为1
  x.checkCell20copy2();
  //填数
  if(xuanzhongbool==0){
    if(xuanzhong_id!=-1){
      console.log(parseInt(xuanzhong_id/9));
      console.log(parseInt(xuanzhong_id%9));
      if(x.gird[parseInt(xuanzhong_id/9)][parseInt(xuanzhong_id%9)].xuanzhong){
          x.gird[parseInt(xuanzhong_id/9)][parseInt(xuanzhong_id%9)].shujuchi=[];
          x.gird[parseInt(xuanzhong_id/9)][parseInt(xuanzhong_id%9)].cand="";
          x.gird[parseInt(xuanzhong_id/9)][parseInt(xuanzhong_id%9)].value=e.currentTarget.dataset.id;
          
          x.checkCell20copy1();
 
          //有候选数 删除候选数
          x.checkCell20copy5(parseInt(xuanzhong_id/9),parseInt(xuanzhong_id%9),e.currentTarget.dataset.id);
          x.checkCell20copy3();
      }
    }
  }

  //标记
  else if(xuanzhongbool==1){
   
    if(xuanzhong_id!=-1){
        if(x.gird[parseInt(xuanzhong_id/9)][parseInt(xuanzhong_id%9)].xuanzhong){
            x.gird[parseInt(xuanzhong_id/9)][parseInt(xuanzhong_id%9)].value="";

            var bool = false;//判断当前数据池里面有没有当前值
            if(x.gird[parseInt(xuanzhong_id/9)][parseInt(xuanzhong_id%9)].shujuchi.length<=0){
                    var ce = x.cell0(parseInt(xuanzhong_id/9),parseInt(xuanzhong_id%9));
                    //console.log(ce);
                      ce.id=e.currentTarget.dataset.id-1;
                      ce.value=e.currentTarget.dataset.id;
                      ce.biaojihong=1;
                      x.gird[parseInt(xuanzhong_id/9)][parseInt(xuanzhong_id%9)].shujuchi.push(ce);
                   bool=true;
            }else{
                  //console.log(x.gird[parseInt(xuanzhong_id/9)][parseInt(xuanzhong_id%9)].shujuchi);
                  for(var k=0;k<x.gird[parseInt(xuanzhong_id/9)][parseInt(xuanzhong_id%9)].shujuchi.length;++k){
                    if(e.currentTarget.dataset.id==
                    x.gird[parseInt(xuanzhong_id/9)][parseInt(xuanzhong_id%9)].shujuchi[k].value){
                      x.gird[parseInt(xuanzhong_id/9)][parseInt(xuanzhong_id%9)].shujuchi.splice(k,1);
                      bool=true;
                      //console.log("123");
                    }
                }
            }

            if(bool==false){
             
                      var ce = x.cell0(parseInt(xuanzhong_id/9),parseInt(xuanzhong_id%9));
                      ce.id=e.currentTarget.dataset.id-1;
                      ce.value=e.currentTarget.dataset.id;
                      ce.biaojihong=1;
                      x.gird[parseInt(xuanzhong_id/9)][parseInt(xuanzhong_id%9)].shujuchi.push(ce);
                
            }
            


            x.checkCell20copy3();

        }
    }
  }
  app.gamedata.jiujiudata=x.gird;
  this.setData({jiulis:app.gamedata.jiujiudata});
},


num7:function(e){
 
  console.log(xuanzhong_id);
  console.log(xuanzhongbool);
  x.checkCell20copy0();//填数全部变为1

  //标记全部变为1
  x.checkCell20copy2();
  //填数
  if(xuanzhongbool==0){
    if(xuanzhong_id!=-1){
      console.log(parseInt(xuanzhong_id/9));
      console.log(parseInt(xuanzhong_id%9));
      if(x.gird[parseInt(xuanzhong_id/9)][parseInt(xuanzhong_id%9)].xuanzhong){
          x.gird[parseInt(xuanzhong_id/9)][parseInt(xuanzhong_id%9)].shujuchi=[];
          x.gird[parseInt(xuanzhong_id/9)][parseInt(xuanzhong_id%9)].cand="";
          x.gird[parseInt(xuanzhong_id/9)][parseInt(xuanzhong_id%9)].value=e.currentTarget.dataset.id;
          
          x.checkCell20copy1();
 
          //有候选数 删除候选数
          x.checkCell20copy5(parseInt(xuanzhong_id/9),parseInt(xuanzhong_id%9),e.currentTarget.dataset.id);
          x.checkCell20copy3();
      }
    }
  }

  //标记
  else if(xuanzhongbool==1){
   
    if(xuanzhong_id!=-1){
        if(x.gird[parseInt(xuanzhong_id/9)][parseInt(xuanzhong_id%9)].xuanzhong){
            x.gird[parseInt(xuanzhong_id/9)][parseInt(xuanzhong_id%9)].value="";

            var bool = false;//判断当前数据池里面有没有当前值
            if(x.gird[parseInt(xuanzhong_id/9)][parseInt(xuanzhong_id%9)].shujuchi.length<=0){
                    var ce = x.cell0(parseInt(xuanzhong_id/9),parseInt(xuanzhong_id%9));
                    //console.log(ce);
                      ce.id=e.currentTarget.dataset.id-1;
                      ce.value=e.currentTarget.dataset.id;
                      ce.biaojihong=1;
                      x.gird[parseInt(xuanzhong_id/9)][parseInt(xuanzhong_id%9)].shujuchi.push(ce);
                   bool=true;
            }else{
                  //console.log(x.gird[parseInt(xuanzhong_id/9)][parseInt(xuanzhong_id%9)].shujuchi);
                  for(var k=0;k<x.gird[parseInt(xuanzhong_id/9)][parseInt(xuanzhong_id%9)].shujuchi.length;++k){
                    if(e.currentTarget.dataset.id==
                    x.gird[parseInt(xuanzhong_id/9)][parseInt(xuanzhong_id%9)].shujuchi[k].value){
                      x.gird[parseInt(xuanzhong_id/9)][parseInt(xuanzhong_id%9)].shujuchi.splice(k,1);
                      bool=true;
                      //console.log("123");
                    }
                }
            }

            if(bool==false){
             
                      var ce = x.cell0(parseInt(xuanzhong_id/9),parseInt(xuanzhong_id%9));
                      ce.id=e.currentTarget.dataset.id-1;
                      ce.value=e.currentTarget.dataset.id;
                      ce.biaojihong=1;
                      x.gird[parseInt(xuanzhong_id/9)][parseInt(xuanzhong_id%9)].shujuchi.push(ce);
                
            }
            


            x.checkCell20copy3();

        }
    }
  }
  app.gamedata.jiujiudata=x.gird;
  this.setData({jiulis:app.gamedata.jiujiudata});

},


num8:function(e){
 
  console.log(xuanzhong_id);
  console.log(xuanzhongbool);
  x.checkCell20copy0();//填数全部变为1

  //标记全部变为1
  x.checkCell20copy2();
  //填数
  if(xuanzhongbool==0){
    if(xuanzhong_id!=-1){
      console.log(parseInt(xuanzhong_id/9));
      console.log(parseInt(xuanzhong_id%9));
      if(x.gird[parseInt(xuanzhong_id/9)][parseInt(xuanzhong_id%9)].xuanzhong){
          x.gird[parseInt(xuanzhong_id/9)][parseInt(xuanzhong_id%9)].shujuchi=[];
          x.gird[parseInt(xuanzhong_id/9)][parseInt(xuanzhong_id%9)].cand="";
          x.gird[parseInt(xuanzhong_id/9)][parseInt(xuanzhong_id%9)].value=e.currentTarget.dataset.id;
          
          x.checkCell20copy1();
 
          //有候选数 删除候选数
          x.checkCell20copy5(parseInt(xuanzhong_id/9),parseInt(xuanzhong_id%9),e.currentTarget.dataset.id);
          x.checkCell20copy3();
      }
    }
  }

  //标记
  else if(xuanzhongbool==1){
   
    if(xuanzhong_id!=-1){
        if(x.gird[parseInt(xuanzhong_id/9)][parseInt(xuanzhong_id%9)].xuanzhong){
            x.gird[parseInt(xuanzhong_id/9)][parseInt(xuanzhong_id%9)].value="";

            var bool = false;//判断当前数据池里面有没有当前值
            if(x.gird[parseInt(xuanzhong_id/9)][parseInt(xuanzhong_id%9)].shujuchi.length<=0){
                    var ce = x.cell0(parseInt(xuanzhong_id/9),parseInt(xuanzhong_id%9));
                    //console.log(ce);
                      ce.id=e.currentTarget.dataset.id-1;
                      ce.value=e.currentTarget.dataset.id;
                      ce.biaojihong=1;
                      x.gird[parseInt(xuanzhong_id/9)][parseInt(xuanzhong_id%9)].shujuchi.push(ce);
                   bool=true;
            }else{
                  //console.log(x.gird[parseInt(xuanzhong_id/9)][parseInt(xuanzhong_id%9)].shujuchi);
                  for(var k=0;k<x.gird[parseInt(xuanzhong_id/9)][parseInt(xuanzhong_id%9)].shujuchi.length;++k){
                    if(e.currentTarget.dataset.id==
                    x.gird[parseInt(xuanzhong_id/9)][parseInt(xuanzhong_id%9)].shujuchi[k].value){
                      x.gird[parseInt(xuanzhong_id/9)][parseInt(xuanzhong_id%9)].shujuchi.splice(k,1);
                      bool=true;
                      //console.log("123");
                    }
                }
            }

            if(bool==false){
             
                      var ce = x.cell0(parseInt(xuanzhong_id/9),parseInt(xuanzhong_id%9));
                      ce.id=e.currentTarget.dataset.id-1;
                      ce.value=e.currentTarget.dataset.id;
                      ce.biaojihong=1;
                      x.gird[parseInt(xuanzhong_id/9)][parseInt(xuanzhong_id%9)].shujuchi.push(ce);
                
            }
            


            x.checkCell20copy3();

        }
    }
  }
  app.gamedata.jiujiudata=x.gird;
  this.setData({jiulis:app.gamedata.jiujiudata});
},


num9:function(e){
 
  console.log(xuanzhong_id);
  console.log(xuanzhongbool);
  x.checkCell20copy0();//填数全部变为1

  //标记全部变为1
  x.checkCell20copy2();
  //填数
  if(xuanzhongbool==0){
    if(xuanzhong_id!=-1){
      console.log(parseInt(xuanzhong_id/9));
      console.log(parseInt(xuanzhong_id%9));
      if(x.gird[parseInt(xuanzhong_id/9)][parseInt(xuanzhong_id%9)].xuanzhong){
          x.gird[parseInt(xuanzhong_id/9)][parseInt(xuanzhong_id%9)].shujuchi=[];
          x.gird[parseInt(xuanzhong_id/9)][parseInt(xuanzhong_id%9)].cand="";
          x.gird[parseInt(xuanzhong_id/9)][parseInt(xuanzhong_id%9)].value=e.currentTarget.dataset.id;
          
          x.checkCell20copy1();
 
          //有候选数 删除候选数
          x.checkCell20copy5(parseInt(xuanzhong_id/9),parseInt(xuanzhong_id%9),e.currentTarget.dataset.id);
          x.checkCell20copy3();
      }
    }
  }

  //标记
  else if(xuanzhongbool==1){
   
    if(xuanzhong_id!=-1){
        if(x.gird[parseInt(xuanzhong_id/9)][parseInt(xuanzhong_id%9)].xuanzhong){
            x.gird[parseInt(xuanzhong_id/9)][parseInt(xuanzhong_id%9)].value="";

            var bool = false;//判断当前数据池里面有没有当前值
            if(x.gird[parseInt(xuanzhong_id/9)][parseInt(xuanzhong_id%9)].shujuchi.length<=0){
                    var ce = x.cell0(parseInt(xuanzhong_id/9),parseInt(xuanzhong_id%9));
                    //console.log(ce);
                      ce.id=e.currentTarget.dataset.id-1;
                      ce.value=e.currentTarget.dataset.id;
                      ce.biaojihong=1;
                      x.gird[parseInt(xuanzhong_id/9)][parseInt(xuanzhong_id%9)].shujuchi.push(ce);
                   bool=true;
            }else{
                  //console.log(x.gird[parseInt(xuanzhong_id/9)][parseInt(xuanzhong_id%9)].shujuchi);
                  for(var k=0;k<x.gird[parseInt(xuanzhong_id/9)][parseInt(xuanzhong_id%9)].shujuchi.length;++k){
                    if(e.currentTarget.dataset.id==
                    x.gird[parseInt(xuanzhong_id/9)][parseInt(xuanzhong_id%9)].shujuchi[k].value){
                      x.gird[parseInt(xuanzhong_id/9)][parseInt(xuanzhong_id%9)].shujuchi.splice(k,1);
                      bool=true;
                      //console.log("123");
                    }
                }
            }

            if(bool==false){
             
                      var ce = x.cell0(parseInt(xuanzhong_id/9),parseInt(xuanzhong_id%9));
                      ce.id=e.currentTarget.dataset.id-1;
                      ce.value=e.currentTarget.dataset.id;
                      ce.biaojihong=1;
                      x.gird[parseInt(xuanzhong_id/9)][parseInt(xuanzhong_id%9)].shujuchi.push(ce);
                
            }
            


            x.checkCell20copy3();

        }
    }
  }
  app.gamedata.jiujiudata=x.gird;
  this.setData({jiulis:app.gamedata.jiujiudata});
},


//胜利
victory:function(){
  //如果当前是一键查看答案 则不判断当前胜利
  x.answerfunc();
  if(xuanzhongbool==6){

  }else{
    var count=0;
    for(var i=0;i<9;++i){
      for(var j=0;j<9;++j){
        if(x.gird[i][j].value==x.answercopy[i][j].value){
          count++;
        }
      }
    }
  }

  if(count==81){
    console.log("胜利");
      wx.showToast({
      title: '胜利',
      icon: 'success',
      duration: 2000,
      success:function(e){

        app.gamedata.dangqiantimu=null;
        xuanzhongbool=0;

        wx.navigateTo({
          url:'../index',
          
          success:function(){
            console.log("1");
            Selfdetermination=2;
            app.gamedata.indexbutt=0;
          },
          fail:function(){
            console.log("3");
          },
          complete:function(){
            console.log("2");
          }
        })
      }
  })

  }
},




//选择数独框 只能选择一个
//这里还可以修改橡皮擦功能 ——先点击橡皮擦 再点击格子 只能删除候选数和填数  不能删除原生数字
jiugongge:function(e){
  //console.log(e);
  
  for(var i=0;i<9;i++){
    for(var j=0;j<9;++j){
      if(i==parseInt(e.currentTarget.dataset.id/9)&&
      j==parseInt(e.currentTarget.dataset.id%9)){
          
      }else{
        x.gird[i][j].xuanzhong=false;
      }
      
    }
  }

  if(x.gird[parseInt(e.currentTarget.dataset.id/9)][parseInt(e.currentTarget.dataset.id%9)].biaojihong==0){
    x.gird[parseInt(e.currentTarget.dataset.id/9)][parseInt(e.currentTarget.dataset.id%9)].biaojihong=0;
    x.gird[parseInt(e.currentTarget.dataset.id/9)][parseInt(e.currentTarget.dataset.id%9)].xuanzhong=!x.gird[parseInt(e.currentTarget.dataset.id/9)][parseInt(e.currentTarget.dataset.id%9)].xuanzhong;
    xuanzhong_id=-1;
  }else if(x.gird[parseInt(e.currentTarget.dataset.id/9)][parseInt(e.currentTarget.dataset.id%9)].biaojihong==1){
    x.gird[parseInt(e.currentTarget.dataset.id/9)][parseInt(e.currentTarget.dataset.id%9)].biaojihong=1;
    x.gird[parseInt(e.currentTarget.dataset.id/9)][parseInt(e.currentTarget.dataset.id%9)].xuanzhong=!x.gird[parseInt(e.currentTarget.dataset.id/9)][parseInt(e.currentTarget.dataset.id%9)].xuanzhong;
    xuanzhong_id=e.currentTarget.dataset.id;
    
  }else if(x.gird[parseInt(e.currentTarget.dataset.id/9)][parseInt(e.currentTarget.dataset.id%9)].biaojihong==2){
    x.gird[parseInt(e.currentTarget.dataset.id/9)][parseInt(e.currentTarget.dataset.id%9)].biaojihong=2;
    x.gird[parseInt(e.currentTarget.dataset.id/9)][parseInt(e.currentTarget.dataset.id%9)].xuanzhong=!x.gird[parseInt(e.currentTarget.dataset.id/9)][parseInt(e.currentTarget.dataset.id%9)].xuanzhong;
    xuanzhong_id=e.currentTarget.dataset.id;
  }else if(x.gird[parseInt(e.currentTarget.dataset.id/9)][parseInt(e.currentTarget.dataset.id%9)].biaojihong==3){
    x.gird[parseInt(e.currentTarget.dataset.id/9)][parseInt(e.currentTarget.dataset.id%9)].biaojihong=3;
    x.gird[parseInt(e.currentTarget.dataset.id/9)][parseInt(e.currentTarget.dataset.id%9)].xuanzhong=!x.gird[parseInt(e.currentTarget.dataset.id/9)][parseInt(e.currentTarget.dataset.id%9)].xuanzhong;
    xuanzhong_id=e.currentTarget.dataset.id;
  }

 console.log(x.gird[parseInt(e.currentTarget.dataset.id/9)][parseInt(e.currentTarget.dataset.id%9)].biaojihong);
  this.setData({jiulis:app.gamedata.jiujiudata})
  
  


},


caidanvi1:function(e){

  console.log(e)

  if(e.currentTarget.dataset.id==1){//一键计算候选数
    
      x.initCand();
      x.candsfun();
      app.gamedata.jiujiudata = x.gird;
      console.log(x.gird);
      this.setData({jiulis:app.gamedata.jiujiudata})
  }else if(e.currentTarget.dataset.id==2){//一键清除候选数
      for(var i=0;i<9;++i){
        for(var j=0;j<9;++j){
          x.gird[i][j].shujuchi=[];
        }
      }

       app.gamedata.jiujiudata = x.gird;
       this.setData({jiulis:app.gamedata.jiujiudata})
  }else if(e.currentTarget.dataset.id==3){//一键查看答案

       xuanzhongbool=6;
       x.answerfunc();
       console.log(x.answercopy);
       x.gird=JSON.parse(JSON.stringify(x.answercopy));
       app.gamedata.jiujiudata=x.gird;
       this.setData({jiulis:app.gamedata.jiujiudata})
  }else if(e.currentTarget.dataset.id==4){//重置游戏

      x.puzzlefunc();
      var puzzle = x.puzzlecopy;
      for(var i=0;i<9;++i){
        for(var j=0;j<9;++j){
          if(puzzle[i][j].value==0){
            puzzle[i][j].value="";
          }
        }
         
      }

       x.gird=JSON.parse(JSON.stringify(puzzle));
       app.gamedata.jiujiudata=x.gird;
       //计时器
       clearInterval(app.gamedata.timeout);
      app.gamedata.timeout=null;
      app.gamedata.timenum=0;

      app.gamedata.timeout = setInterval(function(){

      app.gamedata.timenum+=1;
      this.setData({jishiqi:"计时器:"+parseInt(app.gamedata.timenum/3600)+":"+
      parseInt(app.gamedata.timenum/60%60)+":"+app.gamedata.timenum%60});

    }.bind(this),1000);

    clearInterval(app.gamedata.victorytime);
    app.gamedata.victorytime=null;
    app.gamedata.victorytime=setInterval(function(){
      this.victory();
    }.bind(this),3000);

       //标记
       xuanzhongbool=0;
       this.setData({jiulis:app.gamedata.jiujiudata})
  }else if(e.currentTarget.dataset.id==5){//分享小程序
       
        wx.showShareMenu({
          withShareTicket:true
        })
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


/**
   * 用户点击右上角分享
   */
 onShareAppMessage: function () {
 
    let url = encodeURIComponent('/packageNews/pages/index/index1/index1?news_id=' + this.data.news_id);
 
    return {
      title: "热点详情",
      path:`/pages/index/index1/index1?url=${url}` 
    }
 
},

  onReady:function(){
    // 页面渲染完成
  },
  onShow:function(){
    // 页面显示
  },
  onHide:function(){
    // 页面隐藏
    console.log("页面隐藏");
    clearInterval(app.gamedata.timeout);
    app.gamedata.timeout=null;

    clearInterval(app.gamedata.victorytime);
    app.gamedata.victorytime=null;
    //console.log(x.gird);
    if(Selfdetermination==0){
       for(var i=0;i<9;++i){
        for(var j=0;j<9;++j){
              x.gird[i][j].xuanzhong=false;
        }
      }
      app.gamedata.dangqiantimu=JSON.parse(JSON.stringify(x.gird));
    }else if(Selfdetermination==1){
      app.gamedata.dangqiantimu=null;
    }else if(Selfdetermination==2){
      app.gamedata.dangqiantimu=null;
      Selfdetermination=0;
    }
   
    
    
  },
  onUnload:function(){
    console.log("页面关闭")
    // 页面关闭
    clearInterval(app.gamedata.timeout);
    app.gamedata.timeout=null;
    //console.log(x.gird);
    if(Selfdetermination==0){
      for(var i=0;i<9;++i){
          for(var j=0;j<9;++j){
              x.gird[i][j].xuanzhong=false;
          }
        }

      app.gamedata.dangqiantimu=JSON.parse(JSON.stringify(x.gird));

    }else if(Selfdetermination==1){
      app.gamedata.dangqiantimu=null;
    }

    clearInterval(app.gamedata.victorytime);
    app.gamedata.victorytime=null;

    
  }


})