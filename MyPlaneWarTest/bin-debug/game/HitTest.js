/**
 * 碰撞检测
 */
var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var HitTest = (function () {
    function HitTest() {
    }
    /**
     //两物品重叠的碰撞判断方式
    public static hitTest(obj1:egret.DisplayObject,obj2:egret.DisplayObject):boolean
    {
        var rect1: egret.Rectangle = obj1.getBounds();
        var rect2: egret.Rectangle = obj2.getBounds();
        rect1.x = obj1.x;
        rect1.y = obj1.y;
        rect2.x = obj2.x;
        rect2.y = obj2.y;
        return rect1.intersects(rect2);
    }
    */
    //点和物品的碰撞判断方式，较为精确及可控
    HitTest.hitTestP = function (obj1, obj2, shape_flag) {
        if (shape_flag === void 0) { shape_flag = false; }
        // 之前已调整锚点（x,y）即为图像中心点
        // 图像的中心点
        if (obj1.hitTestPoint(obj2.x, obj2.y, shape_flag)) {
            return true;
        }
        else
            return false;
    };
    return HitTest;
}());
__reflect(HitTest.prototype, "HitTest");
//# sourceMappingURL=HitTest.js.map