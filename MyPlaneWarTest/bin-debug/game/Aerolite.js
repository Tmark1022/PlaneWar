/**
 * 陨石类
 */
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
var Aerolite = (function (_super) {
    __extends(Aerolite, _super);
    function Aerolite(texture_name_temp) {
        var _this = _super.call(this, texture_name_temp) || this;
        _this.speed = 1;
        _this.move_right = true;
        _this.blood = 100;
        _this.addEventListener(egret.Event.ADDED_TO_STAGE, _this.onAddToStage, _this);
        return _this;
    }
    /**创建陨石 */
    Aerolite.createAerolite = function (texture_name_temp) {
        if (GameData.aeroliteCacheList.length > 0) {
            var aerolite_list = GameData.aeroliteCacheList;
            for (var index = 0; index < aerolite_list.length; ++index) {
                var res_aerolite_obj = aerolite_list[index];
                if (res_aerolite_obj.getTextureName() == texture_name_temp) {
                    aerolite_list.splice(index, 1);
                    return res_aerolite_obj;
                }
            }
        }
        return new Aerolite(texture_name_temp);
    };
    /**回收陨石 */
    Aerolite.reclaimAerolite = function (aerolite_obj) {
        if (aerolite_obj == null)
            return;
        GameData.aeroliteCacheList.push(aerolite_obj);
    };
    /**加入舞台 */
    Aerolite.prototype.onAddToStage = function (evt) {
        this.move_right = true;
        this.blood = 100;
    };
    /**
    * 是否超出显示区域
    */
    Aerolite.prototype.isOutOfStage = function () {
        if (this.x < 0 || this.x > GameData.stageW || this.y < 0 || this.y > GameData.stageH)
            return true;
        else
            return false;
    };
    /**
     * 每帧移动轨迹
     */
    Aerolite.prototype.moveByEnterFrame = function () {
        var temp_rotation = this.rotation += 1;
        if (this.rotation >= 180)
            this.rotation = temp_rotation - 360;
        else
            this.rotation = temp_rotation;
        if (GameData.fpsOffset == null)
            return;
        if (this.x > GameData.stageW - this.width)
            this.move_right = false;
        if (this.x < this.width)
            this.move_right = true;
        if (this.move_right)
            this.x += this.speed * GameData.fpsOffset;
        else
            this.x -= this.speed * GameData.fpsOffset;
        this.y += this.speed * GameData.fpsOffset;
    };
    return Aerolite;
}(MovableBitMap));
__reflect(Aerolite.prototype, "Aerolite");
//# sourceMappingURL=Aerolite.js.map