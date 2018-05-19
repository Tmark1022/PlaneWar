/**
 * Buff能量类
 * {1:子弹类型1, 2:子弹类型2, 3:子弹类型3, 4:护卫机Buff, 5:飞机生命}
 * test git
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
var Power = (function (_super) {
    __extends(Power, _super);
    function Power(power_type) {
        var _this = this;
        var texture_name_list;
        switch (power_type) {
            case 1:
                texture_name_list = ["power_json.power-bullet1-1", "power_json.power-bullet1-2", "power_json.power-bullet1-3", "power_json.power-bullet1-4"];
                break;
            case 2:
                texture_name_list = ["power_json.power-bullet2-1", "power_json.power-bullet2-2", "power_json.power-bullet2-3", "power_json.power-bullet2-4"];
                break;
            case 3:
                texture_name_list = ["power_json.power-bullet3-1", "power_json.power-bullet3-2", "power_json.power-bullet3-3", "power_json.power-bullet3-4"];
                break;
            case 4:
                texture_name_list = ["power_json.bulletplane1", "power_json.bulletplane2", "power_json.bulletplane3", "power_json.bulletplane4"];
                break;
            case 5:
                texture_name_list = ["power_json.power-blife"];
                break;
        }
        _this = _super.call(this, texture_name_list[0]) || this;
        _this.speed = 2;
        _this.move_right = true;
        _this.power_type = power_type;
        _this.texture_list = [];
        _this.now_index = 0;
        _this.texture_timer = new egret.Timer(200);
        _this.scaleX = 1.3;
        _this.scaleY = 1.3;
        for (var index = 0; index < texture_name_list.length; ++index) {
            _this.texture_list[index] = RES.getRes(texture_name_list[index]);
        }
        _this.addEventListener(egret.Event.ADDED_TO_STAGE, _this.onAddToStage, _this);
        _this.addEventListener(egret.Event.REMOVED_FROM_STAGE, _this.removeFromStage, _this);
        _this.texture_timer.addEventListener(egret.TimerEvent.TIMER, _this.changeTexture, _this);
        return _this;
    }
    /**创建陨石 */
    Power.createPower = function (power_type) {
        if (GameData.powerCacheDict[power_type.toString()] == null)
            GameData.powerCacheDict[power_type.toString()] = [];
        var power_list = GameData.powerCacheDict[power_type.toString()];
        if (power_list.length > 0)
            return power_list.pop();
        return new Power(power_type);
    };
    /**回收陨石 */
    Power.reclaimPower = function (power_obj) {
        if (power_obj == null)
            return;
        var power_type = power_obj.power_type;
        if (GameData.powerCacheDict[power_type.toString()] == null)
            GameData.powerCacheDict[power_type.toString()] = [];
        var power_list = GameData.powerCacheDict[power_type.toString()];
        power_list.push(power_obj);
    };
    /**加入舞台 */
    Power.prototype.onAddToStage = function (evt) {
        this.move_right = true;
        this.now_index = 0;
        this.texture = this.texture_list[this.now_index];
        this.texture_timer.start();
    };
    /**离开舞台 */
    Power.prototype.removeFromStage = function (evt) {
        this.texture_timer.stop();
    };
    // 改变图形响应函数
    Power.prototype.changeTexture = function (evt) {
        if (this.now_index + 1 >= this.texture_list.length)
            this.now_index = 0;
        else
            this.now_index += 1;
        this.texture = this.texture_list[this.now_index];
    };
    /**
    * 是否超出显示区域
    */
    Power.prototype.isOutOfStage = function () {
        if (this.x < 0 || this.x > GameData.stageW || this.y < 0 || this.y > GameData.stageH)
            return true;
        else
            return false;
    };
    /**
     * 每帧移动轨迹
     */
    Power.prototype.moveByEnterFrame = function () {
        if (GameData.fpsOffset == null)
            return;
        if (this.x > GameData.stageW - this.width)
            this.move_right = false;
        if (this.x < this.width)
            this.move_right = true;
        if (this.move_right)
            this.x += this.speed / 2 * GameData.fpsOffset;
        else
            this.x -= this.speed / 2 * GameData.fpsOffset;
        this.y += this.speed * GameData.fpsOffset;
    };
    /**获得power，使power生效 */
    Power.prototype.powerWork = function (myplane) {
        if (myplane == null)
            return;
        switch (this.power_type) {
            case 1:
                {
                    // 平行子弹（基础）
                    if (myplane.bullet_type == 1) {
                        // 同种子弹，子弹升级
                        if (myplane.getBulletLevel() < 3)
                            myplane.setBulletLevel(myplane.getBulletLevel() + 1);
                        else {
                            // 已经满级就加分
                            GameData.Score += 100;
                            GameData.InfoPanelObj.updateScore();
                            var score_effect_obj = new ScoreEffect(this, 100);
                            GameData.GameAppObj.addChild(score_effect_obj);
                        }
                    }
                    else {
                        // 不同子弹就切换子弹类型
                        myplane.bullet_type = 1;
                    }
                }
                break;
            case 2:
                {
                    // 散弹
                    if (myplane.bullet_type == 2) {
                        // 同种子弹，子弹升级
                        if (myplane.getBulletLevel() < 3)
                            myplane.setBulletLevel(myplane.getBulletLevel() + 1);
                        else {
                            // 已经满级就加分
                            GameData.Score += 100;
                            GameData.InfoPanelObj.updateScore();
                            var score_effect_obj = new ScoreEffect(this, 100);
                            GameData.GameAppObj.addChild(score_effect_obj);
                        }
                    }
                    else {
                        // 不同子弹就切换子弹类型
                        myplane.bullet_type = 2;
                    }
                }
                break;
            case 3:
                {
                    // 激光炮
                    if (myplane.bullet_type == 3) {
                        // 同种子弹，子弹升级
                        if (myplane.getBulletLevel() < 3)
                            myplane.setBulletLevel(myplane.getBulletLevel() + 1);
                        else {
                            // 已经满级就加分
                            GameData.Score += 100;
                            GameData.InfoPanelObj.updateScore();
                            var score_effect_obj = new ScoreEffect(this, 100);
                            GameData.GameAppObj.addChild(score_effect_obj);
                        }
                    }
                    else {
                        // 不同子弹就切换子弹类型
                        myplane.bullet_type = 3;
                    }
                }
                break;
            case 4:
                {
                    // 护卫飞机
                    if (GameData.guardPlaneLeft == null) {
                        GameData.GameAppObj.createGuardPlane();
                    }
                    else {
                        // 已经创建就加分
                        GameData.Score += 100;
                        GameData.InfoPanelObj.updateScore();
                        var score_effect_obj = new ScoreEffect(this, 100);
                        GameData.GameAppObj.addChild(score_effect_obj);
                    }
                }
                break;
            case 5:
                {
                    // 加血
                    if (myplane.blood >= 100) {
                        // 满血， 加分
                        GameData.Score += 100;
                        GameData.InfoPanelObj.updateScore();
                        var score_effect_obj = new ScoreEffect(this, 100);
                        GameData.GameAppObj.addChild(score_effect_obj);
                    }
                    else {
                        var temp_blood = myplane.blood + 50;
                        if (temp_blood > 100)
                            myplane.blood = 100;
                        else
                            myplane.blood = temp_blood;
                        GameData.InfoPanelObj.updateBlood(myplane.blood);
                    }
                }
                break;
        }
    };
    return Power;
}(MovableBitMap));
__reflect(Power.prototype, "Power");
//# sourceMappingURL=Power.js.map