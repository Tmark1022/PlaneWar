/**
 * Buff能量类
 * {1:子弹类型1, 2:子弹类型2, 3:子弹类型3, 4:护卫机Buff, 5:飞机生命}
 * test git
 */

class Power extends MovableBitMap{
    private speed:number;
    private move_right:boolean;
    public power_type:number;
    private texture_list:egret.Texture[];
    private now_index:number;
    private texture_timer:egret.Timer;

    /**创建陨石 */
    public static createPower(power_type:number):Power{
        if (GameData.powerCacheDict[power_type.toString()] == null)
            GameData.powerCacheDict[power_type.toString()] = [];
        
        let power_list:Power[] = GameData.powerCacheDict[power_type.toString()];
        if (power_list.length > 0)
            return power_list.pop();

        return new Power(power_type);
    }

    /**回收陨石 */
    public static reclaimPower(power_obj:Power):any{
        if (power_obj == null)
            return ;
        
        let power_type:number = power_obj.power_type;
        if(GameData.powerCacheDict[power_type.toString()] == null)
            GameData.powerCacheDict[power_type.toString()] = [];
        let power_list:Power[] = GameData.powerCacheDict[power_type.toString()];
        power_list.push(power_obj);
    }


    constructor(power_type:number){
        let texture_name_list:string[];

        switch(power_type){
            case 1: texture_name_list = ["power_json.power-bullet1-1", "power_json.power-bullet1-2", "power_json.power-bullet1-3", "power_json.power-bullet1-4"]; break;
            case 2: texture_name_list = ["power_json.power-bullet2-1", "power_json.power-bullet2-2", "power_json.power-bullet2-3", "power_json.power-bullet2-4"]; break;
            case 3: texture_name_list = ["power_json.power-bullet3-1", "power_json.power-bullet3-2", "power_json.power-bullet3-3", "power_json.power-bullet3-4"]; break;
            case 4: texture_name_list = ["power_json.bulletplane1", "power_json.bulletplane2", "power_json.bulletplane3", "power_json.bulletplane4"]; break;
            case 5: texture_name_list = ["power_json.power-blife"]; break;
        }

        super(texture_name_list[0]);

        this.speed = 2;
        this.move_right = true;
        this.power_type = power_type;
        this.texture_list = [];
        this.now_index = 0;
        this.texture_timer = new egret.Timer(200);

        this.scaleX = 1.3;
        this.scaleY = 1.3;

        for (let index:number = 0; index < texture_name_list.length; ++index){
            this.texture_list[index] = RES.getRes(texture_name_list[index]);
        }

        this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
        this.addEventListener(egret.Event.REMOVED_FROM_STAGE, this.removeFromStage, this);
        this.texture_timer.addEventListener(egret.TimerEvent.TIMER, this.changeTexture, this);
    }

    /**加入舞台 */
    private onAddToStage(evt:egret.Event):void{
        this.move_right = true;
        this.now_index = 0;
        this.texture = this.texture_list[this.now_index];
        this.texture_timer.start();

    }

        /**加入舞台 */
    private removeFromStage(evt:egret.Event):void{
        this.texture_timer.stop();
    }

    // 改变图形响应函数
    private changeTexture(evt:egret.TimerEvent):void{
        if (this.now_index + 1 >= this.texture_list.length)
            this.now_index = 0;
        else
            this.now_index += 1;
        this.texture = this.texture_list[this.now_index];
    
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
        if(GameData.fpsOffset == null)
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
    }

}
