/**
 * 子弹事件
 */

class BulletEvent extends egret.Event{
    static CREATE_BULLET:string = "createBullet";
    
    constructor(type:string, bubbles:boolean=false, cancelable:boolean=false){
        super(type, bubbles, cancelable);
    }
}