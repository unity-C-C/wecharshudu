function Sudoku() {
    this.gird = [];    //存当前盘面
    this.puzzle = [];    //存初盘内容，重置用
    this.answer = [];  //存终盘答案
    this.answercopy=[];
    this.puzzlecopy=[];
    this.hasMultipleAnswer = false;
    this.degree = 0;            //自定义-多解
    //每个小单元格的属性
    function cell(r, c) {
        this.row = r;
        this.col = c;
        this.id = r * 9 + c;
        this.box = parseInt(r / 3) * 3 + parseInt(c / 3);
        this.rStart = parseInt(r / 3) * 3;
        this.cStart = parseInt(c / 3) * 3;
        this.value = 0; //单元格值
        this.cand = '';//用于存储候选数，默认为空，用字符串储存，方便计算
        this.lock = false;//非锁定格
        this.hasDig = false;
        this.biaojihong=0;
        this.xuanzhong=false;
        this.shujuchi=[];//list数组结构
    }
    //初始化当前用于计算的盘面gird，存初盘的puzzle，存答案的answer
    for (let r = 0; r < 9; r++) {
        this.gird[r] = [];
        this.puzzle[r] = [];
        this.answer[r] = [];
        for (let c = 0; c < 9; c++) {
            this.gird[r][c] = new cell(r, c);
            this.gird[r][c].value = 0;
            this.puzzle[r][c] = 0;
            this.answer[r][c] = 0;
        }
    }
}

function cell(r,c) {
        this.row = r;
        this.col = c;
        this.id = r * 9 + c;
        this.box = parseInt(r / 3) * 3 + parseInt(c / 3);
        this.rStart = parseInt(r / 3) * 3;
        this.cStart = parseInt(c / 3) * 3;
        this.value = 0; //单元格值
        this.cand = '';//用于存储候选数，默认为空，用字符串储存，方便计算
        this.lock = false;//非锁定格
        this.hasDig = false;
        this.biaojihong=0;
        this.xuanzhong=false;
        this.shujuchi=[];//list数组结构
    }

Sudoku.prototype = {
    //将当前生成的初盘单元格变为锁定状态
    cellLock: function () {
        for (let r = 0; r < 9; r++) {
            for (let c = 0; c < 9; c++) {
                if (this.puzzle[r][c] != 0)
                    this.gird[r][c].lock = true;
            }
        }
    },

    // 初始化数独
    initSudoku: function (type) {
        var reg = /^[\d]+$/;
        if (typeof (type) === 'number') {
            switch (type) {
                case 0:
                    console.log('创建数独空盘-自定义模式！');
                    break;
                case 1:
                    console.log('创建数独初盘-入门！');
                    this.generateAnswerGird();
                    this.generatePuzzle(1);
                    break;
                case 2:
                    console.log('创建数独初盘-普通！');
                    this.generateAnswerGird();
                    this.generatePuzzle(2);
                    break;
                case 3:
                    console.log('创建数独初盘-困难！');
                    this.generateAnswerGird();
                    this.generatePuzzle(3);
                    break;
                case 4:
                    console.log('创建数独初盘-专家！');
                    this.generateAnswerGird();
                    this.generatePuzzle(4);
                    break;
                case 5:
                    console.log('创建数独初盘-大师！');
                    this.generateAnswerGird();
                    this.generatePuzzle(5);
                    break;
                default:
                    console.log('难度等级输入错误！');
                    return false;
            }
        }
        //写来检验解题算法的，模拟自定义输入数独
        if (typeof (type) === 'string' && type.length == 81 && reg.test(type)) {
            var datas = type.split('');
            for (let r = 0; r < 9; r++) {
                for (let c = 0; c < 9; c++) {
                    this.gird[r][c].value = parseInt(datas[r * 9 + c]);
                }
            }
            if (!this.initUserDefined()) return false;
        }
        return true;
    },
    initUserDefined1:function(){
        if (!this.isRight()) {
            console.log('错误！有数字重复！请重新填入！')
            return '错误！有数\r\n字重复！请\r\n重新填入！';
        }
        var n = this.blankCount();
        if (n > 64) {
            console.log('填入数字小于17，必定多解！请重新填入！')
            return '填入数字小\r\n于17，必\r\n定多解！请\r\n重新填入！';
        }
        if (n == 0) {
            console.log('该数独已为合格终盘！')
            return '该数独已为\r\n合格终盘！';
        }
        if (!this.initCand()) {
            this.emptyCand();       //对于无解数独，置空候选数列表恢复初始状态
            console.log('不合格数独，无解!请重新填入！')
            return '不合格数独\r\n，无解!请\r\n重新填入！';
        }
        this.savePuzzle();           //成功生成候选数列表，可能有解，先存入puzzle
        if (!this.hasAnswer()) {
            this.emptyCand();         //无解，盘面和候选数都会恢复为初始化
            console.log('不合格数独，无解!请重新填入！')
            return '不合格数独\r\n，无解!请重\r\n新填入！';
        }
        this.saveAnswerGird();          //有解，先存入answer
        this.resetPuzzle();           //将当前盘面恢复为存入的puzzle
        if (this.hasOnlyAnswer()) {   //判断是否只有一个解，如果只有一个解，递归第二个解时会将当前盘面与候选数恢复为最初的样子
            this.emptyCand();
            this.resetPuzzle();
            console.log('标准数独，只有一个解');
            console.log('创建自定义数独谜题！');
            return "标准数独，\r\n只有一个解";
        }
        else {                        //至少两个解，递归结束时盘面为解完后，所以又需要重置
            this.resetPuzzle();
            console.log('该数独有多个解！');
            console.log('创建自定义数独谜题！');
            return "该数独多个解！\r\n创建自定义\r\n数独谜题！"
        }
        //return '创建自定义\r\n数独谜题！';
    },
    initUserDefined: function () {
        if (!this.isRight()) {
            console.log('错误！有数字重复！请重新填入！')
            return false;
        }
       
        var n = this.blankCount();
        if (n > 64) {
            console.log('填入数字小于17，必定多解！请重新填入！')
            return false;
        }
        
        if (n == 0) {
            console.log('该数独已为合格终盘！')
            return false;
        }
        
        if (!this.initCand()) {
            this.emptyCand();       //对于无解数独，置空候选数列表恢复初始状态
            console.log('不合格数独，无解!请重新填入！')
            return false;
        }
        
        this.savePuzzle();           //成功生成候选数列表，可能有解，先存入puzzle
        if (!this.hasAnswer()) {
            this.emptyCand();         //无解，盘面和候选数都会恢复为初始化
            console.log('不合格数独，无解!请重新填入！')
            return false;
        }
        
        this.saveAnswerGird();          //有解，先存入answer
        this.resetPuzzle();           //将当前盘面恢复为存入的puzzle
        console.log(JSON.parse(JSON.stringify(this.gird)));
        if (this.hasOnlyAnswer()) {   //判断是否只有一个解，如果只有一个解，递归第二个解时会将当前盘面与候选数恢复为最初的样子
            this.emptyCand();
            this.resetPuzzle();
            console.log('标准数独，只有一个解');
            console.log('创建自定义数独谜题！');
             console.log(JSON.parse(JSON.stringify(this.gird)));
            return true;
        }
        else {                        //至少两个解，递归结束时盘面为解完后，所以又需要重置
            this.resetPuzzle();
            console.log('该数独有多个解！');
            console.log('创建自定义数独谜题！');
             console.log(JSON.parse(JSON.stringify(this.gird)));
            return false;
        }
       
        
    },

    //该部分为检验部分
    //检验当前数独是否符合规则，每行、列和宫每个数字只能出现一次，检验自定义数独时使用
    isRight: function () {
        let rows = {};
        let columns = {};
        let boxes = {};
        // 遍历数独
        for (let r = 0; r < 9; r++) {
            for (let c = 0; c < 9; c++) {
                let num = this.gird[r][c].value;
                if (num != 0) {
                    // 子数独序号
                    let boxIndex = this.gird[r][c].box;
                    if (rows[r + '-' + num] || columns[c + '-' + num] || boxes[boxIndex + '-' + num]) {
                        return false;
                    }
                    // 以各自方向 + 不能出现重复的数字 组成唯一键值，若出现第二次，即为重复
                    rows[r + '-' + num] = true;
                    columns[c + '-' + num] = true;
                    boxes[boxIndex + '-' + num] = true;
                }
            }
        }
        return true;
    },

    //遍历此格相关20格是否已填写此数,判断某数填入后是否正确
    //主要用来计算候选数列表，遇到错的就直接返回false
    //判断错误标记颜色最好再写一个类似的，把return false改掉
    checkCell20: function (r, c, num) {
        for (let i = 0; i < 9; i++) {
            if (this.gird[r][i].value == num) return false;
            if (this.gird[i][c].value == num) return false;
        }
        for (let rBox = this.gird[r][c].rStart; rBox < this.gird[r][c].rStart + 3; rBox++) {
            for (let cBox = this.gird[r][c].cStart; cBox < this.gird[r][c].cStart + 3; cBox++) {
                if (rBox != r && cBox != c) {
                    if (this.gird[rBox][cBox].value == num) return false;
                }
            }
        }
        return true;
    },


    //该部分为候选数计算部分
    //将当前未填格置空并重新生成候选数列表
    initCand: function () {
        var hasNoCand = true;    //默认没有空候选数的格子
        for (let r = 0; r < 9; r++) {
            for (let c = 0; c < 9; c++) {
                if (this.gird[r][c].value != 0)
                    continue;
                this.gird[r][c].cand = '';
                for (let n = 1; n <= 9; n++) {
                    if (this.checkCell20(r, c, n)) {
                        this.gird[r][c].cand += n;
                    }
                }
                if (this.gird[r][c].cand == '' || this.gird[r][c].cand.length == 0) {
                    /* console.log('候选数列表建立失败，当前数独无解！'); */
                    hasNoCand = false;     //有空候选数的格子，值改为false
                }
            }
        }
        /*         console.log('成功建立候选数列表！') */
        return hasNoCand;
    },

    //清空当前候选数列表，生成一个符合要求的数独后，应当清空其生成时计算填写的候选数
    emptyCand: function () {
        for (let r = 0; r < 9; r++) {
            for (let c = 0; c < 9; c++) {
                this.gird[r][c].cand = '';
            }
        }
    },

    //用于生成数独时的侯选数解题检验，填写某数后删除相关20格与此数相同候选数，不包括它自身
    //应该也可用于游戏界面填写某数字时，删除其相关20格与此数相同候选数
    deleteCand: function (r, c) {
        var hasCand = true;
        var num = this.gird[r][c].value;
        for (let i = 0; i < 9; i++) {
            if (this.gird[r][i].value == 0 && this.gird[r][i].cand.length > 0 && this.gird[r][i].cand.match(num)) {
                this.gird[r][i].cand = this.gird[r][i].cand.replace(num, '');
                /*                 console.log('r' + r + 'c' + i + '删除候选数：' + num); */
                if (this.gird[r][i].cand.length == 0) {
                    /*                     console.log('r' + r + 'c' + i + '删除候选数后成为无解格！'); */
                    hasCand = false;
                }
            }
            if (this.gird[i][c].value == 0 && this.gird[i][c].cand.length > 0 && this.gird[i][c].cand.match(num)) {
                this.gird[i][c].cand = this.gird[i][c].cand.replace(num, '');
                /*                 console.log('r' + i + 'c' + c + '删除候选数：' + num); */
                if (this.gird[i][c].cand.length == 0) {
                    /*  console.log('r' + i + 'c' + c + '删除候选数后成为无解格！'); */
                    hasCand = false;
                }
            }
        }
        for (let rBox = this.gird[r][c].rStart; rBox < this.gird[r][c].rStart + 3; rBox++) {
            for (let cBox = this.gird[r][c].cStart; cBox < this.gird[r][c].cStart + 3; cBox++) {
                if (rBox != r && cBox != c) {
                    if (this.gird[rBox][cBox].value == 0 && this.gird[rBox][cBox].cand.length > 0 && this.gird[rBox][cBox].cand.match(num)) {
                        this.gird[rBox][cBox].cand = this.gird[rBox][cBox].cand.replace(num, '');
                        /*             console.log('r' + rBox + 'c' + cBox + '删除候选数：' + num); */
                        if (this.gird[rBox][cBox].cand.length == 0) {
                            /*  console.log('r' + rBox + 'c' + cBox + '删除候选数后成为无解格！'); */
                            hasCand = false;
                        }
                    }
                }
            }
        }
        return hasCand;
    },

    //用于回溯时恢复某格恢复其相关20格候选数，不包括它自身，使用此法后，候选数排列顺序会发生一定变化
    //该方法与界面无关
    recoverCand: function (r, c, num) {
        for (let i = 0; i < 9; i++) {
            if (i != c && this.gird[r][i].value == 0) {
                if (this.checkCell20(r, i, num)) {
                    this.gird[r][i].cand += num;
                    /*                     console.log('r' + r + 'c' + i + '添加候选数：' + num); */
                }
            }
            if (i != r && this.gird[i][c].value == 0) {
                if (this.checkCell20(i, c, num)) {
                    this.gird[i][c].cand += num;
                    /*                     console.log('r' + i + 'c' + c + '添加候选数：' + num); */
                }
            }
        }
        for (let rBox = this.gird[r][c].rStart; rBox < this.gird[r][c].rStart + 3; rBox++) {
            for (let cBox = this.gird[r][c].cStart; cBox < this.gird[r][c].cStart + 3; cBox++) {
                if (rBox != r && cBox != c) {
                    if (this.gird[rBox][cBox].value == 0) {
                        if (this.checkCell20(rBox, cBox, num)) {
                            this.gird[rBox][cBox].cand += num;
                            /*                             console.log('r' + rBox + 'c' + cBox + '添加候选数：' + num); */
                        }
                    }
                }
            }
        }
    },

    //求解某格的候选数，用于挖洞时计算挖去的某格的候选数
    cellCand: function (r, c) {
        this.gird[r][c].cand = '';
        for (let n = 1; n <= 9; n++) {
            if (this.checkCell20(r, c, n)) {
                this.gird[r][c].cand += n;
            }
        }
    },


    //该部分为求解算法中找下一个填数的方法
    //寻找下一个候选数最少的格
    nextMinCandCell: function () {
        var minCandNum = 10;
        var id = 81;
        for (let r = 0; r < 9; r++) {
            for (let c = 0; c < 9; c++) {
                if (this.gird[r][c].value == 0 && this.gird[r][c].cand.length < minCandNum) {
                    id = this.gird[r][c].id;
                    minCandNum = this.gird[r][c].cand.length;
                    if (minCandNum == 0) {
                        console.log('出错了！')
                    }
                    if (minCandNum == 1) {
                        return id;
                    }
                }
            }
        }
        return id;
    },

    //寻找下一个随机的未填格
    nextRandBlankCell: function () {
        var id = 81;
        var blankCellId = [];
        for (let r = 0; r < 9; r++) {
            for (let c = 0; c < 9; c++) {
                if (this.gird[r][c].value == 0) {
                    if (this.gird[r][c].cand.length == 1) {
                        return this.gird[r][c].id;
                    }
                    blankCellId.push(this.gird[r][c].id);
                }
            }
        }
        if (blankCellId.length == 1) {
            id = blankCellId[0];
        }
        if (blankCellId.length > 1) {
            var rand = Math.floor(Math.random() * blankCellId.length);
            id = blankCellId[rand];
        }
        return id;
    },

    //按顺序寻找下一个未填的单元格
    nextOrderBlankCell: function () {
        var id = 81;
        for (let r = 0; r < 9; r++) {
            for (let c = 0; c < 9; c++) {
                if (this.gird[r][c].value == 0) {
                    id = this.gird[r][c].id
                    return id;
                }
            }
        }
        return id;
    },


    //该部分为数独求解算法
    //求解使用候选数，求解过程中只需考虑对相关20格候选数的删除和恢复，无需检验
    //使用递归深度搜索，当解的数量达到填入的maxCount时，返回true，退出递归
    //maxCount为1时可验证是否有解，为2时可验证是否多解
    solveGirdCandNum: function (r, c, count, maxCount, method) {                  //r,c是第一个选的格子，method是找格子的方式
        for (let i = 0; i < this.gird[r][c].cand.length; i++) {
            this.gird[r][c].value = parseInt(this.gird[r][c].cand.charAt(i));    //取该格候选数试填
            /*             console.log('r' + r + 'c' + c + '试填：' + this.gird[r][c].value);
                        this.printfResult(); */
            if (!this.deleteCand(r, c)) {                                        //删除相关20格候选数出现空候选数格
                let num = this.gird[r][c].value;                                 //恢复相关20格候选数
                this.gird[r][c].value = 0;
                /*                 console.log('r' + r + 'c' + c + '清空'); */
                this.recoverCand(r, c, num);
                continue;                                                        //直接试下一个候选数，没有下一个候选数就退出循环
            }
            switch (method) {
                case 1: var next = this.nextMinCandCell(); break;                 //找最少候选数的格子
                case 2: var next = this.nextRandBlankCell(); break;               //找随机空格子，有点慢
                case 3: var next = this.nextOrderBlankCell(); break;              //按顺序找格子，备用
                default: var next = this.nextMinCandCell(); console.log("输入错误，使用第一种");  //以免出错
            }
            if (next == 81) {                                                     //找不到下一个空格子，说明当前盘面已填满
                count++;
                /*             console.log('第' + count + '个解为：');
                            printfResult(this.gird); */
                if (count == maxCount) {
                    this.emptyCand();               //清空所有格子的候选数，因为为了恢复方便没有将试填格子的
                    return true;                    //已达到要求解数目             
                }
                else {
                    return false;                  //没达到要求数量解，继续 */
                }
            }
            let nextR = parseInt(next / 9);
            let nextC = next % 9;
            if (this.solveGirdCandNum(nextR, nextC, count, maxCount, method)) {      //递归
                return true;
            }
            let num = this.gird[r][c].value;                               //上一次递归失败，当前格值置为0，并恢复其相关20格候选数
            this.gird[r][c].value = 0;
            this.recoverCand(r, c, num);
        }
        return false;                                                      //尝试完所以候选数未找到解，返回false，回溯上一格或直接返回无解
    },

    //求解时调用的方法，可以进入递归
    //此方法在能找到输入的maxCount数量的解时返回true，达不到maxCount返回false
    findAnswer: function (maxCount, method) {               //method：找下个格子的方法
        this.initCand();
        switch (method) {
            case 1: var next = this.nextMinCandCell(); break;
            case 2: var next = this.nextRandBlankCell(); break;
            case 3: var next = this.nextOrderBlankCell(); break;
            default: var next = this.nextRandBlankCell(); console.log("输入错误，使用随机");
        }
        if (next == 81) {                //find之前会进行满格检验才对，这个不应该出现，但是满格也算有一种解
            if (maxCount == 1) return true;
            else return false;
        }
        var nextR = parseInt(next / 9);
        var nextC = next % 9;
        if (this.solveGirdCandNum(nextR, nextC, 0, maxCount, method)) {  //进入递归求解
            return true;
        }
        return false;
    },

    //此法用于检验当前盘面的数独是否有解
    hasAnswer: function () {
        if (this.findAnswer(1, 1)) {
            return true;
        }
        return false;
    },

    //此法用于检验当前盘面的数独是否是唯一解
    hasOnlyAnswer: function () {
        if (this.findAnswer(2, 1)) {
            return false;
        }
        return true;
    },


    //此部分为存终盘、初盘，以及重置当前盘面
    //将当前解出的终盘存入answer
    saveAnswerGird: function () {
        for (let r = 0; r < 9; r++) {
            for (let c = 0; c < 9; c++) {
                this.answer[r][c] = this.gird[r][c].value;
            }
        }
    },
    //查看答案盘
    setAnswerGird: function () {
        for (let r = 0; r < 9; r++) {
            for (let c = 0; c < 9; c++) {
                this.gird[r][c].value = this.answer[r][c];
            }
        }
    },
    //存初盘，重置用
    savePuzzle: function () {
        for (let r = 0; r < 9; r++) {
            for (let c = 0; c < 9; c++) {
                this.puzzle[r][c] = this.gird[r][c].value;
            }
        }
    },
    //重置当前盘面为初盘
    resetPuzzle: function () {
        for (let r = 0; r < 9; r++) {
            for (let c = 0; c < 9; c++) {
                this.gird[r][c].value = this.puzzle[r][c];
            }
        }
    },



    //此部分为数独生成算法
    //首先是终盘生成算法部分
    //先用1~9随机填满0，4，8三宫，因为为对角线三宫，行列之间互不影响，可以不用检查直接填入
    //填完后有初始化候选数列表，以便求解终盘
    initAnswerDiagonal: function () {
        function shuffle() {
            var num = [1, 2, 3, 4, 5, 6, 7, 8, 9];
            for (let i = 0; i < 8; i++) {
                let index = parseInt(Math.random() * (9 - i));
                let temp = num[index];
                num[index] = num[8 - i];
                num[8 - i] = temp;
            }
            return num;
        }
        for (let i = 0; i < 3; i++) {
            var n = 0;
            let num = shuffle();
            //console.log(num);
            for (let r = i * 3; r < i * 3 + 3; r++)
                for (let c = i * 3; c < i * 3 + 3; c++) {
                    //console.log(this.gird);
                    this.gird[r][c].value = num[n];
                    this.gird[r][c].cand = '';
                    n++;
                }
        }
        this.initCand();
    },

    //生成终盘，调用数独求解算法
    //将生成的终盘存入answeer，puzzle
    generateAnswerGird: function () {
        this.initAnswerDiagonal();
        this.findAnswer(1, 1);
        /*         this.printfResult(); */
        for (let r = 0; r < 9; r++) {
            for (let c = 0; c < 9; c++) {
                this.answer[r][c] = this.gird[r][c].value;
                this.puzzle[r][c] = this.gird[r][c].value;
            }
        }
    },

    //其次是初盘生成部分
    //这部分是选取不同的挖洞顺序，以影响难度，以及对生成的初盘进行难度检验
    generatePuzzle: function (degree) {
        var flag = true;
        var success = false;
        switch (degree) {
            case 1:
                while (!success) {
                    var randUseCount = 0;
                    while (flag) {
                        var digId = this.nextRandNoDigCell();
                        if (digId == 81 || randUseCount == 22) {
                            break;
                        }
                        if (digId != 40) {
                            this.digHole(digId);
                            this.digHole(80 - digId);
                        }
                        else this.digHole(digId);
                        randUseCount++;
                    }
                    if (this.degreeCheck() == 1) {
                        success = true;
                        break;
                    }
                    this.recoverDigState();
                }
                this.resetPuzzle();
                this.printfResult();
                break;
            case 2:
                while (!success) {
                    var randUseCount = 0;
                    while (flag) {
                        var digId = this.nextRandNoDigCell();
                        if (digId == 81 || randUseCount == 30) {
                            break;
                        }
                        if (digId != 40) {
                            this.digHole(digId);
                            this.digHole(80 - digId);
                        }
                        else this.digHole(digId);
                        randUseCount++;
                    }
                    if (this.degreeCheck() == 2) {
                        success = true;
                        break;
                    }
                    this.recoverDigState();
                }
                this.resetPuzzle();
                this.printfResult();
                break;
            case 3:
                while (!success) {
                    var randUseCount = 0;
                    while (flag) {
                        var digId = this.nextRandNoDigCell();
                        if (digId == 81 || randUseCount == 35) {
                            break;
                        }
                        if (digId != 40) {
                            this.digHole(digId);
                            this.digHole(80 - digId);
                        }
                        else this.digHole(digId);
                        randUseCount++;
                    }
                    if (this.degreeCheck() == 3) {
                        success = true;
                        break;
                    }
                    this.recoverDigState();
                }
                this.resetPuzzle();
                this.printfResult();
                break;
            case 4:
                while (!success) {
                    var randUseCount = 0;
                    while (flag) {
                        var digId = this.nextRandNoDigCell();
                        if (digId == 81 || randUseCount == 30) {
                            break;
                        }
                        if (digId != 40) {
                            this.digHole(digId);
                            this.digHole(80 - digId);
                        }
                        else this.digHole(digId);
                        randUseCount++;
                    }
                    while (flag) {
                        var digId = this.nextOneIntervalNoDigCell();
                        if (digId == 81) {
                            break;
                        }
                        this.digHole(digId);
                    }
                    while (flag) {
                        var digId = this.nextNoDigCell();
                        if (digId == 81) {
                            break;
                        }
                        if (digId != 40) {
                            this.digHole(digId);
                            this.digHole(80 - digId);
                        }
                        else this.digHole(digId);
                    }
                    if (this.degreeCheck() == 4) {
                        success = true;
                        break;
                    }
                    this.recoverDigState();
                }
                this.resetPuzzle();
                this.emptyCand();
                this.printfResult();
                break;
        }
    },

    //此部分为寻找下一个未尝试过挖洞格子的方法
    //随机
    nextRandNoDigCell: function () {
        var id = 81;
        var noDigCellId = [];
        for (let r = 0; r < 9; r++) {
            for (let c = 0; c < 9; c++) {
                if (this.gird[r][c].hasDig == false) {
                    noDigCellId.push(this.gird[r][c].id);
                }
            }
        }
        if (noDigCellId.length == 1) {
            id = noDigCellId[0];
            /*             console.log('当前最后一个可挖格') */
        }
        if (noDigCellId.length > 1) {
            var rand = Math.floor(Math.random() * noDigCellId.length);
            id = noDigCellId[rand];
        }
        return id;
    },
    //按顺序
    nextNoDigCell: function () {
        var id = 81;
        for (let r = 0; r < 9; r++) {
            for (let c = 0; c < 9; c++) {
                if (this.gird[r][c].hasDig == false) {
                    id = r * 9 + c;
                    return id;
                }
            }
        }
        return id;
    },
    //间隔一个
    nextOneIntervalNoDigCell: function () {
        var id = 81;
        for (let r = 0; r < 9; r++) {
            for (let c = (r + 1) % 2; c < 9; c += 2) {
                if (this.gird[r][c].hasDig == false) {
                    id = r * 9 + c;
                    return id;
                }
            }
        }
        return id;
    },

    recoverDigState: function () {
        for (let r = 0; r < 9; r++) {
            for (let c = 0; c < 9; c++) {
                this.gird[r][c].hasDig = false;
                this.gird[r][c].cand = '';
                this.gird[r][c].value = this.answer[r][c];
                this.puzzle[r][c] = this.answer[r][c];
            }
        }
    },

    //挖洞，并进行检验，检验挖去后不会多解才挖去，否则恢复，并将已挖过的格子的hasDig置为true
    digHole: function (digId) {
        var r = parseInt(digId / 9);
        var c = digId % 9;
        if (this.digHoleCheck(r, c)) {
            this.puzzle[r][c] = 0;
        }
        this.gird[r][c].hasDig = true;
    },

    //某格挖去后是否多解的检验
    digHoleCheck: function (r, c) {
        /*    console.log('挖洞：r' + r + 'c' + c); */
        var num = this.gird[r][c].value;
        this.gird[r][c].value = 0;
        this.cellCand(r, c);
        this.recoverCand(r, c, num)
        /*         this.printfResult(); */
        this.gird[r][c].cand = this.gird[r][c].cand.replace(num, '');
        /*         console.log(this.gird[r][c].cand.length); */
        for (let i = 0; i < this.gird[r][c].cand.length; i++) {
            this.gird[r][c].value = parseInt(this.gird[r][c].cand.charAt(i));
            var trycand = this.gird[r][c].value;
            if (!this.deleteCand(r, c)) {
                this.gird[r][c].value = 0;
                this.recoverCand(r, c, trycand);
                continue;
            }
            if (this.hasAnswer()) {
                /*                 console.log('挖洞失败！'); */
                this.resetPuzzle();
                this.initCand();
                return false;
            }
            this.gird[r][c].value = 0;
            this.recoverCand(r, c, trycand)
        }
        this.cellCand(r, c);
        return true;
    },

    //难度检验
    degreeCheck: function () {
        if (this.solveEasy())
            return 1;
        if (this.solveMediun())
            return 2;
        if (this.solveHard() || this.blankCount() < 20)
            return 3;
        return 4;
    },

    blankCount: function () {
        var blank = 0;
        for (let r = 0; r < 9; r++) {
            for (let c = 0; c < 9; c++) {
                if (this.gird[r][c].value == 0)
                    blank++;
            }
        }
        return blank;
    },

    //此部分为人工解题的模拟，用于检验生成的数独是否符合要求难度
    //此部分法无法检验是否有解，只能使用于一定有解的数独
    solveEasy: function () {
        var flag = true;
        while (flag) {
            flag = this.nakedSingle() || this.hiddenSingle();
        }
        if (this.nextOrderBlankCell() == 81) {
            return true;
        }
        return false;
    },
    solveMediun: function () {
        var flag = true;
        while (flag) {
            if (this.solveEasy())
                return true;
            flag = this.lockedCandidatas() || this.nakedPair();
        }
        return false;
    },
    solveHard: function () {
        var flag = true;
        while (flag) {
            if (this.solveMediun())
                return true;
            flag = this.nakedTriple() || this.hiddenPair();
        }
        return false;
    },

    //显性唯一候选数
    nakedSingle: function () {
        var change = false;   //表示候选数无变化
        for (let r = 0; r < 9; r++) {
            for (let c = 0; c < 9; c++) {
                if (this.gird[r][c].value == 0 && this.gird[r][c].cand.length == 1) {
                    this.gird[r][c].value = parseInt(this.gird[r][c].cand);
                    this.gird[r][c].cand = '';
                    /* console.log('r' + r + 'c' + c + '填入唯一候选数：' + this.gird[r][c].value); */
                    this.deleteCand(r, c)
                    change = true;    //表示候选数删除成功，没有留下错误的格子
                }
            }
        }
        return change;
    },

    //隐性唯一候选数
    hiddenSingle: function () {
        var change = false;
        for (let num = 1; num <= 9; num++) {
            for (let r = 0; r < 9; r++) {
                let rowCount = 0;   //统计某候选数num在行中出现的此数
                let c1 = 9;
                for (let c = 0; c < 9; c++) {
                    if (this.gird[r][c].value == 0 && this.gird[r][c].cand.match(num)) {
                        rowCount++;
                        c1 = c;
                    }
                    if (this.gird.value == num || rowCount > 1) {
                        break;
                    }
                }
                if (rowCount == 1) {
                    this.gird[r][c1].value = num;
                    this.gird[r][c1].cand = '';
                    this.deleteCand(r, c1);
                    /* console.log('r' + r + 'c' + c1 + '填入第' + r + '行中隐性唯一候选数：' + num); */
                    change = true;
                }
            }
            for (let c = 0; c < 9; c++) {
                let colCount = 0;   //统计某候选数num在列中出现的此数
                let r1 = 9;
                for (let r = 0; r < 9; r++) {
                    if (this.gird[r][c].value == 0 && this.gird[r][c].cand.match(num)) {
                        colCount++;
                        r1 = r;
                    }
                    if (this.gird.value == num || colCount > 1) {
                        break;
                    }
                }
                if (colCount == 1) {
                    this.gird[r1][c].value = num;
                    this.gird[r1][c].cand = '';
                    this.deleteCand(r1, c);
                    /*  console.log('r' + r1 + 'c' + c + '填入第' + c + '列中隐性唯一候选数：' + num); */
                    change = true;
                }
            }
            let br = 0; let bc = 0;
            for (let b = 0; b < 9; b++) {
                let boxCount = 0;
                let boxRow = 9; let boxCol = 9;
                let flag = false;
                for (let r = br * 3; r < br * 3 + 3; r++) {
                    for (let c = bc * 3; c < bc * 3 + 3; c++) {
                        if (this.gird[r][c].value == 0 && this.gird[r][c].cand.match(num)) {
                            boxCount++; boxRow = r; boxCol = c;
                        }
                        if (this.gird[r][c].value == num || boxCount > 1) {
                            flag = true; break;
                        }
                    }
                    if (flag) break;
                }
                bc++;
                if (bc == 3) {
                    bc = 0; br++;
                }
                if (boxCount == 1) {
                    this.gird[boxRow][boxCol].value = num;
                    this.gird[boxRow][boxCol].cand = '';
                    this.deleteCand(boxRow, boxCol);
/*                     console.log('r' + boxRow + 'c' + boxCol + '填入第' + this.gird[boxRow][boxCol].box + '宫中隐性唯一候选数：' + num);*/                    change = true;
                }
            }
        }
        return change;
    },

    //区块摒除法
    lockedCandidatas: function () {
        var change = false;
        for (let num = 1; num <= 9; num++) {
            for (let r = 0; r < 9; r++) {
                let rowCount = 0;   //统计某候选数num在行中出现的此数
                let c1 = 9; let c2 = 9; let c3 = 9;
                let rowB = false;
                for (let c = 0; c < 9; c++) {
                    if (this.gird[r][c].value == 0 && this.gird[r][c].cand.match(num)) {
                        rowCount++;
                        if (rowCount == 1) c1 = c;
                        if (rowCount == 2) {
                            c2 = c;
                            if (parseInt(c1 / 3) != parseInt(c2 / 3)) break;
                            rowB = true;
                        }
                        if (rowCount == 3) {
                            c3 = c;
                            if (parseInt(c1 / 3) != parseInt(c3 / 3)) {
                                rowB = false; break;
                            }
                        }
                        if (this.gird.value == num || rowCount > 3) {
                            rowB = false; break;
                        }
                    }
                }
                if (rowB) {
                    /*  console.log('在第' + r + '行中候选数' + num + '只在第' + this.gird[r][c1].box + '宫中出现'); */
                    for (let rBox = this.gird[r][c1].rStart; rBox < this.gird[r][c1].rStart + 3; rBox++) {
                        for (let cBox = this.gird[r][c1].cStart; cBox < this.gird[r][c1].cStart + 3; cBox++) {
                            if (rBox == r) continue;
                            if (this.gird[rBox][cBox].cand.match(num)) {
                                /* console.log('删除r' + rBox + 'c' + cBox + '的候选数：' + num); */
                                this.gird[rBox][cBox].cand = this.gird[rBox][cBox].cand.replace(num, '');
                                change = true;
                            }
                        }
                    }
                }
            }
            for (let c = 0; c < 9; c++) {
                let colCount = 0;   //统计某候选数num在列中出现的此数
                let r1 = 9; let r2 = 9; let r3 = 9;
                let colB = false;
                for (let r = 0; r < 9; r++) {
                    if (this.gird[r][c].value == 0 && this.gird[r][c].cand.match(num)) {
                        colCount++;
                        if (colCount == 1) r1 = r;
                        if (colCount == 2) {
                            r2 = r;
                            if (parseInt(r1 / 3) != parseInt(r2 / 3)) break;
                            colB = true;
                        }
                        if (colCount == 3) {
                            r3 = r;
                            if (parseInt(r1 / 3) != parseInt(r3 / 3)) {
                                colB = false; break;
                            }
                        }
                        if (this.gird.value == num || colCount > 3) {
                            colB = false; break;
                        }
                    }
                }
                if (colB) {
                    /* console.log('在第' + c + '列中候选数' + num + '只在第' + this.gird[r1][c].box + '宫中出现'); */
                    for (let rBox = this.gird[r1][c].rStart; rBox < this.gird[r1][c].rStart + 3; rBox++) {
                        for (let cBox = this.gird[r1][c].cStart; cBox < this.gird[r1][c].cStart + 3; cBox++) {
                            if (cBox == c) continue;
                            if (this.gird[rBox][cBox].cand.match(num)) {
                                /*  console.log('删除r' + rBox + 'c' + cBox + '的候选数：' + num); */
                                this.gird[rBox][cBox].cand = this.gird[rBox][cBox].cand.replace(num, '');
                                change = true;
                            }
                        }
                    }
                }
            }
            let br = 0;
            let bc = 0;
            for (let b = 0; b < 9; b++) {
                let boxCount = 0;
                let boxRow1 = 9; let boxRow2 = 9; let boxRow3 = 9; let boxCol1 = 9; let boxCol2 = 9; let boxCol3 = 9;
                let boxR = false; let boxC = false;
                let flag = false;
                for (let r = br * 3; r < br * 3 + 3; r++) {
                    for (let c = bc * 3; c < bc * 3 + 3; c++) {
                        if (this.gird[r][c].value == 0 && this.gird[r][c].cand.match(num)) {
                            boxCount++;
                            if (boxCount == 1) {
                                boxRow1 = r; boxCol1 = c;
                            }
                            if (boxCount == 2) {
                                boxRow2 = r; boxCol2 = c;
                                if (boxRow1 == boxRow2) boxR = true;
                                else if (boxCol1 == boxCol2) boxC = true;
                                else {
                                    flag = true; break;
                                }
                            }
                            if (boxCount == 3) {
                                boxRow3 = r; boxCol3 = c;
                                if (boxR)
                                    if (boxRow3 != boxRow1) {
                                        boxR = false; flag = true; break;
                                    }
                                if (boxC)
                                    if (boxCol3 != boxCol1) {
                                        boxC = false; flag = true; break;
                                    }
                            }
                        }
                        if (this.gird[r][c].value == num || boxCount > 3) {
                            boxR = false; boxC = false; flag = true; break;
                        }
                    }
                    if (flag) break;
                }
                if (boxR) {
                    /* console.log('在第' + b + '宫中候选数' + num + '只在r' + boxRow1 + '出现'); */
                    for (let i = 0; i < 9; i++) {
                        if (i >= bc * 3 && i < bc * 3 + 3) continue;
                        if (this.gird[boxRow1][i].cand.match(num)) {
                            /* console.log('删除r' + boxRow1 + 'c' + i + '的候选数：' + num); */
                            this.gird[boxRow1][i].cand = this.gird[boxRow1][i].cand.replace(num, '');
                            change = true;
                        }
                    }
                }
                if (boxC) {
                    /*  console.log('在第' + b + '宫中候选数' + num + '只在c' + boxCol1 + '出现'); */
                    for (let i = 0; i < 9; i++) {
                        if (i >= br * 3 && i < br * 3 + 3) continue;
                        if (this.gird[i][boxCol1].cand.match(num)) {
                            /*  console.log('删除r' + i + 'c' + boxCol1 + '的候选数：' + num); */
                            this.gird[i][boxCol1].cand = this.gird[i][boxCol1].cand.replace(num, '');
                            change = true;
                        }
                    }
                }
                bc++;
                if (bc == 3) {
                    bc = 0; br++;
                }
            }
        }
        return change;
    },

    //显性数对
    nakedPair: function () {
        var change = false;
        for (let x = 0; x < 9; x++) {
            var br = parseInt(x / 3) * 3;
            var bc = x % 3 * 3;
            for (let aPos = 0; aPos < 8; aPos++) {
                if (this.gird[x][aPos].value == 0 && this.gird[x][aPos].cand.length == 2) {
                    for (let bPos = aPos + 1; bPos < 9; bPos++) {
                        if (this.gird[x][bPos].value == 0 && this.gird[x][bPos].cand.length == 2) {
                            if (this.gird[x][aPos].cand === this.gird[x][bPos].cand) {
                                // console.log('r' + x + '在c' + aPos + '、c' + bPos + '找到显性数对:' + this.gird[x][aPos].cand)
                                let a = this.gird[x][aPos].cand.charAt(0); let b = this.gird[x][aPos].cand.charAt(1);
                                for (let i = 0; i < 9; i++) {
                                    if (i == aPos || i == bPos) continue;
                                    if (this.gird[x][i].value == 0) {
                                        if (this.gird[x][i].cand.match(a)) {
                                            this.gird[x][i].cand = this.gird[x][i].cand.replace(a, '');
                                            // console.log('删除r' + x + 'c' + i + '的候选数' + a);
                                            change = true;
                                        }
                                        if (this.gird[x][i].cand.match(b)) {
                                            this.gird[x][i].cand = this.gird[x][i].cand.replace(b, '')
                                            // console.log('删除r' + x + 'c' + i + '的候选数' + b)
                                            change = true;
                                        }
                                    }
                                }
                                break;
                            }
                        }
                    }
                }
                if (this.gird[aPos][x].value == 0 && this.gird[aPos][x].cand.length == 2) {
                    for (let bPos = aPos + 1; bPos < 9; bPos++) {
                        if (this.gird[bPos][x].value == 0 && this.gird[bPos][x].cand.length == 2) {
                            if (this.gird[aPos][x].cand === this.gird[bPos][x].cand) {
                                // console.log('c' + x + '在r' + aPos + '、r' + bPos + '找到显性数对:' + this.gird[aPos][x].cand)
                                let a = this.gird[aPos][x].cand.charAt(0); let b = this.gird[aPos][x].cand.charAt(1);
                                for (let i = 0; i < 9; i++) {
                                    if (i == aPos || i == bPos) continue;
                                    if (this.gird[i][x].value == 0) {
                                        if (this.gird[i][x].cand.match(a)) {
                                            this.gird[i][x].cand = this.gird[i][x].cand.replace(a, '');
                                            // console.log('删除r' + i + 'c' + x + '的候选数' + a);
                                            change = true;
                                        }
                                        if (this.gird[i][x].cand.match(b)) {
                                            this.gird[i][x].cand = this.gird[i][x].cand.replace(b, '')
                                            // console.log('删除r' + i + 'c' + x + '的候选数' + b)
                                            change = true;
                                        }
                                    }
                                }
                                break;
                            }
                        }
                    }
                }
                if (this.gird[br + parseInt(aPos / 3)][bc + aPos % 3].value == 0 && this.gird[br + parseInt(aPos / 3)][bc + aPos % 3].cand.length == 2) {
                    for (let bPos = aPos + 1; bPos < 9; bPos++) {
                        if (this.gird[br + parseInt(bPos / 3)][bc + bPos % 3].value == 0 && this.gird[br + parseInt(bPos / 3)][bc + bPos % 3].cand.length == 2) {
                            if (this.gird[br + parseInt(aPos / 3)][bc + aPos % 3].cand === this.gird[br + parseInt(bPos / 3)][bc + bPos % 3].cand) {
                                // console.log('在第' + this.gird[br][bc].box + '宫的r' + parseInt(br + aPos / 3) + 'c' + parseInt(bc + aPos % 3) + '、r' + parseInt(br + bPos / 3) + 'c' + parseInt(bc + bPos % 3) + '找到显性数对:' + this.gird[br + parseInt(aPos / 3)][bc + aPos % 3].cand);
                                let a = this.gird[br + parseInt(aPos / 3)][bc + aPos % 3].cand.charAt(0); let b = this.gird[br + parseInt(aPos / 3)][bc + aPos % 3].cand.charAt(1);
                                for (let i = 0; i < 9; i++) {
                                    if (i == aPos || i == bPos) continue;
                                    if (this.gird[br + parseInt(i / 3)][bc + i % 3].value == 0) {
                                        if (this.gird[br + parseInt(i / 3)][bc + i % 3].cand.match(a)) {
                                            this.gird[br + parseInt(i / 3)][bc + i % 3].cand = this.gird[br + parseInt(i / 3)][bc + i % 3].cand.replace(a, '');
                                            // console.log('删除r' + parseInt(br + i / 3) + 'c' + parseInt(bc + i % 3) + '的候选数' + a);
                                            change = true;
                                        }
                                        if (this.gird[br + parseInt(i / 3)][bc + i % 3].cand.match(b)) {
                                            this.gird[br + parseInt(i / 3)][bc + i % 3].cand = this.gird[br + parseInt(i / 3)][bc + i % 3].cand.replace(b, '')
                                            // console.log('删除r' + parseInt(br + i / 3) + 'c' + parseInt(bc + i % 3) + '的候选数' + b)
                                            change = true;
                                        }
                                    }
                                }
                                break;
                            }
                        }
                    }
                }
            }
        }
        return change;
    },

    //隐性数对
    hiddenPair: function () {
        var change = false;
        for (let num = 1; num <= 9; num++) {
            for (let r = 0; r < 9; r++) {
                let rowCount = 0;   //统计某候选数num在行中出现的此数
                let c1 = 9; let c2 = 9;
                for (let c = 0; c < 9; c++) {
                    if (this.gird[r][c].value == 0 && this.gird[r][c].cand.match(num)) {
                        rowCount++;
                        if (rowCount == 1) c1 = c;
                        if (rowCount == 2) c2 = c;
                        if (this.gird.value == num || rowCount > 2) {
                            break;
                        }
                    }
                }
                if (rowCount == 2) {
                    if (this.gird[r][c1].cand.length > 2 || this.gird[r][c2].cand.length > 2) {
                        let set = this.intersectionSet(this.gird[r][c1].cand, this.gird[r][c1].cand);
                        if (set.length > 1) {
                            set = set.replace(num, '');
                            for (let i = 0; i < set.length; i++) {
                                let rowCount2 = 0;
                                for (let c = 0; c < 9; c++) {
                                    if (c == c1 || c == c2) continue;
                                    if (this.gird[r][c].value == 0 && this.gird[r][c].cand.match(set[i])) { rowCount2++; break }
                                }
                                if (rowCount2 == 0) {
                                    let cand = num + set[i];
                                    /*                                     console.log('r' + r + '在c' + c1 + '、c' + c2 + '找到隐性数对:' + cand);
                                                                        console.log('r' + r + 'c' + c1 + '、r' + r + 'c' + c2 + '只保留候选数' + cand); */
                                    this.gird[r][c1].cand = cand;
                                    this.gird[r][c2].cand = cand;
                                    change = true;
                                    break;
                                }
                            }
                        }
                    }
                }
            }
            for (let c = 0; c < 9; c++) {
                let colCount = 0;   //统计某候选数num在行中出现的此数
                let r1 = 9; let r2 = 9;
                for (let r = 0; r < 9; r++) {
                    if (this.gird[r][c].value == 0 && this.gird[r][c].cand.match(num)) {
                        colCount++;
                        if (colCount == 1) r1 = r;
                        if (colCount == 2) r2 = r;
                        if (this.gird.value == num || colCount > 2) {
                            break;
                        }
                    }
                }
                if (colCount == 2) {
                    if (this.gird[r1][c].cand.length > 2 || this.gird[r2][c].cand.length > 2) {
                        let set = this.intersectionSet(this.gird[r1][c].cand, this.gird[r2][c].cand);
                        if (set.length > 1) {
                            set = set.replace(num, '');
                            for (let i = 0; i < set.length; i++) {
                                let colCount2 = 0;
                                for (let r = 0; r < 9; r++) {
                                    if (r == r1 || r == r2) continue;
                                    if (this.gird[r][c].value == 0 && this.gird[r][c].cand.match(set[i])) { colCount2++; break }
                                }
                                if (colCount2 == 0) {
                                    let cand = num + set[i];
                                    /*                                     console.log('c' + c + '在r' + r1 + '和r' + r2 + '找到隐性数对:' + cand);
                                                                        console.log('r' + r1 + 'c' + c + '和r' + r2 + 'c' + c + '只保留候选数' + cand); */
                                    this.gird[r1][c].cand = cand;
                                    this.gird[r1][c].cand = cand;
                                    change = true;
                                    break;
                                }
                            }
                        }
                    }
                }
            }
            let br = 0;
            let bc = 0;
            for (let b = 0; b < 9; b++) {
                let boxCount = 0;
                let r1 = 9; let r2 = 9; let c1 = 9; let c2 = 9;
                let flag = false;
                for (let r = br * 3; r < br * 3 + 3; r++) {
                    for (let c = bc * 3; c < bc * 3 + 3; c++) {
                        if (this.gird[r][c].value == 0 && this.gird[r][c].cand.match(num)) {
                            boxCount++;
                            if (boxCount == 1) {
                                r1 = r; c1 = c;
                            }
                            if (boxCount == 2) {
                                r2 = r; c2 = c;
                            }
                        }
                        if (this.gird[r][c].value == num || boxCount > 2) {
                            flag = true; break;
                        }
                    }
                    if (flag) break;
                }
                if (boxCount == 2) {
                    if (this.gird[r1][c1].cand.length > 2 || this.gird[r2][c2].cand.length > 2) {
                        let set = this.intersectionSet(this.gird[r1][c1].cand, this.gird[r2][c2].cand);
                        if (set.length > 1) {
                            set = set.replace(num, '');
                            for (let i = 0; i < set.length; i++) {
                                let boxCount2 = 0;
                                let flag2 = false;
                                for (let r = br * 3; r < br * 3 + 3; r++) {
                                    for (let c = bc * 3; c < bc * 3 + 3; c++) {
                                        if ((r == r1 && c == c1) || (r == r2 && c == c2)) continue;
                                        if (this.gird[r][c].value == 0 && this.gird[r][c].cand.match(set[i])) { boxCount2++; flag2 = true; break }
                                    }
                                    if (flag2) break;
                                }
                                if (boxCount2 == 0) {
                                    let cand = num + set[i];
                                    /*                                     console.log('第' + this.gird[r1][c1].box + '宫在r' + r1 + 'c' + c1 + '和r' + r2 + '和c' + c2 + '找到隐性数对:' + cand);
                                                                        console.log('r' + r1 + 'c' + c1 + '和r' + r2 + 'c' + c2 + '只保留候选数' + cand); */
                                    this.gird[r1][c1].cand = cand;
                                    this.gird[r2][c2].cand = cand;
                                    change = true;
                                    break;
                                }
                            }
                        }
                    }
                }
                bc++;
                if (bc == 3) {
                    bc = 0; br++;
                }
            }
        }
    },

    //显性三数组
    nakedTriple: function () {
        var change = false;
        for (let x = 0; x < 9; x++) {
            var br = parseInt(x / 3) * 3; var bc = x % 3 * 3;
            for (let aPos = 0; aPos < 7; aPos++) {
                if (this.gird[x][aPos].value == 0 && this.gird[x][aPos].cand.length <= 3) {
                    let flag = false;
                    for (let bPos = aPos + 1; bPos < 8; bPos++) {
                        if (this.gird[x][bPos].value == 0 && this.gird[x][bPos].cand.length <= 3) {
                            let text = this.unionSet(this.gird[x][aPos].cand, this.gird[x][bPos].cand, '', '')
                            if (text.length > 3) continue;
                            for (let cPos = bPos + 1; cPos < 9; cPos++) {
                                if (this.gird[x][cPos].value == 0 && this.gird[x][cPos].cand.length <= 3) {
                                    let set = this.unionSet(this.gird[x][aPos].cand, this.gird[x][bPos].cand, this.gird[x][cPos].cand, '')
                                    if (set.length == 3) {
                                        // console.log('r' + x + '在c' + aPos + '、c' + bPos + '、c' + cPos + '找到显性三数组:' + set)
                                        let a = set[0]; let b = set[1]; let c = set[2];
                                        for (let i = 0; i < 9; i++) {
                                            if (i == aPos || i == bPos || i == cPos) continue;
                                            if (this.gird[x][i].value == 0) {
                                                if (this.gird[x][i].cand.match(a)) {
                                                    this.gird[x][i].cand = this.gird[x][i].cand.replace(a, '');
                                                    // console.log('删除r' + x + 'c' + i + '的候选数' + a);
                                                    change = true;
                                                }
                                                if (this.gird[x][i].cand.match(b)) {
                                                    this.gird[x][i].cand = this.gird[x][i].cand.replace(b, '')
                                                    // console.log('删除r' + x + 'c' + i + '的候选数' + b)
                                                    change = true;
                                                }
                                                if (this.gird[x][i].cand.match(c)) {
                                                    this.gird[x][i].cand = this.gird[x][i].cand.replace(c, '')
                                                    // console.log('删除r' + x + 'c' + i + '的候选数' + c)
                                                    change = true;
                                                }
                                            }
                                        }
                                        flag = true;  //找到了，退出外面第二重循环
                                        break;
                                    }
                                }
                                if (cPos == 8) flag == true;   //找不到第三个，不用找了退出第二重循环
                            }
                        }
                        if (flag) break;
                    }
                }
                if (this.gird[aPos][x].value == 0 && this.gird[aPos][x].cand.length <= 3) {
                    let flag = false;
                    for (let bPos = aPos + 1; bPos < 8; bPos++) {
                        if (this.gird[bPos][x].value == 0 && this.gird[bPos][x].cand.length <= 3) {
                            let text = this.unionSet(this.gird[x][aPos].cand, this.gird[x][bPos].cand, '', '')
                            if (text.length > 3) continue;
                            for (let cPos = bPos + 1; cPos < 9; cPos++) {
                                if (this.gird[cPos][x].value == 0 && this.gird[cPos][x].cand.length <= 3) {
                                    let set = this.unionSet(this.gird[aPos][x].cand, this.gird[bPos][x].cand, this.gird[cPos][x].cand, '')
                                    if (set.length == 3) {
                                        // console.log('c' + x + '在r' + aPos + '、r' + bPos + '、r' + cPos + '找到显性三数组:' + set)
                                        let a = set[0]; let b = set[1]; let c = set[2];
                                        for (let i = 0; i < 9; i++) {
                                            if (i == aPos || i == bPos || i == cPos) continue;
                                            if (this.gird[i][x].value == 0) {
                                                if (this.gird[i][x].cand.match(a)) {
                                                    this.gird[i][x].cand = this.gird[i][x].cand.replace(a, '');
                                                    // console.log('删除r' + i + 'c' + x + '的候选数' + a);
                                                    change = true;
                                                }
                                                if (this.gird[i][x].cand.match(b)) {
                                                    this.gird[i][x].cand = this.gird[i][x].cand.replace(b, '')
                                                    // console.log('删除r' + i + 'c' + x + '的候选数' + b)
                                                    change = true;
                                                }
                                                if (this.gird[i][x].cand.match(c)) {
                                                    this.gird[i][x].cand = this.gird[i][x].cand.replace(c, '')
                                                    // console.log('删除r' + i + 'c' + x + '的候选数' + c)
                                                    change = true;
                                                }
                                            }
                                        }
                                        flag = true;  //找到了，退出外面第二重循环
                                        break;
                                    }
                                }
                                if (cPos == 8) flag == true;   //找不到第三个，不用找了退出第二重循环
                            }
                        }
                        if (flag) break;
                    }
                }
                if (this.gird[br + parseInt(aPos / 3)][bc + aPos % 3].value == 0 && this.gird[br + parseInt(aPos / 3)][bc + aPos % 3].cand.length <= 3) {
                    let flag = false;
                    for (let bPos = aPos + 1; bPos < 8; bPos++) {
                        if (this.gird[br + parseInt(bPos / 3)][bc + bPos % 3].value == 0 && this.gird[br + parseInt(bPos / 3)][bc + bPos % 3].cand.length <= 3) {
                            let text = this.unionSet(this.gird[br + parseInt(aPos / 3)][bc + aPos % 3].cand, this.gird[br + parseInt(bPos / 3)][bc + bPos % 3].cand, '', '')
                            if (text.length > 3) continue;
                            for (let cPos = bPos + 1; cPos < 9; cPos++) {
                                if (this.gird[br + parseInt(cPos / 3)][bc + cPos % 3].value == 0 && this.gird[br + parseInt(cPos / 3)][bc + cPos % 3].cand.length <= 3) {
                                    let set = this.unionSet(this.gird[br + parseInt(aPos / 3)][bc + aPos % 3].cand, this.gird[br + parseInt(bPos / 3)][bc + bPos % 3].cand, this.gird[br + parseInt(cPos / 3)][bc + cPos % 3].cand, '')
                                    if (set.length == 3) {
                                        // console.log('在第' + this.gird[br][bc].box + '宫的r' + parseInt(br + aPos / 3) + 'c' + parseInt(bc + aPos % 3) + '、r' + parseInt(br + bPos / 3) + 'c' + parseInt(bc + bPos % 3) + '、r' + parseInt(br + cPos / 3) + 'c' + parseInt(bc + cPos % 3) + '找到显性三数组:' + set);
                                        let a = set[0]; let b = set[1]; let c = set[2];
                                        for (let i = 0; i < 9; i++) {
                                            if (i == aPos || i == bPos || i == cPos) continue;
                                            if (this.gird[br + parseInt(i / 3)][bc + i % 3].value == 0) {
                                                if (this.gird[br + parseInt(i / 3)][bc + i % 3].cand.match(a)) {
                                                    this.gird[br + parseInt(i / 3)][bc + i % 3].cand = this.gird[br + parseInt(i / 3)][bc + i % 3].cand.replace(a, '');
                                                    // console.log('删除r' + parseInt(br + i / 3) + 'c' + parseInt(bc + i % 3) + '的候选数' + a);
                                                    change = true;
                                                }
                                                if (this.gird[br + parseInt(i / 3)][bc + i % 3].cand.match(b)) {
                                                    this.gird[br + parseInt(i / 3)][bc + i % 3].cand = this.gird[br + parseInt(i / 3)][bc + i % 3].cand.replace(b, '')
                                                    // console.log('删除r' + parseInt(br + i / 3) + 'c' + parseInt(bc + i % 3) + '的候选数' + b)
                                                    change = true;
                                                }
                                                if (this.gird[br + parseInt(i / 3)][bc + i % 3].cand.match(c)) {
                                                    this.gird[br + parseInt(i / 3)][bc + i % 3].cand = this.gird[br + parseInt(i / 3)][bc + i % 3].cand.replace(c, '')
                                                    // console.log('删除r' + parseInt(br + i / 3) + 'c' + parseInt(bc + i % 3) + '的候选数' + c)
                                                    change = true;
                                                }
                                            }
                                        }
                                        flag = true;  //找到了，退出外面第二重循环
                                        break;
                                    }
                                }
                                if (cPos == 8) flag == true;   //找不到第三个，不用找了退出第二重循环
                            }
                        }
                        if (flag) break;
                    }
                }
            }
        }
        return change;
    },

    //矩形删减法
    xWing: function () {

    },

    //显性四数组
    nakedQuad: function () {

    },

    //隐性三数组
    hiddenTriple: function () {

    },

    //剑鱼
    swordFish: function () {

    },


    intersectionSet: function (a, b) {
        var inter = '';
        for (let i = 0, lenA = a.length, j = 0, lenB = b.length; i < lenA && j < lenB;) {
            if (a[i] == b[j]) {
                inter += a[i];
                i++;
                j++;
            }
            else if (a[i] < b[j]) {
                i++;
            }
            else {
                j++;
            }
        }
        return inter;
    },
    unionSet: function (a, b, c, d) {
        var e = a + b + c + d;
        var union = '';
        for (let i = 0; i < e.length; i++) {
            if (union.match(e[i])) continue;
            union += e[i];
        }
        return union;
    },

    //标记
    biaojifun:function(num){
        for(var r=0;r<9;++r){
            for(var c=0;c<9;++c){
                this.gird[r][c].biaojihong=num;
            }
        }
    },

    //数据池
    candsfun:function(){

        for(var r=0;r<9;++r){
            for(var c=0;c<9;++c){
                if(this.gird[r][c].cand.length>0){
                    for(var i=0;i<this.gird[r][c].cand.length;++i){
                        var ce11co=new cell(r,c);
                        console.log(ce11co);
                        ce11co.id=this.gird[r][c].cand[i]-1;
                        ce11co.value=this.gird[r][c].cand[i];
                        ce11co.biaojihong=1;//数据池标记
                        this.gird[r][c].shujuchi.push(ce11co);
                        this.gird[r][c].biaojihong=1;//当前格子标记1 填数 非原生
                    }
                }
            }
        }

    },

    //传对象
    classfunc:function(){
        return new Sudoku();
    },

    //对gird的value的0全为""
    valuefunc:function(){
            for(var r=0;r<9;++r){
            for(var c=0;c<9;++c){
                if(this.gird[r][c].value==0){
                    this.gird[r][c].value="";
                    this.gird[r][c].biaojihong=1;
                }else if(this.gird[r][c].value==""){
                    this.gird[r][c].value=0;
                    this.gird[r][c].biaojihong=1;
                }
            }
        }
    },
    //答案
    answerfunc:function(){
        
        

        for(var i=0;i<9;++i){
            this.answercopy[i]=[];
            for(var j=0;j<9;++j){
                var ce = new cell(i,j);
                
                ce.id=this.gird[i][j].id;
                ce.value=this.answer[i][j];
                if(this.answer[i][j]==this.puzzle[i][j]){
                    ce.biaojihong=0;
                }else{
                    ce.biaojihong=1;
                }
                this.answercopy[i][j]=ce;
            }
        }
    },
    //重置
    puzzlefunc:function(){
        for(var i=0;i<9;++i){
            this.puzzlecopy[i]=[];
            for(var j=0;j<9;++j){
                var ce = new cell(i,j);
                ce.biaojihong=this.gird[i][j].biaojihong;
                ce.id=this.gird[i][j].id;
                ce.value=this.puzzle[i][j];
                this.puzzlecopy[i][j]=ce;
            }
        }
    },

    //提示
    promptfunc:function(){
        var prompt=[];
        for(var i=0;i<9;++i){
            for(var j=0;j<9;++j){
                if(this.gird[i][j].value==0||this.gird[i][j]==""){
                    prompt.push(this.gird[i][j]);
                }
                
            }
        }

        var rands = Math.floor(Math.random()*prompt.length);
        return [prompt[rands].row,prompt[rands].col];
    },

    //检测20格的问题
    checkCell20copy(r,c,num){
        var rr=[];
        var cc=[];
        var bb=[];
        for(var i=0;i<9;++i){
            if(this.gird[r][i].value==num){rr.push(this.gird[r][i])}
            if(this.gird[i][c].value==num){cc.push(this.gird[i][c])}
        }

        for (let rBox = this.gird[r][c].rStart; rBox < this.gird[r][c].rStart + 3; rBox++) {
            for (let cBox = this.gird[r][c].cStart; cBox < this.gird[r][c].cStart + 3; cBox++) {
                
                    if (this.gird[rBox][cBox].value == num){
                        bb.push(this.gird[rBox][cBox]);
                    }
                
            }
        }

    var checkCell=[];
    checkCell.push(rr);
    checkCell.push(cc);
    checkCell.push(bb);
    return checkCell;

    },

    checkCell20copy4(r,c,num){

    },

    //全部变为1
    checkCell20copy0(){
        for(var i=0;i<9;++i){
            for(var j=0;j<9;++j){
                if(this.gird[i][j].biaojihong==2){
                    this.gird[i][j].biaojihong=0;
                }else if(this.gird[i][j].biaojihong==3){
                    //console.log("125");
                    this.gird[i][j].biaojihong=1;
                }
            }
        }
    },
    

    checkCell20copy1(){

        for(var r=0;r<9;++r){
            for(var j=0;j<9;++j){
                if(this.gird[r][j].biaojihong!=0&&(this.gird[r][j].value!=""&&this.gird[r][j].value!=0)){
                    var checkco = this.checkCell20copy(r,j,this.gird[r][j].value);
                    //console.log(checkco);
                    if(checkco[0].length>1){
                        for(var i=0;i<checkco[0].length;++i){
                            if(checkco[0][i].biaojihong==0){
                            checkco[0][i].biaojihong=2;
                            }else if(checkco[0][i].biaojihong==1){
                            checkco[0][i].biaojihong=3;
                            }
                        }
                    }

                    if(checkco[1].length>1){
                        for(var i=0;i<checkco[1].length;++i){
                            if(checkco[1][i].biaojihong==0){
                            checkco[1][i].biaojihong=2;
                            }else if(checkco[1][i].biaojihong==1){
                            checkco[1][i].biaojihong=3;
                            }
                        }
                    }

                    if(checkco[2].length>1){
                        for(var i=0;i<checkco[2].length;++i){
                            if(checkco[2][i].biaojihong==0){
                                checkco[2][i].biaojihong=2;
                                }else if(checkco[2][i].biaojihong==1){
                                checkco[2][i].biaojihong=3;
                                }
                        }
                    }
                }
            }
        }
    },

    checkCell20copy2(){
        for(var i=0;i<9;++i){
            for(var j=0;j<9;++j){
                if(this.gird[i][j].shujuchi.length>=1&&(this.gird[i][j].value==""||this.gird[i][j].value==0)){
                    for(var k=0;k<this.gird[i][j].shujuchi.length;++k){
                        this.gird[i][j].shujuchi[k].biaojihong=1;
                    }
                }
            }
        }
    },

    checkCell20copy3(){
        for(var i=0;i<9;++i){
            for(var j=0;j<9;++j){
                if(this.gird[i][j].shujuchi.length>=1&&(this.gird[i][j].value==""||this.gird[i][j].value==0)){
                    for(var k=0;k<this.gird[i][j].shujuchi.length;++k){
                         var checkco = this.checkCell20copy(i,j,this.gird[i][j].shujuchi[k].value);


                    //console.log(checkco);
                    if(checkco[0].length>=1){
                        for(var l=0;l<checkco[0].length;++l){
                            if(checkco[0][l].biaojihong==0){
                            checkco[0][l].biaojihong=2;
                            }else if(checkco[0][l].biaojihong==1){
                            checkco[0][l].biaojihong=3;
                            }
                        }

                        this.gird[i][j].shujuchi[k].biaojihong=2;
                    }

                    if(checkco[1].length>=1){
                        for(var l=0;l<checkco[1].length;++l){
                            if(checkco[1][l].biaojihong==0){
                            checkco[1][l].biaojihong=2;
                            }else if(checkco[1][l].biaojihong==1){
                            checkco[1][l].biaojihong=3;
                            }
                        }

                         this.gird[i][j].shujuchi[k].biaojihong=2;
                    }

                    if(checkco[2].length>=1){
                        for(var l=0;l<checkco[2].length;++l){
                            if(checkco[2][l].biaojihong==0){
                                checkco[2][l].biaojihong=2;
                                }else if(checkco[2][l].biaojihong==1){
                                checkco[2][l].biaojihong=3;
                                }
                        }

                        this.gird[i][j].shujuchi[k].biaojihong=2;
                    }


                    }
                }
            }
        }
    },

    //删除候选数 在填数的时候
    checkCell20copy5(r,c,num){

        for(var i=0;i<9;++i){
            for(var k=0;k<this.gird[r][i].shujuchi.length;++k){
                if(this.gird[r][i].shujuchi[k].value==num){
                    this.gird[r][i].shujuchi.splice(k,1);
                }
            }
            for(var k=0;k<this.gird[i][c].shujuchi.length;++k){
                if(this.gird[i][c].shujuchi[k].value==num){
                    this.gird[i][c].shujuchi.splice(k,1);
                }
            }
        }


         for (let rBox = this.gird[r][c].rStart; rBox < this.gird[r][c].rStart + 3; rBox++) {
            for (let cBox = this.gird[r][c].cStart; cBox < this.gird[r][c].cStart + 3; cBox++) {
                
                for(var k=0;k<this.gird[rBox][cBox].shujuchi.length;++k){
                    if(this.gird[rBox][cBox].shujuchi[k].value==num){
                        this.gird[rBox][cBox].shujuchi.splice(k,1);
                    }
                }
                
            }
        }


        
    },

    //标记
    biaojihfun:function(){
        for(var i=0;i<9;++i){
            for(var j=0;j<9;++j){
                if(this.gird[i][j].biaojihong==0){

                }else if(this.gird[i][j]==1){

                }else if(this.gird[i][j]==2){
                    this.gird[i][j].biaojihong=1;
                }
            }
        }
    },

     cell0:function(r,c) {
        
        return new cell(r,c);
    },

    printfResult: function () {
        var result = '';
        for (var r = 0; r < 9; r++) {
            for (var c = 0; c < 9; c++) {
                result += '[';
                result += this.gird[r][c].value;
                result += ']';
                result += ' ';
            }
            result += "\n";
        }
        console.log(result);
        var cand = '';
        for (var r = 0; r < 9; r++) {
            for (var c = 0; c < 9; c++) {
                cand += '[';
                cand += this.gird[r][c].cand;
                cand += ']';
                cand += ' ';
            }
            cand += "\n";
        }
        console.log(cand);
        var a = '';
        for (var r = 0; r < 9; r++) {
            for (var c = 0; c < 9; c++) {
                if (this.gird[r][c].value != 0)
                    a += this.gird[r][c].value;
                else
                    a += '.';
            }
        }
        console.log(a);
        /*
        var a = '';
        for (var r = 0; r < 9; r++) {
            for (var c = 0; c < 9; c++) {
                if (this.gird[r][c].value != 0)
                    a += this.gird[r][c].hasDig;
                else
                    a += '.';
            }
        }
        console.log(a);

        var a = '';
        for (var r = 0; r < 9; r++) {
            for (var c = 0; c < 9; c++) {
                if (this.gird[r][c].value != 0)
                    a += this.gird[r][c].lock;
                else
                    a += '.';
            }
        }
        console.log(a);*/
    }

}
module.exports.Sudoku = Sudoku;
//module.exports.cell=cell;
//module.exports.Sudoku.prototype.initSudoku=Sudoku.prototype.initSudoku;
/*console.time('solve');
var x = new Sudoku();*/
/* var x = new Sudoku('000000000009000726000015908034580000600109005000063890306790000417000600000000000'); */
/* var x = new Sudoku(); */
/* console.log(a.gird) */
/* a.generateAnswerGird(); */
/* x.initSudoku('000000000009000726000015908034580000600109005000063890306790000417000600000000000'); */
//x.initSudoku(4);
//x.printfResult();
//x.initCand();
//x.hasAnswer();
//x.printfResult();
/* console.log(a.answer)
console.log(a.puzzle) */
//console.timeEnd('solve');

