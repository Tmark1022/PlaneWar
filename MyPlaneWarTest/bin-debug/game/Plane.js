/**
 * 飞机类型
 * planeType{0:错误飞机类型, 1:我方主飞机, 2:我方护卫飞机, 3:敌方普通飞机1, 4:敌方普通飞机2, 5:敌方普通飞机3, 6:敌方普通飞机4, 7:Boss战机}
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
var PlaneBase = (function (_super) {
    __extends(PlaneBase, _super);
    /**成员变量 */
    function PlaneBase(plane_type, texture_name) {
        var _this = _super.call(this, texture_name) || this;
        _this.plane_type = plane_type; // 设置飞机类型
        // 初始化成员属性
        _this.speed = 1;
        _this.blood = 0;
        _this.blood_init = 0;
        _this.plane_score = 0;
        _this.fire_delay = 0;
        _this.fire_timer = null;
        _this.bullet_type = 1;
        _this.bullet_event = new BulletEvent(BulletEvent.CREATE_BULLET);
        _this.addEventListener(egret.Event.ADDED_TO_STAGE, _this.onAddToStage, _this);
        _this.addEventListener(egret.Event.REMOVED_FROM_STAGE, _this.onRemoveFromStage, _this);
        return _this;
    }
    // 加入舞台后自动开火
    PlaneBase.prototype.onAddToStage = function (evt) {
        // 初始化血量
        this.blood = this.blood_init;
        this.startFire();
    };
    // 离开舞台后制动停火
    PlaneBase.prototype.onRemoveFromStage = function (evt) {
        this.stopFire();
    };
    /**
     * 是否超出显示区域
     */
    PlaneBase.prototype.isOutOfStage = function () {
        if (this.x < 0 || this.x > GameData.stageW || this.y < 0 || this.y > GameData.stageH)
            return true;
        else
            return false;
    };
    /**
     * 每帧移动轨迹
     */
    PlaneBase.prototype.moveByEnterFrame = function () {
    };
    /**
     * 设置移动速度
     */
    PlaneBase.prototype.setSpeed = function (new_speed) {
        if (new_speed <= 0)
            return;
        this.speed = new_speed;
    };
    /**
     *  设置血量
     */
    PlaneBase.prototype.setBlood = function (new_blood) {
        this.blood = new_blood;
    };
    /**
     * 开火
     */
    PlaneBase.prototype.startFire = function () {
        if (this.fire_timer == null) {
            console.log(this.texture_name + '还没有初始化计时器就开火了');
            return;
        }
        this.fire_timer.addEventListener(egret.TimerEvent.TIMER, this.createBullet, this);
        this.fire_timer.start();
    };
    /**
     * 停火
     */
    PlaneBase.prototype.stopFire = function () {
        if (this.fire_timer == null)
            return;
        this.fire_timer.removeEventListener(egret.TimerEvent.TIMER, this.createBullet, this);
        this.fire_timer.stop();
    };
    // 定时创建子弹响应函数
    PlaneBase.prototype.createBullet = function (evt) {
        this.dispatchEvent(this.bullet_event);
    };
    return PlaneBase;
}(MovableBitMap));
__reflect(PlaneBase.prototype, "PlaneBase");
/**我的飞机 */
var MyPlane = (function (_super) {
    __extends(MyPlane, _super);
    function MyPlane(plane_type, texture_name) {
        var _this = _super.call(this, plane_type, texture_name) || this;
        if (MyPlane.planeClassType != plane_type) {
            console.log('类MyPlane初始化时飞机类型校验不成功' + MyPlane.planeClassType + "!= " + plane_type);
        }
        // 初始化变量
        // this.speed = 1;  不需要speed因为我的战机是我自己控制的。
        _this.blood_init = 100;
        _this.plane_score = 0;
        _this.blood = _this.blood_init;
        _this.fire_delay = 300;
        _this.fire_timer = new egret.Timer(_this.fire_delay);
        _this.bullet_type = 1;
        _this.bullet_level = 1; // 子弹等级
        _this.hurt_show_timer = new egret.Timer(1500 / 18, 18);
        _this.is_in_hurt = false;
        return _this;
    }
    MyPlane.prototype.onAddToStage = function (evt) {
        // 设置加入舞台后的初始位置
        this.x = GameData.stageW / 2;
        this.y = GameData.stageH - this.width;
        this.touchEnabled = true;
        this.bullet_level = 1; // 子弹等级
        this.bullet_type = 1; // 初始化子弹类型
        this.blood = this.blood_init; // 初始化血量
        this.startFire();
        this.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.startTouchMove, this);
        this.addEventListener(egret.TouchEvent.TOUCH_END, this.stopTouchMove, this);
        this.hurt_show_timer.reset();
        this.is_in_hurt = false;
        this.hurt_show_timer.addEventListener(egret.TimerEvent.TIMER, this.hurtShowFunc, this);
        this.hurt_show_timer.addEventListener(egret.TimerEvent.TIMER_COMPLETE, this.hurtShowCompleteFunc, this);
    };
    MyPlane.prototype.onRemoveFromStage = function (evt) {
        this.touchEnabled = false;
        this.stopFire();
        this.removeEventListener(egret.TouchEvent.TOUCH_BEGIN, this.startTouchMove, this);
        this.removeEventListener(egret.TouchEvent.TOUCH_END, this.stopTouchMove, this);
        this.hurt_show_timer.removeEventListener(egret.TimerEvent.TIMER, this.hurtShowFunc, this);
        this.hurt_show_timer.removeEventListener(egret.TimerEvent.TIMER_COMPLETE, this.hurtShowCompleteFunc, this);
    };
    /**开始触摸 */
    MyPlane.prototype.startTouchMove = function (evt) {
        this.offsetX = evt.stageX - this.x;
        this.offsetY = evt.stageY - this.y;
        this.stage.addEventListener(egret.TouchEvent.TOUCH_MOVE, this.touchMoveFunc, this);
    };
    /**移动相应函数 */
    MyPlane.prototype.touchMoveFunc = function (evt) {
        // 需要考虑显示边界
        var tempx = evt.stageX - this.offsetX;
        if (tempx < this.width / 2)
            this.x = this.width / 2;
        else if (tempx > GameData.stageW - this.width / 2)
            this.x = GameData.stageW - this.width / 2;
        else
            this.x = tempx;
        var tempy = evt.stageY - this.offsetY;
        if (tempy < this.height / 2)
            this.y = this.height / 2;
        else if (tempy > GameData.stageH - this.height / 2)
            this.y = GameData.stageH - this.height / 2;
        else
            this.y = tempy;
        // 有护卫机， 护卫机也要跟着位移
        if (GameData.guardPlaneLeft != null) {
            var guard_plane_left = GameData.guardPlaneLeft;
            guard_plane_left.x = this.x - guard_plane_left.space_width;
            guard_plane_left.y = this.y;
        }
        if (GameData.guardPlaneRight != null) {
            var guard_plane_right = GameData.guardPlaneRight;
            guard_plane_right.x = this.x + guard_plane_right.space_width;
            guard_plane_right.y = this.y;
        }
    };
    /**结束触摸 */
    MyPlane.prototype.stopTouchMove = function (evt) {
        this.stage.removeEventListener(egret.TouchEvent.TOUCH_MOVE, this.touchMoveFunc, this);
    };
    /**获取弹药等级 */
    MyPlane.prototype.getBulletLevel = function () {
        return this.bullet_level;
    };
    /**设置弹药等级 */
    MyPlane.prototype.setBulletLevel = function (new_level) {
        if (new_level <= 0 || new_level > 3)
            return;
        this.bullet_level = new_level;
    };
    /**受到伤害响应函数 */
    MyPlane.prototype.hurtShowFunc = function (evt) {
        if (this.alpha == 1)
            this.alpha = 0.2;
        else
            this.alpha = 1;
    };
    /**受到伤害完成响应函数 */
    MyPlane.prototype.hurtShowCompleteFunc = function (evt) {
        this.alpha = 1;
        this.hurtStop();
    };
    /**开始伤害 */
    MyPlane.prototype.hurtStart = function () {
        if (this.is_in_hurt)
            return;
        this.hurt_show_timer.start();
        this.is_in_hurt = true;
        var hurt_sound = RES.getRes("plane_bomb_mp3");
        var channel = hurt_sound.play(0, 1);
        channel.volume = 0.8;
    };
    /**结束伤害 */
    MyPlane.prototype.hurtStop = function () {
        this.hurt_show_timer.stop();
        this.is_in_hurt = false;
        this.hurt_show_timer.reset();
    };
    /**是否在伤害特效中 */
    MyPlane.prototype.isInHurt = function () {
        return this.is_in_hurt;
    };
    MyPlane.planeClassType = 1; // 飞机类型校验
    return MyPlane;
}(PlaneBase));
__reflect(MyPlane.prototype, "MyPlane");
/**护卫飞机 */
var GuardPlane = (function (_super) {
    __extends(GuardPlane, _super);
    function GuardPlane(plane_type, texture_name) {
        var _this = _super.call(this, plane_type, texture_name) || this;
        if (GuardPlane.planeClassType != plane_type) {
            console.log('类GuardPlane初始化时飞机类型校验不成功' + GuardPlane.planeClassType + "!= " + plane_type);
        }
        // 初始化变量
        _this.blood_init = 0;
        _this.plane_score = 0;
        _this.blood = _this.blood_init;
        _this.fire_delay = 500;
        _this.fire_timer = new egret.Timer(_this.fire_delay);
        _this.bullet_type = 1;
        // 护卫飞机独有成员属性
        _this.space_width = 60;
        // bitmap纹理调整
        _this.scaleX = 0.7;
        _this.scaleY = 0.7;
        return _this;
    }
    GuardPlane.planeClassType = 2; // 飞机类型校验
    return GuardPlane;
}(PlaneBase));
__reflect(GuardPlane.prototype, "GuardPlane");
/**普通敌机1 */
var NormalPlane1 = (function (_super) {
    __extends(NormalPlane1, _super);
    function NormalPlane1(plane_type, texture_name) {
        var _this = _super.call(this, plane_type, texture_name) || this;
        if (NormalPlane1.planeClassType != plane_type) {
            console.log('类NormalPlane1初始化时飞机类型校验不成功' + NormalPlane1.planeClassType + "!= " + plane_type);
        }
        // 初始化变量
        _this.speed = 4;
        _this.blood_init = 20;
        _this.plane_score = 10;
        _this.blood = _this.blood_init;
        _this.fire_delay = 900;
        _this.fire_timer = new egret.Timer(_this.fire_delay);
        _this.bullet_type = 4; // 修改子弹类型
        return _this;
    }
    /**
     * 每帧移动轨迹
     */
    NormalPlane1.prototype.moveByEnterFrame = function () {
        if (GameData.fpsOffset == null)
            return;
        this.y += this.speed * GameData.fpsOffset;
    };
    NormalPlane1.planeClassType = 3; // 飞机类型校验
    return NormalPlane1;
}(PlaneBase));
__reflect(NormalPlane1.prototype, "NormalPlane1");
/**普通敌机2 */
var NormalPlane2 = (function (_super) {
    __extends(NormalPlane2, _super);
    function NormalPlane2(plane_type, texture_name) {
        var _this = _super.call(this, plane_type, texture_name) || this;
        if (NormalPlane2.planeClassType != plane_type) {
            console.log('类NormalPlane2初始化时飞机类型校验不成功' + NormalPlane2.planeClassType + "!= " + plane_type);
        }
        // 初始化变量
        _this.speed = 4;
        _this.blood_init = 20;
        _this.plane_score = 10;
        _this.blood = _this.blood_init;
        _this.fire_delay = 900;
        _this.fire_timer = new egret.Timer(_this.fire_delay);
        _this.bullet_type = 5; // 修改子弹类型
        return _this;
    }
    /**
     * 每帧移动轨迹
     */
    NormalPlane2.prototype.moveByEnterFrame = function () {
        if (GameData.fpsOffset == null)
            return;
        this.y += this.speed * GameData.fpsOffset;
    };
    NormalPlane2.planeClassType = 4; // 飞机类型校验
    return NormalPlane2;
}(PlaneBase));
__reflect(NormalPlane2.prototype, "NormalPlane2");
/**普通敌机3 */
var NormalPlane3 = (function (_super) {
    __extends(NormalPlane3, _super);
    function NormalPlane3(plane_type, texture_name) {
        var _this = _super.call(this, plane_type, texture_name) || this;
        _this.move_right = true;
        _this.move_down = true;
        if (NormalPlane3.planeClassType != plane_type) {
            console.log('类NormalPlane3初始化时飞机类型校验不成功' + NormalPlane3.planeClassType + "!= " + plane_type);
        }
        // 初始化变量
        _this.speed = 2;
        _this.blood_init = 250;
        _this.plane_score = 100;
        _this.blood = _this.blood_init;
        _this.fire_delay = 800;
        _this.fire_timer = new egret.Timer(_this.fire_delay);
        _this.bullet_type = 6; // 修改子弹类型
        _this.scaleX = 2;
        _this.scaleY = 2;
        return _this;
    }
    /**
     * 每帧移动轨迹
     */
    NormalPlane3.prototype.moveByEnterFrame = function () {
        if (GameData.fpsOffset == null)
            return;
        if (this.x > GameData.stageW - this.width)
            this.move_right = false;
        if (this.x < this.width)
            this.move_right = true;
        if (this.move_right)
            this.x += this.speed * 2 * GameData.fpsOffset;
        else
            this.x -= this.speed * 2 * GameData.fpsOffset;
        if (this.y > GameData.stageH - this.width)
            this.move_down = false;
        if (this.move_down == true)
            this.y += this.speed * GameData.fpsOffset;
        else
            this.y -= this.speed * 1.5 * GameData.fpsOffset;
    };
    // 加入舞台后自动开火
    NormalPlane3.prototype.onAddToStage = function (evt) {
        // 初始化血量
        this.blood = this.blood_init;
        this.move_right = true;
        this.move_down = true;
        this.startFire();
    };
    NormalPlane3.planeClassType = 5; // 飞机类型校验
    return NormalPlane3;
}(PlaneBase));
__reflect(NormalPlane3.prototype, "NormalPlane3");
/**普通敌机4 */
var NormalPlane4 = (function (_super) {
    __extends(NormalPlane4, _super);
    function NormalPlane4(plane_type, texture_name) {
        var _this = _super.call(this, plane_type, texture_name) || this;
        if (NormalPlane4.planeClassType != plane_type) {
            console.log('类NormalPlane4初始化时飞机类型校验不成功' + NormalPlane4.planeClassType + "!= " + plane_type);
        }
        // 初始化变量
        _this.speed = 0.5;
        _this.blood_init = 500;
        _this.plane_score = 100;
        _this.blood = _this.blood_init;
        _this.fire_delay = 1000;
        _this.fire_timer = new egret.Timer(_this.fire_delay);
        _this.bullet_type = 7; // 修改子弹类型
        _this.scaleX = 2;
        _this.scaleY = 2;
        return _this;
    }
    /**
     * 每帧移动轨迹
     */
    NormalPlane4.prototype.moveByEnterFrame = function () {
        if (GameData.fpsOffset == null)
            return;
        // 跟踪我的飞机的飞行轨迹
        if (GameData.myPlane != null) {
            if (GameData.myPlane.x > this.x) {
                // 往右移动
                var tempx = this.x + this.speed * 3 * GameData.fpsOffset;
                if (tempx > GameData.stageW - this.width)
                    this.x = GameData.stageW - this.width;
                else
                    this.x = tempx;
            }
            else {
                // 往左移动
                var tempx = this.x - this.speed * 3 * GameData.fpsOffset;
                if (tempx < this.width)
                    this.x = this.width;
                else
                    this.x = tempx;
            }
        }
        this.y += this.speed * GameData.fpsOffset;
    };
    NormalPlane4.planeClassType = 6; // 飞机类型校验
    return NormalPlane4;
}(PlaneBase));
__reflect(NormalPlane4.prototype, "NormalPlane4");
/**Boss战机 */
var BossPlane = (function (_super) {
    __extends(BossPlane, _super);
    function BossPlane(plane_type, texture_name) {
        var _this = _super.call(this, plane_type, texture_name) || this;
        if (BossPlane.planeClassType != plane_type) {
            console.log('类BossPlane初始化时飞机类型校验不成功' + BossPlane.planeClassType + "!= " + plane_type);
        }
        // 初始化变量
        _this.speed = 1;
        _this.blood_init = 5000;
        _this.plane_score = 1000;
        _this.blood = _this.blood_init;
        _this.fire_delay = 400;
        _this.fire_timer = new egret.Timer(_this.fire_delay);
        _this.bullet_type = 7; // 修改子弹类型
        return _this;
    }
    /**
     * 每帧移动轨迹
     */
    BossPlane.prototype.moveByEnterFrame = function () {
        if (GameData.fpsOffset == null)
            return;
        if (this.x > GameData.stageW - this.width / 2)
            this.move_right = false;
        if (this.x < this.width / 2)
            this.move_right = true;
        if (this.move_right)
            this.x += this.speed * 5 * GameData.fpsOffset;
        else
            this.x -= this.speed * 5 * GameData.fpsOffset;
        if (this.y > GameData.stageH / 2)
            this.move_down = false;
        if (this.y < this.width / 3)
            this.move_down = true;
        if (this.move_down == true)
            this.y += this.speed * GameData.fpsOffset;
        else
            this.y -= this.speed * 2 * GameData.fpsOffset;
    };
    // 加入舞台后自动开火
    BossPlane.prototype.onAddToStage = function (evt) {
        // 初始化血量
        this.blood = this.blood_init;
        this.move_right = true;
        this.move_down = true;
        this.startFire();
    };
    BossPlane.planeClassType = 7; // 飞机类型校验
    return BossPlane;
}(PlaneBase));
__reflect(BossPlane.prototype, "BossPlane");
//# sourceMappingURL=Plane.js.map