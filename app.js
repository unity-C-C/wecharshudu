//app.js
App({
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },

  globalData: {
    userInfo: null,
    wh:0,
    hg:0
  },

  //游戏全局变量



//创建九宫格子格对象
  jiujiudata:function(params) {
    return{
       date:"",//原生数字
       yuanshengdata:false,// 这里指的是开局和玩家确定数字时就出现的数字 默认都false（不是原生)  true(原生) 作用于哪些候选数显示 那些原生数不显示候选数
       xuanzhong:false,//是否是选择状态, false 为不选中  true为选中
       id:0,//代表的id值 这个值不会变化
       idvalue:0,//事件值
       shujuchi:[],//给每个格子创建数据池--数据池对象也是当前类型对象
       biaojihong:false //在标记里需要当前值来做判定
    }
  },


//全局对象
  gamedata:{
    nandu:null,//难度
    jiujiudata:[],//方块集 ---保存新局的和自定义局面  以便于上一局按钮调用
    jiujiudataold:[],//记录上一步的方块集,
    shujuchi:[1,2,3,4,5,6,7,8,9],
    qiujie:[]//求解的计算
  },






//开始核心算法  利用回述法（递归）进行找解  候选数法(唯一候选数、候选数删除）对每一个格子的候选数池的数字进行进一步优化





//创建每个格子的数据池



//map数据更新


//候选法更新数据池



//递归算法找到最优解  ——-顺序是 先找到宫所有候选数 然后找宫唯一候选数  删除宫候选数 再继续找唯一候选数 再删除候选数 。。。。。。直到候选数>0 不能再删 也没有唯一 就开始回述法递归  
//我们按照宫来循环找，不按照行、列来计算

//克隆对象——用于map、数据池对象的克隆 深度克隆 这样不会对视图层的数据产生不可逆的影响


//数据map的数字对行、列、宫的数据进行判定
guize:function(i,j,num,map){//i 行数  j 列数  num 是给map[i][j]的值 map是地图克隆

  var lisi=[];
  lisi.push([i,j]);
  
      //对行判定
      for(var k=0;k<9;++k){
        if(map[i*9+j].date==map[i*9+k].date&&j!=k&&(map[i*9+k].date!=""||map[i*9+k].date!="0")){
         lisi.push([i,k]);
        }
      }

      //列
      for(var k=0;k<9;++k){
        if(map[i*9+j].date==map[k*9+j].date&&k!=i&&(map[k*9+j].date!=""||map[k*9+j].date!="0")){
          lisi.push([k,j]);
        }
      }

     //宫

     for(var k=(parseInt(i/3))*3;k<(parseInt(i/3))*3+3;++k){
       for(var q=(parseInt(j/3))*3;q<(parseInt(j/3))*3+3;++q){
            if(map[i*9+j].date==map[k*9+q].date&&(i!=k||j!=q)&&(map[k*9+q].date!="0"
            ||map[k*9+q].date!="")){
              lisi.push([k,q]);
            }
       }
     }
      

return lisi;    
  
},

//判定是否重复 重复为红
panding0:function(jiujiudatas){

  
  for(var i=0;i<jiujiudatas.length;++i){

    //行
    for(var j=parseInt(i/9)*9;j<parseInt(i/9)*9+9;++j){
      if(i!=j&&jiujiudatas[i].date==jiujiudatas[j].date&&jiujiudatas[i].date!=""){
        jiujiudatas[i].biaojihong=true
        jiujiudatas[j].biaojihong=true
      }else if(i!=j&&jiujiudatas[j].date==""&&jiujiudatas[j].shujuchi.length>0){
        for(var k=0;k<jiujiudatas[j].shujuchi.length;++k){
          if(jiujiudatas[i].date==jiujiudatas[j].shujuchi[k].date){
            jiujiudatas[j].shujuchi.splice(k,1)
          }
        }
      }
    }

    //列
    for(var j=parseInt(i%9);j<=(8-parseInt(i/9))*9+parseInt(i%9);j+=9){
      if(i!=j&&jiujiudatas[i].date==jiujiudatas[j].date&&jiujiudatas[i].date!=""){
        jiujiudatas[i].biaojihong=true
        jiujiudatas[j].biaojihong=true
      }else if(i!=j&&jiujiudatas[j].date==""&&jiujiudatas[j].shujuchi.length>0){
        for(var k=0;k<jiujiudatas[j].shujuchi.length;++k){
          if(jiujiudatas[i].date==jiujiudatas[j].shujuchi[k].date){
            jiujiudatas[j].shujuchi.splice(k,1)
          }
        }
      }
    }

   //宫
   
   for(var j=parseInt(parseInt(i/9)/3)*3;j<parseInt(parseInt(i/9)/3)*3+3;++j){
     for(var k=parseInt(parseInt(i%9)/3)*3;k<parseInt(parseInt(i%9)/3)*3+3;++k){
        if(i!=(j*9+k)&&jiujiudatas[i].date==jiujiudatas[(j*9+k)].date&&jiujiudatas[i].date!=""){
          jiujiudatas[i].biaojihong=true
          jiujiudatas[(j*9+k)].biaojihong=true
        }else if(i!=(j*9+k)&&jiujiudatas[(j*9+k)].date==""&&jiujiudatas[(j*9+k)].shujuchi.length>0){
          for(var k1=0;k1<jiujiudatas[(j*9+k)].shujuchi.length;++k1){
            if(jiujiudatas[i].date==jiujiudatas[(j*9+k)].shujuchi[k1].date){
              jiujiudatas[(j*9+k)].shujuchi.splice(k1,1)
            }
          }
      }
     }
  }
  

  }

},

//标记红候选数 不删
panding1:function(jiujiudatas){
 
  for(var i=0;i<jiujiudatas.length;++i){

    //行
    for(var j=parseInt(i/9)*9;j<parseInt(i/9)*9+9;++j){
      if(i!=j&&jiujiudatas[i].date==jiujiudatas[j].date&&jiujiudatas[i].date!=""){
        jiujiudatas[i].biaojihong=true
        jiujiudatas[j].biaojihong=true
      }else if(i!=j&&jiujiudatas[i].date!=""
      &&jiujiudatas[j].date==""&&jiujiudatas[j].shujuchi.length>0){
        for(var k=0;k<jiujiudatas[j].shujuchi.length;++k){
          if(jiujiudatas[i].date==jiujiudatas[j].shujuchi[k].date){
            jiujiudatas[j].shujuchi[k].biaojihong=true
            jiujiudatas[i].biaojihong=true
          }
        }
      }else if(i!=j&&jiujiudatas[i].date==""&&
      jiujiudatas[i].shujuchi.length>0&&jiujiudatas[j].date!=""){
        for(var k=0;k<jiujiudatas[i].shujuchi.length;++k){
          if(jiujiudatas[i].shujuchi[k].date==jiujiudatas[j].date){
            jiujiudatas[i].shujuchi[k].biaojihong=true
            jiujiudatas[j].biaojihong=true
          }
        }
      }else if(i!=j&&jiujiudatas[i].date==""&&jiujiudatas[i].shujuchi.length>0&&
      jiujiudatas[j].date==""&&jiujiudatas[j].shujuchi.length>0){
        for(var k1=0;k1<jiujiudatas[i].shujuchi.length;++k1){
          for(var j1=0;j1<jiujiudatas[j].shujuchi.length;++j1){
            if(jiujiudatas[i].shujuchi[k1].date==jiujiudatas[j].shujuchi[j1].date){
              jiujiudatas[i].shujuchi[k1].biaojihong=true
              jiujiudatas[j].shujuchi[j1].biaojihong=true
            }
          }
        }
      }



    }

    //列
    for(var j=parseInt(i%9);j<=(8-parseInt(i/9))*9+parseInt(i%9);j+=9){
     if(i!=j&&jiujiudatas[i].date==jiujiudatas[j].date&&jiujiudatas[i].date!=""){
        jiujiudatas[i].biaojihong=true
        jiujiudatas[j].biaojihong=true
      }else if(i!=j&&jiujiudatas[i].date!=""
      &&jiujiudatas[j].date==""&&jiujiudatas[j].shujuchi.length>0){
        for(var k=0;k<jiujiudatas[j].shujuchi.length;++k){
          if(jiujiudatas[i].date==jiujiudatas[j].shujuchi[k].date){
            jiujiudatas[j].shujuchi[k].biaojihong=true
            jiujiudatas[i].biaojihong=true
          }
        }
      }else if(i!=j&&jiujiudatas[i].date==""&&
      jiujiudatas[i].shujuchi.length>0&&jiujiudatas[j].date!=""){
        for(var k=0;k<jiujiudatas[i].shujuchi.length;++k){
          if(jiujiudatas[i].shujuchi[k].date==jiujiudatas[j].date){
            jiujiudatas[i].shujuchi[k].biaojihong=true
            jiujiudatas[j].biaojihong=true
          }
        }
      }else if(i!=j&&jiujiudatas[i].date==""&&jiujiudatas[i].shujuchi.length>0&&
      jiujiudatas[j].date==""&&jiujiudatas[j].shujuchi.length>0){
        for(var k1=0;k1<jiujiudatas[i].shujuchi.length;++k1){
          for(var j1=0;j1<jiujiudatas[j].shujuchi.length;++j1){
            if(jiujiudatas[i].shujuchi[k1].date==jiujiudatas[j].shujuchi[j1].date){
              jiujiudatas[i].shujuchi[k1].biaojihong=true
              jiujiudatas[j].shujuchi[j1].biaojihong=true
            }
          }
        }
      }
    }

   //宫
   
   for(var j=parseInt(parseInt(i/9)/3)*3;j<parseInt(parseInt(i/9)/3)*3+3;++j){
     for(var k=parseInt(parseInt(i%9)/3)*3;k<parseInt(parseInt(i%9)/3)*3+3;++k){
        if(i!=(j*9+k)&&jiujiudatas[i].date==jiujiudatas[(j*9+k)].date&&jiujiudatas[i].date!=""){
          jiujiudatas[i].biaojihong=true
          jiujiudatas[(j*9+k)].biaojihong=true
        }else if(i!=(j*9+k)&&jiujiudatas[i].date!=""&&
        jiujiudatas[(j*9+k)].date==""&&jiujiudatas[(j*9+k)].shujuchi.length>0){
          for(var k1=0;k1<jiujiudatas[(j*9+k)].shujuchi.length;++k1){
            if(jiujiudatas[i].date==jiujiudatas[(j*9+k)].shujuchi[k1].date){
              jiujiudatas[(j*9+k)].shujuchi[k1].biaojihong=true
            }
          }
      }else if(i!=(j*9+k)&&jiujiudatas[i].date==""&&jiujiudatas[i].shujuchi.length>0&&
      jiujiudatas[(j*9+k)].date!=""){
        for(var k1=0;k1<jiujiudatas[i].shujuchi.length;++k1){
          if(jiujiudatas[i].shujuchi[k1].date==jiujiudatas[(j*9+k)].date){
            jiujiudatas[(j*9+k)].biaojihong=true
            jiujiudatas[i].shujuchi[k1].biaojihong=true
          }
        }
      }else if(i!=(j*9+k)&&jiujiudatas[i].date==""&&jiujiudatas[i].shujuchi.length>0&&
      jiujiudatas[(j*9+k)].date==""&&jiujiudatas[(j*9+k)].shujuchi.length>0){
          for(var k2=0;k2<jiujiudatas[i].shujuchi.length;++k2){
            for(var k5=0;k5<jiujiudatas[(j*9+k)].shujuchi.length;++k5){
              if(jiujiudatas[i].shujuchi[k2].date==jiujiudatas[(j*9+k)].shujuchi[k5].date){
                jiujiudatas[i].shujuchi.biaojihong=true
                jiujiudatas[(j*9+k)].shujuchi[k5].biaojihong=true
              }
            }
          }
      }

     }
  }
  

  }
},


//提示
panding2:function(jiujiudatas){
  var jiujius=JSON.parse(JSON.stringify(jiujiudatas))
  var pan1=false
  for(var i=0;i<jiujius.length;++i){
    if(jiujius[i].date==""){
        for(var k=1;k<10;++k){

            //行
            var pan=false
            for(var j=parseInt(i/9)*9;j<parseInt(i/9)*9+9;++j){
              if(jiujius[j].date==k){
                pan=true
                break
              }
            }

            //列
            for(var j=parseInt(i%9);j<=(8-parseInt(i/9))*9+parseInt(i%9);j+=9){
              if(jiujius[j].date==k){
                pan=true
                break
              }
            }


            //宫
            for(var j=parseInt(parseInt(i/9)/3)*3;j<parseInt(parseInt(i/9)/3)*3+3;++j){
                for(var k1=parseInt(parseInt(i%9)/3)*3;k1<parseInt(parseInt(i%9)/3)*3+3;++k1){
                  
                  if(jiujius[(j*9+k1)].date==k){
                    
                    pan=true
                    break
                  }
                }

            }

        if(pan==true){
          //break
        }else{
          jiujius[i].date=k
          console.log("提示")
          console.log(k)
          console.log(i)
          pan1=true
          break
        }

        }

        if(pan1==true){
          break
        }
    }
  }
 
 return jiujius


},

//一键计算候选数
panding3:function(jiujiudatas){
   
 //先清空所有数据池
 for(var i=0;i<jiujiudatas.length;++i){
   if(jiujiudatas[i].shujuchi.length>0){
     jiujiudatas[i].shujuchi=[]
   }
 }

   for(var i=0;i<jiujiudatas.length;++i){

     if(jiujiudatas[i].date==""){

            for(var j=1;j<10;++j){
            if(this.panding4(j,jiujiudatas,i)){

            }else{
                var ii = this.jiujiudata()
                ii.date = j
                ii.id=j-1
                ii.idvalue=j

              jiujiudatas[i].shujuchi.push(ii)
            }

        }
     }
     
   }

  return jiujiudatas
},

//一键清楚候选数
panding5:function(jiujiudatas){
   for(var i=0;i<jiujiudatas.length;++i){
     if(jiujiudatas[i].shujuchi.length>0){
       jiujiudatas[i].shujuchi=[]
     }
   }

   return jiujiudatas
},

//判定给定一个数是否符合规则
panding4:function(num,jiujius,i){

   var pan=false

   //行
    for(var j=parseInt(i/9)*9;j<parseInt(i/9)*9+9;++j){
        if(jiujius[j].date==num){
           pan=true
           return pan
        }
    }

    //列
    for(var j=parseInt(i%9);j<=(8-parseInt(i/9))*9+parseInt(i%9);j+=9){
        if(jiujius[j].date==num){
          pan=true
          return pan
        }
    }

    //宫
    for(var j=parseInt(parseInt(i/9)/3)*3;j<parseInt(parseInt(i/9)/3)*3+3;++j){
           for(var k1=parseInt(parseInt(i%9)/3)*3;k1<parseInt(parseInt(i%9)/3)*3+3;++k1){
                  
            if(jiujius[(j*9+k1)].date==num){
                    
               pan=true
               return pan
            }
        }

    }

    return pan

},

//判断候选数个数 全部都》0 继续 否则 清空当前行、列的所有值
panding5:function(jiujius){
  var panduan=false

    for(var i=0;i<jiujius.length;++i){
      if(jiujius[i].shujuchi.length<=0&&jiujius[i].date==""){
          //清空
          for(var j=(parseInt(i/9))*9;j<(parseInt(i/9))*9+9;++j){
            jiujius[j].date=""
            jiujius[j].shujuchi=[]
          }

          for(var j=(parseInt(i%9));j<(parseInt(i%9))+8*9+1;j+=9){
            jiujius[j].date=""
            jiujius[j].shujuchi=[]
          }
          break
      }else if(i+1==jiujius.length){
        panduan=true
      }
    }

  return panduan
},

//递归调用 随机生成全部完整数独
//先找唯一 确定其值 删除当前行 列 宫 重新找唯一 如果寻找删除过程中是无解 则回到上一步 在当前
panding6:function(jiujius){

      //console.log("开始解")
      //console.log(jiujius)
      //先判断是否无解


      //这个是只找一个数独 不管是不是唯一解
      if(this.gamedata.qiujie.length==1){
        return -1
      }

      for(var i=0;i<jiujius.length;++i){
        if(jiujius[i].date==""&&jiujius[i].shujuchi.length<=0){
          //console.log("无解-1")
            return -1
        }
      }

      //找唯一数独
      for(var i=0;i<jiujius.length;++i){
        if(jiujius[i].shujuchi.length==1){
            var copyjiujius = JSON.parse(JSON.stringify(jiujius))
            copyjiujius[i].date=copyjiujius[i].shujuchi[0].date
            copyjiujius[i].shujuchi=[]

            copyjiujius=this.panding3(copyjiujius)
            if(this.panding6(copyjiujius)==-1){
              return -1
            }

        }
      }

      //没有唯一数独 也没有无解 存在多解
      for(var i=0;i<jiujius.length;++i){
         if(jiujius[i].shujuchi.length>1){
           //var pp1=false

            for(var j=0;j<jiujius[i].shujuchi.length;++j){

              var copyjiujius = JSON.parse(JSON.stringify(jiujius))
              copyjiujius[i].date=copyjiujius[i].shujuchi[j].date
              copyjiujius[i].shujuchi=[]

              copyjiujius=this.panding3(copyjiujius)
              if(this.panding6(copyjiujius)==-1){
                 //console.log("多解 0")
                 //pp1=true
                 continue //这里不能用return 
              }

            }
            /*
            if(pp1){
              return -1
            }*/
            return -1


         }

      }

//push求解的值 并返回0
    //console.log(jiujius);
    this.gamedata.qiujie.push(JSON.parse(JSON.stringify(jiujius)));
    return -1;
},


//递归调用 挖洞计算
//先找唯一 确定其值 删除当前行 列 宫 重新找唯一 如果寻找删除过程中是无解 则回到上一步 在当前
panding7:function(jiujius){

     
      //这个是找解 判断是不是唯一还是==2 多余的不找了 浪费效率
      if(this.gamedata.qiujie.length==2){
        return -1
      }

      for(var i=0;i<jiujius.length;++i){
        if(jiujius[i].date==""&&jiujius[i].shujuchi.length<=0){
          //console.log("无解-1")
            return -1
        }
      }

      //找唯一数独
      for(var i=0;i<jiujius.length;++i){
        if(jiujius[i].shujuchi.length==1){
            var copyjiujius = JSON.parse(JSON.stringify(jiujius))
            copyjiujius[i].date=copyjiujius[i].shujuchi[0].date
            copyjiujius[i].shujuchi=[]

            copyjiujius=this.panding3(copyjiujius)
            if(this.panding6(copyjiujius)==-1){
              return -1
            }

        }
      }

      //没有唯一数独 也没有无解 存在多解
      for(var i=0;i<jiujius.length;++i){
         if(jiujius[i].shujuchi.length>1){
           //var pp1=false

            for(var j=0;j<jiujius[i].shujuchi.length;++j){

              var copyjiujius = JSON.parse(JSON.stringify(jiujius))
              copyjiujius[i].date=copyjiujius[i].shujuchi[j].date
              copyjiujius[i].shujuchi=[]

              copyjiujius=this.panding3(copyjiujius)
              if(this.panding6(copyjiujius)==-1){
                 //console.log("多解 0")
                 //pp1=true
                 continue //这里不能用return 
              }

            }
            /*
            if(pp1){
              return -1
            }*/
            return -1


         }

      }

//push求解的值 并返回0
    //console.log(jiujius);
    this.gamedata.qiujie.push(JSON.parse(JSON.stringify(jiujius)));
    return -1;
},


//map数据显示到界面上
draw:function(jiujiudatass){
  //console.log(jiujiudatass.size);
  for(var i=0;i<jiujiudatass.length;++i){
    if(jiujiudatass[i].date!=""){
      //jiujiudatass[i].date=map[parseInt(i/9)][parseInt(i%9)];
      jiujiudatass[i].yuanshengdata=true;
     /* for(var j=1;j<10;++j){
        if(j!=map[parseInt(i/9)][parseInt(i%9)]){
          jiujiudatass[i].shujuchi.push(j);
        }
        
      }*/
    }
    else{
        jiujiudatass[i].date="";
    }
      
    //console.log(jiujiudatass[i].date);
  }

},

//创建地图map ---先测试有没有解
createmap:function(jiujius,nandu){//通过难度来选择地图数据的个数。
  
  var nan =0;
  //初始化
  for(var i=0;i<81;++i){
    jiujius[i].date=""
  }

//随机赋值
    for(var i=0;i<9;++i){
      for(var j=0;j<9;++j){
          nan=parseInt(Math.random()*50);//0-49
          if(nan>nandu){
           jiujius[i*9+j].date=parseInt(Math.random()*9+1);
            if(this.guize(i,j,jiujius[i*9+j],jiujius).length>1){
             jiujius[i*9+j].date="";
            }
          }

      }
    }

    //这里是确保生成的数独有解
    //先计算候选数 判断候选数所有的个数是否都》0 是则继续 否 清空行 列的所有数据 重新计算候选数
    
    while(true){
      jiujius = this.panding3(jiujius)

      if(this.panding5(jiujius)){
        break
      }

    }

    //测试有没有唯一解 这里测试生成的数独有唯一解 将唯一解报存 这样在游戏中不需要再次计算唯一解了
    //先测试解 判断解是不是唯一解 是 填入一些唯一解。否则 是无解挖、多解 挖 直到挖的个数达到指定的格式 重置数独

    var jiujiuscopy=JSON.parse(JSON.stringify(jiujius)) //深度拷贝
   
   //递归调用
   while(true){

     this.panding6(jiujiuscopy);

     if(this.gamedata.qiujie.length<=0){
       //无解

       
      this.gamedata.qiujie=[];

        var nan =0;
        //初始化
        for(var i=0;i<81;++i){
          jiujius[i].date=""
        }

      //随机赋值
          for(var i=0;i<9;++i){
            for(var j=0;j<9;++j){
                nan=parseInt(Math.random()*50);//0-49
                if(nan>nandu){
                jiujius[i*9+j].date=parseInt(Math.random()*9+1);
                  if(this.guize(i,j,jiujius[i*9+j],jiujius).length>1){
                  jiujius[i*9+j].date="";
                  }
                }

            }
          }

          //这里是确保生成的数独有解
          //先计算候选数 判断候选数所有的个数是否都》0 是则继续 否 清空行 列的所有数据 重新计算候选数
          
          while(true){
            jiujius = this.panding3(jiujius)

            if(this.panding5(jiujius)){
              break
            }

          }

          //测试有没有唯一解 这里测试生成的数独有唯一解 将唯一解报存 这样在游戏中不需要再次计算唯一解了
          //先测试解 判断解是不是唯一解 是 进行挖空算法  否则 是无解重置；多解 默认找第一个生成数独 进行挖动 //后面是之前的想法 效率不高——按照其中一种答案的数独值开始加 直到解唯一

        jiujiuscopy=JSON.parse(JSON.stringify(jiujius)) //深度拷贝
        

        //console.log("无解")
        
     }else if(this.gamedata.qiujie.length==1){//唯一解
       console.log("唯一解")
       console.log(this.gamedata.qiujie)
       jiujius=this.gamedata.qiujie[0]
       break;
     }else if(this.gamedata.qiujie.length>1){//多解
        //默认按照第一个解开始加
        /*
        console.log("多解答案:")
        console.log(this.gamedata.qiujie)*/
        jiujius=this.gamedata.qiujie[0]
        break;

        
     }


   }
   

    //test
    /*
    console.log("test");
    for(var i=0;i<9;++i){
      for(var j=0;j<9;++j){
        console.log(map[i][j]);
      }
    }
    */

    
  //赋值给jiujiudata
  this.gamedata.jiujiudata=jiujius;
},

mapcreatejieda(map){

},

})