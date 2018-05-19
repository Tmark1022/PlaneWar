/**
 * 飞机类型
 * planeType{0:错误飞机类型, 1:我方主飞机, 2:我方护卫飞机, 3:敌方普通飞机1, 4:敌方普通飞机2, 5:敌方普通飞机3, 6:敌方普通飞机4, 7:Boss战机}
 */

class PlaneBase extends MovableBitMap{
    /**成员变量 */
    plane_type:number;          // 飞机类型
    speed:number;               // 速度
    blood:number;               // 剩余血量
    protected blood_init:number;          // 初始血量
    protected blood_increase:number;      // 初始血量增幅

    plane_score:number;         // 飞机分数
    fire_delay:number;          // 开火间隔
    fire_timer:egret.Timer;     // 开火计时器
    bullet_type:number;         // 子弹类型
    bullet_event:BulletEvent;   // 发送子弹事件

    /**成员变量 */
    constructor(plane_type, texture_name){
        super(texture_name);
        this.plane_type = plane_type;           // 设置飞机类型

        // 初始化成员属性
        this.speed = 1;
        this.blood_init = 0;
        this.blood_increase = 0;
        this.blood = 0;
        this.plane_score = 0;
        this.fire_delay = 0;
        this.fire_timer = null;
        this.bullet_type = 1;
        this.bullet_event = new BulletEvent(BulletEvent.CREATE_BULLET);


        this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
        this.addEventListener(egret.Event.REMOVED_FROM_STAGE, this.onRemoveFromStage, this);
    }

    // 加入舞台后自动开火
    protected onAddToStage(evt:egret.Event):void{
        // 初始化血量
        this.blood = this.blood_init + (GameData.MissionId - 1) * this.blood_increase;
        this.startFire();
    }

    // 离开舞台后制动停火
    protected onRemoveFromStage(evt:egret.Event):void{
        this.stopFire();
    }

    /**
     * 是否超出显示区域
     */
    public isOutOfStage():boolean{
        if (this.x < 0 || this.x > GameData.stageW || this.y < 0 || this.y > GameData.stageH)
            return true;
        else
            return false;
    }

    /**
     * 每帧移动轨迹
     */
    public moveByEnterFrame():any{
    }

    /**
     * 设置移动速度
     */
    public setSpeed(new_speed:number):any{
        if (new_speed <= 0)
            return ;
        this.speed = new_speed;
    }

    /**
     *  设置血量
     */
    public setBlood(new_blood):any{
        this.blood = new_blood;
    }

    /**
     * 开火
     */
    public startFire():any{
        if (this.fire_timer == null){
            console.log(this.texture_name + '还没有初始化计时器就开火了');
            return;
        }
        this.fire_timer.addEventListener(egret.TimerEvent.TIMER, this.createBullet, this);
        this.fire_timer.start();
    }

    /**
     * 停火
     */
    public stopFire():any{
        if (this.fire_timer == null)
            return;
        this.fire_timer.removeEventListener(egret.TimerEvent.TIMER, this.createBullet, this);
        this.fire_timer.stop();
    }

    // 定时创建子弹响应函数
    private createBullet(evt:egret.TimerEvent):void{
        this.dispatchEvent(this.bullet_event);
    }

}

/**我的飞机 */
class MyPlane extends PlaneBase{
    static readonly planeClassType = 1;                 // 飞机类型校验
    private offsetX:number;
    private offsetY:number;
    private bullet_level:number;
    private hurt_show_timer:egret.Timer;                // 伤害特效计时器
    private is_in_hurt:boolean;                         // 正在受到伤害中

    constructor(plane_type:number, texture_name:string){
        super(plane_type, texture_name);
        if (MyPlane.planeClassType != plane_type){
            console.log('类MyPlane初始化时飞机类型校验不成功' + MyPlane.planeClassType + "!= " + plane_type);
        }
        // 初始化变量
        // this.speed = 1;  不需要speed因为我的战机是我自己控制的。
        this.blood_init = 100;
        this.blood_increase = 0;
        this.plane_score = 0;
        this.blood = this.blood_init + (GameData.MissionId - 1) * this.blood_increase;
        this.fire_delay = 300;
        this.fire_timer = new egret.Timer(this.fire_delay);
        this.bullet_type = 1;
        this.bullet_level = 1;              // 子弹等级

        this.hurt_show_timer = new egret.Timer(1500 / 18, 18);
        this.is_in_hurt = false;
     }

    protected onAddToStage(evt:egret.Event):void{
        // 设置加入舞台后的初始位置
        this.x = GameData.stageW / 2;
        this.y = GameData.stageH - this.width;
        this.touchEnabled = true;
        this.bullet_level = 1;              // 子弹等级
        this.bullet_type = 1;               // 初始化子弹类型
        
        this.blood = this.blood_init + (GameData.MissionId - 1) * this.blood_increase;       // 初始化血量
        this.startFire();

        this.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.startTouchMove, this);
        this.addEventListener(egret.TouchEvent.TOUCH_END, this.stopTouchMove, this);

        this.hurt_show_timer.reset();
        this.is_in_hurt = false;
        this.hurt_show_timer.addEventListener(egret.TimerEvent.TIMER, this.hurtShowFunc, this)
        this.hurt_show_timer.addEventListener(egret.TimerEvent.TIMER_COMPLETE, this.hurtShowCompleteFunc, this)
    }

    protected onRemoveFromStage(evt:egret.Event):void{
        this.touchEnabled = false;
        this.stopFire();
        this.removeEventListener(egret.TouchEvent.TOUCH_BEGIN, this.startTouchMove, this);
        this.removeEventListener(egret.TouchEvent.TOUCH_END, this.stopTouchMove, this);

        this.hurt_show_timer.removeEventListener(egret.TimerEvent.TIMER, this.hurtShowFunc, this)
        this.hurt_show_timer.removeEventListener(egret.TimerEvent.TIMER_COMPLETE, this.hurtShowCompleteFunc, this)
    }

    /**开始触摸 */
    public startTouchMove(evt:egret.TouchEvent):void{
        this.offsetX = evt.stageX - this.x;
        this.offsetY = evt.stageY - this.y;
        this.stage.addEventListener(egret.TouchEvent.TOUCH_MOVE, this.touchMoveFunc, this);
    }

    /**移动相应函数 */
    private touchMoveFunc(evt:egret.TouchEvent):void{
        // 需要考虑显示边界
        let tempx:number = evt.stageX - this.offsetX;
        if (tempx < this.width / 2)
            this.x = this.width / 2;
        else if(tempx > GameData.stageW - this.width / 2)
            this.x = GameData.stageW - this.width / 2;
        else
            this.x = tempx;
        
        let tempy:number = evt.stageY - this.offsetY;
        if (tempy < this.height / 2)
            this.y = this.height / 2;
        else if(tempy > GameData.stageH - this.height / 2)
            this.y = GameData.stageH - this.height / 2;
        else
            this.y = tempy;
        
        // 有护卫机， 护卫机也要跟着位移
        if (GameData.guardPlaneLeft != null)
        {
            let guard_plane_left:GuardPlane = GameData.guardPlaneLeft;
            guard_plane_left.x = this.x - guard_plane_left.space_width;
            guard_plane_left.y = this.y;
        }
        if (GameData.guardPlaneRight != null)
        {
            let guard_plane_right:GuardPlane = GameData.guardPlaneRight;
            guard_plane_right.x = this.x + guard_plane_right.space_width;
            guard_plane_right.y = this.y;
        }
    }

    /**结束触摸 */
    public stopTouchMove(evt:egret.TouchEvent):void{
        this.stage.removeEventListener(egret.TouchEvent.TOUCH_MOVE, this.touchMoveFunc, this);
    }

    /**获取弹药等级 */
    public getBulletLevel():number{
        return this.bullet_level;
    }

    /**设置弹药等级 */
    public setBulletLevel(new_level:number):any{
        if (new_level <= 0 || new_level > 3)
            return ;
        this.bullet_level = new_level;
    }

    /**受到伤害响应函数 */
    private hurtShowFunc(evt:egret.TimerEvent):void{
        if (this.alpha == 1)
            this.alpha = 0.2;
        else
            this.alpha = 1;
    }

    /**受到伤害完成响应函数 */
    private hurtShowCompleteFunc(evt:egret.TimerEvent):void{
        this.alpha = 1;
        this.hurtStop();
    }

    /**开始伤害 */
    public hurtStart():any{
        if (this.is_in_hurt)
            return ;
        this.hurt_show_timer.start();
        this.is_in_hurt = true;
        let hurt_sound:egret.Sound = RES.getRes("plane_bomb_mp3");
        let channel:egret.SoundChannel = hurt_sound.play(0 ,1);
        channel.volume = 0.8;
    }

    /**结束伤害 */
    private hurtStop():any{
        this.hurt_show_timer.stop();
        this.is_in_hurt = false;
        this.hurt_show_timer.reset();
    }

    /**是否在伤害特效中 */
    public isInHurt():boolean{
        return this.is_in_hurt;
    }


}

/**护卫飞机 */
class GuardPlane extends PlaneBase{
    static readonly planeClassType = 2;                 // 飞机类型校验

    space_width:number;                                 // 与主战机的间隔

    constructor(plane_type, texture_name){
        super(plane_type, texture_name);
         if (GuardPlane.planeClassType != plane_type){
            console.log('类GuardPlane初始化时飞机类型校验不成功' + GuardPlane.planeClassType + "!= " + plane_type);
        }
        // 初始化变量
        this.blood_init = 0;
        this.blood_increase = 0;
        this.plane_score = 0;
        this.blood = this.blood_init + (GameData.MissionId - 1) * this.blood_increase;
        this.fire_delay = 500;
        this.fire_timer = new egret.Timer(this.fire_delay);
        this.bullet_type = 1;

        // 护卫飞机独有成员属性
        this.space_width = 60
        
        // bitmap纹理调整
        this.scaleX = 0.7;
        this.scaleY = 0.7;
    }
}

/**普通敌机1 */
class NormalPlane1 extends PlaneBase{
    static readonly planeClassType = 3;                 // 飞机类型校验
    constructor(plane_type, texture_name){
        super(plane_type, texture_name);
         if (NormalPlane1.planeClassType != plane_type){
            console.log('类NormalPlane1初始化时飞机类型校验不成功' + NormalPlane1.planeClassType + "!= " + plane_type);
        }
        // 初始化变量
        this.speed = 4;
        this.blood_init = 20;
        this.blood_increase = 5;
        this.plane_score = 10;
        this.blood = this.blood_init + (GameData.MissionId - 1) * this.blood_increase;
        this.fire_delay = 900;
        this.fire_timer = new egret.Timer(this.fire_delay);
        this.bullet_type = 4;                           // 修改子弹类型
    }

    /**
     * 每帧移动轨迹
     */
    public moveByEnterFrame():any{
        if(GameData.fpsOffset == null)
            return;
        this.y += this.speed * GameData.fpsOffset;
    }
}

/**普通敌机2 */
class NormalPlane2 extends PlaneBase{
    static readonly planeClassType = 4;                 // 飞机类型校验
    constructor(plane_type, texture_name){
        super(plane_type, texture_name);
         if (NormalPlane2.planeClassType != plane_type){
            console.log('类NormalPlane2初始化时飞机类型校验不成功' + NormalPlane2.planeClassType + "!= " + plane_type);
        }
        // 初始化变量
        this.speed = 4;
        this.blood_init = 20;
        this.blood_increase = 5;
        this.plane_score = 10;
        this.blood = this.blood_init + (GameData.MissionId - 1) * this.blood_increase;
        this.fire_delay = 900;
        this.fire_timer = new egret.Timer(this.fire_delay);
        this.bullet_type = 5;                           // 修改子弹类型
    }

    /**
     * 每帧移动轨迹
     */
    public moveByEnterFrame():any{
        if(GameData.fpsOffset == null)
            return;
        this.y += this.speed * GameData.fpsOffset;
    }
}

/**普通敌机3 */
class NormalPlane3 extends PlaneBase{
    static readonly planeClassType = 5;                 // 飞机类型校验

    private move_right:boolean = true;
    private move_down:boolean = true;

    constructor(plane_type, texture_name){
        super(plane_type, texture_name);
         if (NormalPlane3.planeClassType != plane_type){
            console.log('类NormalPlane3初始化时飞机类型校验不成功' + NormalPlane3.planeClassType + "!= " + plane_type);
        }
        // 初始化变量
        this.speed = 2;
        this.blood_init = 200;
        this.blood_increase = 50;
        this.plane_score = 100;
        this.blood = this.blood_init + (GameData.MissionId - 1) * this.blood_increase;
        this.fire_delay = 800;
        this.fire_timer = new egret.Timer(this.fire_delay);
        this.bullet_type = 6;                           // 修改子弹类型

        this.scaleX = 2;
        this.scaleY = 2;
    }

    /**
     * 每帧移动轨迹
     */
    public moveByEnterFrame():any{
        if(GameData.fpsOffset == null)
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
            this.y -= this.speed * 1.5 * GameData.fpsOffset
    }

    // 加入舞台后自动开火
    protected onAddToStage(evt:egret.Event):void{
        // 初始化血量
        this.blood = this.blood_init + (GameData.MissionId - 1) * this.blood_increase;
        this.move_right = true;
        this.move_down = true;
        this.startFire();
    }
}

/**普通敌机4 */
class NormalPlane4 extends PlaneBase{
    static readonly planeClassType = 6;                 // 飞机类型校验
    constructor(plane_type, texture_name){
        super(plane_type, texture_name);
         if (NormalPlane4.planeClassType != plane_type){
            console.log('类NormalPlane4初始化时飞机类型校验不成功' + NormalPlane4.planeClassType + "!= " + plane_type);
        }
        // 初始化变量
        this.speed = 0.5;
        this.blood_init = 400;
        this.blood_increase = 100;
        this.plane_score = 100;
        this.blood = this.blood_init + (GameData.MissionId - 1) * this.blood_increase;
        this.fire_delay = 1000;
        this.fire_timer = new egret.Timer(this.fire_delay);
        this.bullet_type = 7;                           // 修改子弹类型

        this.scaleX = 2;
        this.scaleY = 2;
    }

    /**
     * 每帧移动轨迹
     */
    public moveByEnterFrame():any{
        if(GameData.fpsOffset == null)
            return;

        // 跟踪我的飞机的飞行轨迹
        if (GameData.myPlane != null)
        {
            if (GameData.myPlane.x > this.x){
                // 往右移动
                let tempx = this.x + this.speed * 3 * GameData.fpsOffset
                if (tempx > GameData.stageW - this.width)
                    this.x = GameData.stageW - this.width;
                else
                    this.x = tempx;
            }
            else{
                // 往左移动
                 let tempx = this.x - this.speed * 3 * GameData.fpsOffset
                if (tempx < this.width)
                    this.x = this.width;
                else
                    this.x = tempx;
            } 
        }
        this.y += this.speed * GameData.fpsOffset;
    }
}

/**Boss战机 */
class BossPlane extends PlaneBase{
    static readonly planeClassType = 7;                 // 飞机类型校验
    move_right:boolean;
    move_down:boolean;
    constructor(plane_type, texture_name){
        super(plane_type, texture_name);
         if (BossPlane.planeClassType != plane_type){
            console.log('类BossPlane初始化时飞机类型校验不成功' + BossPlane.planeClassType + "!= " + plane_type);
        }
        // 初始化变量
        this.speed = 1;
        this.blood_init = 5000;
        this.blood_increase = 1000;
        this.plane_score = 1000;
        this.blood = this.blood_init + (GameData.MissionId - 1) * this.blood_increase;
        this.fire_delay = 400;
        this.fire_timer = new egret.Timer(this.fire_delay);
        this.bullet_type = 7;                           // 修改子弹类型
    }

    /**
     * 每帧移动轨迹
     */
    public moveByEnterFrame():any{
        if(GameData.fpsOffset == null)
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
            this.y -= this.speed * 2 * GameData.fpsOffset
    }

    // 加入舞台后自动开火
    protected onAddToStage(evt:egret.Event):void{
        // 初始化血量
        this.blood = this.blood_init + (GameData.MissionId - 1) * this.blood_increase;
        this.move_right = true;
        this.move_down = true;
        this.startFire();
    }
}
