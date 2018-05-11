var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
/**
 * 可移动bitmap类
 */
var MovableBitMap = (function (_super) {
    __extends(MovableBitMap, _super);
    /**构造函数 */
    function MovableBitMap(texture_name_temp, value) {
        var _this = _super.call(this, value) || this;
        _this.texture_name = texture_name_temp;
        _this.texture = RES.getRes(_this.texture_name);
        _this.anchorOffsetX = _this.width / 2;
        _this.anchorOffsetY = _this.height / 2;
        return _this;
    }
    MovableBitMap.prototype.getTextureName = function () {
        return this.texture_name;
    };
    return MovableBitMap;
}(egret.Bitmap));
__reflect(MovableBitMap.prototype, "MovableBitMap");
//# sourceMappingURL=MovableBitMap.js.map