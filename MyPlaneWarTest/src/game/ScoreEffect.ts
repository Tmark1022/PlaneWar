/**
 * 得分特效
 */

class ScoreEffect extends egret.TextField{
    score:number;
    display_timer:egret.Timer;

    constructor(display_obj:egret.DisplayObject, score_temp:number){
        super();
        this.score = score_temp;
        this.display_timer = new egret.Timer(1000, 1);
        this.x = display_obj.x - 50;
        this.y = display_obj.y;
        this.size = 40;

        this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
    }

    private onAddToStage(evt:egret.Event):void{
        this.text = `+${this.score}`;

        this.display_timer.reset();
        this.display_timer.addEventListener(egret.TimerEvent.TIMER_COMPLETE, this.displayTimerComplete, this);
        this.display_timer.start();

    }

    private displayTimerComplete(evt:egret.TimerEvent):void{
        this.display_timer.stop();
        this.display_timer.removeEventListener(egret.TimerEvent.TIMER_COMPLETE, this.displayTimerComplete, this);
        GameData.GameAppObj.removeChild(this);
    }

}