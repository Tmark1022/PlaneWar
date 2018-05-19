/**
 * 得分特效
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
var ScoreEffect = (function (_super) {
    __extends(ScoreEffect, _super);
    function ScoreEffect(display_obj, score_temp) {
        var _this = _super.call(this) || this;
        _this.score = score_temp;
        _this.display_timer = new egret.Timer(1000, 1);
        _this.x = display_obj.x - 50;
        _this.y = display_obj.y;
        _this.size = 40;
        _this.addEventListener(egret.Event.ADDED_TO_STAGE, _this.onAddToStage, _this);
        return _this;
    }
    ScoreEffect.prototype.onAddToStage = function (evt) {
        this.text = "+" + this.score;
        this.display_timer.reset();
        this.display_timer.addEventListener(egret.TimerEvent.TIMER_COMPLETE, this.displayTimerComplete, this);
        this.display_timer.start();
    };
    ScoreEffect.prototype.displayTimerComplete = function (evt) {
        this.display_timer.stop();
        this.display_timer.removeEventListener(egret.TimerEvent.TIMER_COMPLETE, this.displayTimerComplete, this);
        GameData.GameAppObj.removeChild(this);
    };
    return ScoreEffect;
}(egret.TextField));
__reflect(ScoreEffect.prototype, "ScoreEffect");
//# sourceMappingURL=ScoreEffect.js.map