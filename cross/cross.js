// author:      yangxiaohu
// date:        2014/11/11
// description: 用于获取任意两条线(线段、直线、射线)的交点

// 定义点
function Point(x, y) {
    this.x = x || 0;
    this.y = y || 0;
}

// 定义线
function Line(point1, point2, type) {
    // point1为第一个点, point2为第二个点, type为线类型, 其中 0为直线、1为线段、2为射线
    this.p1 = point1;
    this.p2 = point2;
    this.type = type || 0;//默认为直线
}

// Cross是求解交点的类的构造函数
function Cross(line1, line2) {
    // line1, line2 分别为需要求交点的两条线，它们可能在内部相交，也可能在延长线上相交，也可能不相交
    // 需要说明的是线由两个点Point(x, y)决定， 对于射线第一个点是起点，第二个点确定方向，直线和线段无方向
    this.l1 = line1;
    this.l2 = line2;
}

Cross.prototype = {
    // 误差精度
    accuracy: 1e-6,
    // 获取方程系数 a1x + b1y = c1; a2x + b2y = c2; a[3] = [a1, b1, c1]; b[3] = [a2, b2, c2];
    _getModulus1: function() {
        return {
            a: [ this.l1.p2.y - this.l1.p1.y,
                 this.l1.p1.x - this.l1.p2.x,
                 this.l1.p1.x * this.l1.p2.y - this.l1.p2.x * this.l1.p1.y
            ],
            b: [ this.l2.p2.y - this.l2.p1.y,
                 this.l2.p1.x - this.l2.p2.x,
                 this.l2.p1.x * this.l2.p2.y - this.l2.p2.x * this.l2.p1.y
            ]
        };
    },
    // x = (c1 * b2 - c2 * b1)/(a1 * b2 - a2 * b1);
    // y = (a1 * c2 - a2 * c1)/(a1 * b2 - a2 * b1);
    // modulus[3] = [a1 * b2 - a2 * b1, c1 * b2 - c2 * b1, a1 * c2 - a2 * c1]
    _getModulus2: function() {
        var data = this._getModulus1();

        return [ data.a[0] * data.b[1] - data.b[0] * data.a[1],
                 data.a[2] * data.b[1] - data.b[2] * data.a[1],
                 data.a[0] * data.b[2] - data.b[0] * data.a[2]
        ];
    },
    // 判断是否存在交点(只要不平行就认为相交)
    _hasCross: function() {
        this.modulus = this._getModulus2();
        // 返回1表示相交, -1 表示重合, 0表示平行
        Math.abs(this.modulus[0]) > this.accuracy ? (return 1) : (this._inLine(this.l1, this.l2.p1) ? (return -1) : (return 0));
    },
    // 判断点p是否在线line上, 其中p是已经求得的交点(可能是内部相交的点，也可能是延长线上相交，也可能不相交)
    _inLine: function(line, p) {
        switch(line.type) {
            case 0:
                return true;
            case 1:
                return (p.x - line.p1.x) * (line.p2.x - p.x) >= 0 && (p.y - line.p1.y) * (line.p2.y - p.y) >= 0;
            case 2:
                return (p.x - line.p1.x) * (line.p2.x - line.p1.x) >= 0 && (p.y - line.p1.y) * (line.p2.y - line.p1.y) >= 0;
            default:
                return false;
        }
    },
    // 获取交点,如果有的话
    getCross: function() {
        var p;//存交点
        var type = 0;//存交点类型，无交点为0, 延长线交点为-1, 内部交点为1, 重合为2

        if(this._hasCross() == 1) {
            p = new Point(this.modulus[1] / this.modulus[0], this.modulus[2] / this.modulus[0]);
            type = this._inLine(this.l1, p) && this._inLine(this.l2, p) ? 1 : -1;
        }
        else if(this._hasCross() == -1) {
            p = [this.l1.p1, this.l1.p2, this.l2.p1, this.l2.p2];
            type = 2;
        }
        return {
            point: p,
            type:  type
        };
    }
}