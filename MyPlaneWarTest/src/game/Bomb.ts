/**
 * 爆炸特效
 */
class Bomb extends egret.Bitmap{
    texture_list:egret.Texture[];               // 纹理列表
    now_index:number;
    change_texture_timer:egret.Timer;
    sound_music:egret.Sound;
    
    public static createBomb():Bomb{
        if (GameData.BombCacheList.length > 0)
            return GameData.BombCacheList.pop();

        return new Bomb();
    }

    constructor(){
        super();

        // 初始化成员属性
        this.texture_list = [];
        for(let index:number = 0; index < 23; ++index){
            this.texture_list[index] = RES.getRes("explo_json.explo_m" + index.toString());
        }
        this.now_index = 0;
        this.change_texture_timer = new egret.Timer(1000 / 24, 24);
        this.sound_music = RES.getRes("explo_mp3");

        this.scaleX = 1.3;
        this.scaleY = 1.3;
        this.anchorOffsetX = this.width / 2;
        this.anchorOffsetY = this.height / 2;

        this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
        this.addEventListener(egret.Event.REMOVED_FROM_STAGE, this.removeFromStage, this);
        this.change_texture_timer.addEventListener(egret.TimerEvent.TIMER, this.changeTextureFunc, this);
        this.change_texture_timer.addEventListener(egret.TimerEvent.TIMER_COMPLETE, this.changeTextureCompleteFunc, this);

    }

    /**加入舞台 */
    private onAddToStage(evt:egret.Event):void{
        this.now_index = 0;
        this.texture = this.texture_list[this.now_index];
        this.change_texture_timer.reset();              // 重置计时计数
        this.change_texture_timer.start();
        this.sound_music.play(0, 1);
    }

    /**从舞台删除 */
    private removeFromStage(evt:egret.Event):void{
        GameData.BombCacheList.push(this);
    }

    /**更改纹理响应函数 */
    private changeTextureFunc(evt:egret.TimerEvent):void{
        this.texture = this.texture_list[this.now_index++];
    }

    /**完成播放响应函数 */
    private changeTextureCompleteFunc(evt:egret.TimerEvent):void{
        this.change_texture_timer.stop();
        // 从舞台中删除
        GameData.GameAppObj.removeChild(this); 
    }
}