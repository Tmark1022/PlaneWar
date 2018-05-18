/**
 * 子弹类
 * 子弹类型{1:我的普通子弹, 2:我的五连发子弹, 3:我的激光子弹, 4:敌人子弹1，5:敌人子弹2, 6:敌人子弹3, 7:敌人子弹4}
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
var Bullet = (function (_super) {
    __extends(Bullet, _super);
    function Bullet(bullet_type_temp, texture_index) {
        var _this = this;
        var texture_name;
        var damage_temp;
        switch (bullet_type_temp) {
            case 1:
                texture_name = "mybullet_json.mybullet_norm";
                damage_temp = 20;
                break;
            case 2:
                texture_name = "mybullet_json.mybullet2";
                damage_temp = 12;
                break;
            case 3:
                texture_name = "mybullet_json.bullet-self3-" + texture_index.toString();
                damage_temp = 4;
                break;
            case 4:
                texture_name = "enemybullet_json.enemybullet1";
                damage_temp = 20;
                break;
            case 5:
                texture_name = "enemybullet_json.enemybullet2";
                damage_temp = 20;
                break;
            case 6:
                texture_name = "enemybullet_json.enemybullet3";
                damage_temp = 20;
                break;
            case 7:
                texture_name = "enemybullet_json.enemybullet4";
                damage_temp = 20;
                break;
        }
        _this = _super.call(this, texture_name) || this;
        // 初始化成员属性
        _this.bullet_type = bullet_type_temp;
        _this.damage_init = damage_temp;
        _this.damage = _this.damage_init;
        return _this;
    }
    /**
     * 静态成员函数
     */
    /**创建子弹 */
    Bullet.createBullet = function (bullet_type_temp, texture_index) {
        var bullet_obj;
        bullet_obj = Bullet.getBulletObjFromCache(bullet_type_temp, texture_index);
        if (bullet_obj == null)
            bullet_obj = new Bullet(bullet_type_temp, texture_index);
        return bullet_obj;
    };
    /**从缓存里边获得对象 */
    Bullet.getBulletObjFromCache = function (bullet_type_temp, texture_index) {
        var res_bullet_obj = null; // 缓存没有对象就返回NULL
        if (GameData.bulletCacheDict[bullet_type_temp.toString()] == null)
            GameData.bulletCacheDict[bullet_type_temp.toString()] = [];
        // 对应类型的缓存列表
        var bullet_cache_list = GameData.bulletCacheDict[bullet_type_temp.toString()];
        if (bullet_cache_list.length > 0) {
            if (bullet_type_temp == 3) {
                for (var index = 0; index < bullet_cache_list.length; ++index) {
                    var temp_bullet_obj = bullet_cache_list[index];
                    if (temp_bullet_obj.getTextureName() == "mybullet_json.bullet-self3-" + texture_index.toString()) {
                        res_bullet_obj = temp_bullet_obj;
                        bullet_cache_list.splice(index, 1);
                        break;
                    }
                }
            }
            else {
                res_bullet_obj = bullet_cache_list.pop();
            }
        }
        return res_bullet_obj;
    };
    /**回收子弹 */
    Bullet.reclaimBullet = function (bullet_obj) {
        if (bullet_obj == null)
            return;
        var bullet_type = bullet_obj.bullet_type;
        if (GameData.bulletCacheDict[bullet_type.toString()] == null)
            GameData.bulletCacheDict[bullet_type.toString()] = [];
        var bullet_cache_list = GameData.bulletCacheDict[bullet_type.toString()];
        bullet_cache_list.push(bullet_obj);
    };
    /**
     * 是否超出显示区域
     */
    Bullet.prototype.isOutOfStage = function () {
        if (this.x < 0 || this.x > GameData.stageW || this.y < 0 || this.y > GameData.stageH)
            return true;
        else
            return false;
    };
    /**
     * 每帧移动轨迹
     */
    Bullet.prototype.moveByEnterFrame = function () {
        this.y += this.vertical_speed * GameData.fpsOffset;
        this.x += this.horizontal_speed * GameData.fpsOffset;
    };
    /**设置子弹垂直速度 */
    Bullet.prototype.setVerticalSpeed = function (new_vertical_speed) {
        if (new_vertical_speed == 0 || new_vertical_speed == null)
            return;
        this.vertical_speed = new_vertical_speed;
    };
    /**设置子弹水平速度 */
    Bullet.prototype.setHorizontalSpeed = function (new_horizontal_speed) {
        if (new_horizontal_speed == null)
            return;
        this.horizontal_speed = new_horizontal_speed;
    };
    return Bullet;
}(MovableBitMap));
__reflect(Bullet.prototype, "Bullet");
//# sourceMappingURL=Bullet.js.map