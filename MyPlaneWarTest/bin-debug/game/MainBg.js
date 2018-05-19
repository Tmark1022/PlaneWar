/**
 * 主背景类
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
// 开始背景
var StartMainBg = (function (_super) {
    __extends(StartMainBg, _super);
    function StartMainBg() {
        var _this = _super.call(this) || this;
        _this.createView();
        return _this;
    }
    /**创建视图 */
    StartMainBg.prototype.createView = function () {
        this.bg_bitmap = new egret.Bitmap();
        this.bg_bitmap.width = GameData.stageW;
        this.bg_bitmap.height = GameData.stageH;
        this.bg_bitmap.texture = RES.getRes("mainbg_jpg");
        this.addChild(this.bg_bitmap);
        this.start_button = new egret.Bitmap();
        this.start_button.texture = RES.getRes("startbutton_png");
        this.start_button.anchorOffsetX = this.start_button.width / 2;
        this.start_button.anchorOffsetY = this.start_button.height / 2;
        this.start_button.x = GameData.stageW / 2;
        this.start_button.y = GameData.stageH / 6 * 5;
        this.addChild(this.start_button);
    };
    return StartMainBg;
}(egret.Sprite));
__reflect(StartMainBg.prototype, "StartMainBg");
// 结束背景
var EndMainBg = (function (_super) {
    __extends(EndMainBg, _super);
    function EndMainBg() {
        var _this = _super.call(this) || this;
        _this.createView();
        return _this;
    }
    /**创建视图 */
    EndMainBg.prototype.createView = function () {
        this.bg_shape = new egret.Shape();
        this.bg_shape.graphics.beginFill(0x969696);
        this.bg_shape.graphics.drawRect(0, 0, GameData.stageW, GameData.stageH);
        this.bg_shape.graphics.endFill();
        this.bg_shape.alpha = 0.5;
        this.addChild(this.bg_shape);
        this.game_over_bitmap = new egret.Bitmap();
        this.game_over_bitmap.texture = RES.getRes("gameover_png");
        var readix_temp = this.game_over_bitmap.texture.textureHeight / this.game_over_bitmap.texture.textureWidth;
        this.game_over_bitmap.width = GameData.stageW;
        this.game_over_bitmap.height = this.game_over_bitmap.width * readix_temp;
        this.game_over_bitmap.anchorOffsetX = this.game_over_bitmap.width / 2;
        this.game_over_bitmap.anchorOffsetY = this.game_over_bitmap.height / 2;
        this.game_over_bitmap.x = GameData.stageW / 2;
        this.game_over_bitmap.y = GameData.stageH / 5 * 2;
        this.addChild(this.game_over_bitmap);
        this.text_field = new egret.TextField();
        this.text_field.width = GameData.stageW;
        this.text_field.x = 0;
        this.text_field.y = GameData.stageH / 6 * 4;
        this.text_field.textAlign = "center";
        this.text_field.size = 40;
        this.addChild(this.text_field);
    };
    EndMainBg.prototype.updateScore = function () {
        this.text_field.text = "\u5230\u8FBE\u5173\u5361:" + GameData.MissionId + "\n\n\n\u603B\u5F97\u5206:" + GameData.Score;
    };
    return EndMainBg;
}(egret.Sprite));
__reflect(EndMainBg.prototype, "EndMainBg");
//# sourceMappingURL=MainBg.js.map