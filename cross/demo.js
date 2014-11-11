var point1 = new Point(0, 0);
var point2 = new Point(4, 4);
var point3 = new Point(1, 5);
var point4 = new Point(3, 4);

var line1 = new Line(point1, point2, 0);
var line2 = new Line(point3, point4, 1);
var cross = new Cross(line1, line2);
cross.getCross();// 结果返回{point: new Point(3.6666..., 3.666...), type: -1}

