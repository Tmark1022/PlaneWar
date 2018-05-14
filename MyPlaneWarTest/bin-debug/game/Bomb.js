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
 * 爆炸特效
 */
var Bomb = (function (_super) {
    __extends(Bomb, _super);
    function Bomb() {
        var _this = _super.call(this) || this;
        // 初始化成员属性
        _this.texture_list = [];
        for (var index = 0; index < 23; ++index) {
            _this.texture_list[index] = RES.getRes("explo_json.explo_m" + index.toString());
        }
        _this.now_index = 0;
        _this.change_texture_timer = new egret.Timer(1000 / 24, 24);
        _this.sound_music = RES.getRes("explo_mp3");
        _this.scaleX = 1.3;
        _this.scaleY = 1.3;
        _this.addEventListener(egret.Event.ADDED_TO_STAGE, _this.onAddToStage, _this);
        _this.addEventListener(egret.Event.REMOVED_FROM_STAGE, _this.removeFromStage, _this);
        _this.change_texture_timer.addEventListener(egret.TimerEvent.TIMER, _this.changeTextureFunc, _this);
        _this.change_texture_timer.addEventListener(egret.TimerEvent.TIMER_COMPLETE, _this.changeTextureCompleteFunc, _this);
        return _this;
    }
    Bomb.createBomb = function () {
        if (GameData.BombCacheList.length > 0)
            return GameData.BombCacheList.pop();
        return new Bomb();
    };
    /**加入舞台 */
    Bomb.prototype.onAddToStage = function (evt) {
        this.now_index = 0;
        this.texture = this.texture_list[this.now_index];
        this.change_texture_timer.reset(); // 重置计时计数
        this.change_texture_timer.start();
        this.sound_music.play(0, 1);
    };
    /**从舞台删除 */
    Bomb.prototype.removeFromStage = function (evt) {
        GameData.BombCacheList.push(this);
    };
    /**更改纹理响应函数 */
    Bomb.prototype.changeTextureFunc = function (evt) {
        this.texture = this.texture_list[this.now_index++];
    };
    /**完成播放响应函数 */
    Bomb.prototype.changeTextureCompleteFunc = function (evt) {
        this.change_texture_timer.stop();
        // 从舞台中删除
        GameData.GameAppObj.removeChild(this);
    };
    return Bomb;
}(egret.Bitmap));
__reflect(Bomb.prototype, "Bomb");
//# sourceMappingURL=Bomb.js.map