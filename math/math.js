void 

function(exportName) {

'use strict';

var exports = exports || {};

/**
 * 几何数学方法集
 * @author 杨小湖
 * @date 2014-11-13
 */

/**
 * 计算点到点之间的距离
 * @param {Array[Number,Number]} a 坐标1
 * @param {Array[Number,Number]} b 坐标2
 * @return {Number} 返回点与点间的距离
 */

function pointToPoint(a, b) {
	return Math.sqrt(Math.pow(a[0] - b[0], 2) + Math.pow(a[1] - b[1], 2));
}

exports.pointToPoint = pointToPoint;

/**
 * 计算点到线段的距离
 * @param {Array[Number,Number]} point 点坐标
 * @param {Array[Number,Number]} a 参考线段坐标1
 * @param {Array[Number,Number]} b 参考线段坐标2
 * @return {Number} 返回点到线段的距离
 * @theory if point=[x0, y0], line = [[x1, y1], [x2, y2]], 
 *  then distance= Math.abs((y0-y1)(x2-x1) -(x0-x1)(y2-y1))/pointToPoint([x1, y1], [x2, y2]);
 */
function pointToLine(point, a, b) {
	if (a.toString() === b.toString()) { //直线端点重合
		return pointToPoint(point, a);
	}
	if (a[0] === b[0]) { //直线垂直摆放, 考虑这种情况的意义在于尽量避免复杂的计算
		return Math.abs(point[0] - a[0]);
	}
	if (a[1] === b[1]) { //直线水平摆放
		return Math.abs(point[1] - a[1]);
	}
		return Math.abs((point[1] - a[1])*(b[0] - a[0]) - (point[0] - a[0]) * (b[1] - a[1])) / Math.sqrt(Math.pow(a[0] - b[0], 2) + Math.pow(a[1] - b[1], 2)) ;
}

/**
 * 计算过任意一点作直线的垂线的垂足
 * @param {Array[Number,Number]} point 点坐标
 * @param {Array[Number,Number]} a 参考线段坐标1
 * @param {Array[Number,Number]} b 参考线段坐标2
 * @return {Number} 返回垂足的坐标
 * @theory 直线两点式 （y - y1)/(x - x1) = (y2 - y1)/(x2 - x1) 转换为一般式为
 *  （y2 - y1)x + (x1 - x2)y + x2y1 - x1y2=0, 另A = y2 - y1, B= x1 - x2, C = x2y1 - x1y2
 *   x = (  B*B*x0  -  A*B*y0  -  A*C  ) / ( A*A + B*B )
 *	 y  =  ( -A*B*x0 + A*A*y0 - B*C  ) / ( A*A + B*B )
 */
function pedal(point, a, b) {
	var A  =  b[1] - a[1];
	var B  =  a[0] - b[0];
	var C  =  b[0]*a[1] - b[1]*a[0];
	var A1 =  A*A;
	var B1 =  B*B;

	return [(B1*point[0] - A*B*point[1] - A*C)/(A1 + B1),
			(-A*B*point[0] + A1*point[1] - B*C)/(A1 + B1)
			]
}

/**
 * 计算一点关于另一点的对称点
 * @param {Array[Number,Number]} point1 目标点坐标
 * @param {Array[Number,Number]} point2 参考点坐标
 * @return {Number} 返回对称点坐标
 */
function pointSymmetryPoint(point1, point2) {
	return [2*point2[0] - point1[0], 2*point2[1] - point1[1]];
}

/**
 * 计算一点关于直线的对称点
 * @param {Array[Number,Number]} point 点坐标
 * @param {Array[Number,Number]} a 参考线段坐标1
 * @param {Array[Number,Number]} b 参考线段坐标2
 * @return {Number} 返回对称点坐标
 * @theory 首先求出垂足，再求出对称点
 */
 function lineSymmetryPoint(point, a, b) {
 	return pointSymmetryPoint(point, pedal(point, a, b));
 }

/**
 * 已知外切圆半径求与已知两定圆相切的两外切圆
 * @param {Number} r 外切圆O半径
 * @param {Array[Number,Number,Number]} a 参考圆A, 其中前两个参数为坐标，第三个参数为半径
 * @param {Array[Number,Number,Number]} b 参考圆B, 其中前两个参数为坐标，第三个参数为半径
 * @return {Array[Array[Number,Number],Array[Number,Number]]} 返回两外切圆坐标
 * @theory d = |AB|, d1 = |AO|, d2 = |BO|, angle = <OAB
 */

function circumscribedCircleOfTwoCircles(r, a, b) {
	var d = Math.sqrt(Math.pow(a[0] - b[0], 2) + Math.pow(a[1] - b[1], 2));
	var d1 = r + a[2];
	var d2 = r + b[2];
	var angle;

	if( r<=0 || 2*r>a[2]+b[2] || d<=Math.abs(a[2]-b[2]) ) { 
		console.log('不能存在外切圆');
		return false;
	}
	angle = Math.acos(d1*d1 + d*d - d2*d2)/(2*d*d1);

	if( a[0])


}

/**
 * 求直线与圆的交点坐标
 * @param {Array[Number, Number]} a 决定直线的一个点坐标
 * @param {Array[Number, Number]} b 决定直线的另一个点坐标
 * @param {Array[Number,Number,Number]} c 被交圆, 其中前两个参数为坐标，第三个参数为半径
 * @return {Array[Array[Number,Number],Array[Number,Number]]} 返回两交点坐标
 * @theory 直线两点式 （y - y1)/(x - x1) = (y2 - y1)/(x2 - x1) 转换为一般式为
 *  （y2 - y1)x + (x1 - x2)y + x2y1 - x1y2=0, 另A = y2 - y1, B= x1 - x2, C = x2y1 - x1y2
 * sin(ang1) = A/B || 90deg; sin(ang + ang1) = (Ax0 + By0 + C)/Math.sqrt(A*A + B*B);
 */

function crossOfLineAndCircle(a, b, c) {
	var ang1, ang, angs;
	var A  =  b[1] - a[1];
	var B  =  a[0] - b[0];
	var C  =  b[0]*a[1] - b[1]*a[0];
	var temp = -(A*c[0] + B*c[1] + C) / Math.sqrt(B*B + A*A);
	if(Math.abs(temp) > c[2]) {
		return false;
	}
	ang1 = B===0 ? Math.PI*0.5 : Math.asin(A/B);
	ang = Math.asin(temp/c[2]);
	angs = [ang - ang1, Math.PI - ang - ang1];

	return [[c[0] + c[2]*Math.cos(angs[0]), c[1] + c[2]*Math.sin(angs[0])],
			[c[0] + c[2]*Math.cos(angs[1]), c[1] + c[2]*Math.sin(angs[1])]]
}
}('math');






















