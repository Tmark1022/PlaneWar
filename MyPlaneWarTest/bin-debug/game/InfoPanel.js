/**
 * 信息面板
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
var InfoPanel = (function (_super) {
    __extends(InfoPanel, _super);
    function InfoPanel() {
        var _this = _super.call(this) || this;
        _this.width = GameData.stageW;
        _this.height = 30;
        _this.alpha = 0.6;
        // 初始化属性值
        _this.min_blood = 0;
        _this.max_blood = 100;
        // 绘制背景
        _this.graphics.beginFill(0x1874CD);
        _this.graphics.drawRect(0, 0, _this.width, _this.height);
        // 得分
        _this.score_text_field = new egret.TextField();
        _this.score_text_field.x = 0;
        _this.score_text_field.y = 0;
        _this.addChild(_this.score_text_field);
        _this.HP_text_filed_temp = new egret.TextField();
        _this.HP_text_filed_temp.x = GameData.stageW / 2 - 50;
        _this.HP_text_filed_temp.y = 0;
        _this.HP_text_filed_temp.text = "HP:";
        _this.addChild(_this.HP_text_filed_temp);
        // 血量条绘制
        _this.blood_shape = new egret.Shape();
        _this.blood_shape.x = GameData.stageW / 2;
        _this.blood_shape.y = 2.5;
        _this.blood_shape.width = GameData.stageW / 2;
        _this.blood_shape.height = 30;
        _this.addChild(_this.blood_shape);
        _this.blood_width_radix = _this.blood_shape.width / _this.max_blood;
        // 血量文字
        _this.HP_text_field = new egret.TextField();
        _this.HP_text_field.x = _this.blood_shape.x + _this.blood_shape.width / 3;
        _this.HP_text_field.y = 0;
        _this.addChild(_this.HP_text_field);
        return _this;
    }
    InfoPanel.prototype.updateScore = function () {
        var now_score = GameData.Score;
        this.score_text_field.text = "\u5173\u5361" + GameData.MissionId + " \u5F97\u5206:" + now_score;
    };
    InfoPanel.prototype.updateBlood = function (new_blood) {
        if (new_blood < this.min_blood)
            this.now_blood = this.min_blood;
        else if (new_blood > this.max_blood)
            this.now_blood = this.max_blood;
        else
            this.now_blood = new_blood;
        var color_num;
        // 血条颜色
        if (this.now_blood >= 80)
            color_num = 0x7FFF00;
        else if (this.now_blood >= 30)
            color_num = 0xEEC900;
        else
            color_num = 0xCD0000;
        this.blood_shape.graphics.clear();
        // 绘制背景条
        this.blood_shape.graphics.beginFill(0xCCCCCC);
        // this.blood_shape.graphics.lineStyle(2, 0xEE1289);
        this.blood_shape.graphics.drawRoundRect(0, 0, this.blood_shape.width, this.blood_shape.height - 5, 20);
        this.blood_shape.graphics.endFill();
        this.blood_shape.graphics.beginFill(color_num);
        // this.blood_shape.graphics.lineStyle(7, 0xEE1289);
        this.blood_shape.graphics.drawRoundRect(0, 0, this.blood_width_radix * this.now_blood, this.blood_shape.height - 5, 20);
        this.blood_shape.graphics.endFill();
        this.HP_text_field.text = this.now_blood + "/" + this.max_blood;
    };
    return InfoPanel;
}(egret.Sprite));
__reflect(InfoPanel.prototype, "InfoPanel");
//# sourceMappingURL=InfoPanel.js.map