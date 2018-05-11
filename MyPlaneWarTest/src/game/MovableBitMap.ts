/**
 * 可移动bitmap类
 */
abstract class MovableBitMap extends egret.Bitmap{
    /**成员变量 */
    protected texture_name:string

    /**构造函数 */
    constructor (texture_name_temp:string, value?: egret.BitmapData | egret.Texture){
        super(value);
        this.texture_name = texture_name_temp;
        this.texture = RES.getRes(this.texture_name);
        this.anchorOffsetX = this.width / 2;
        this.anchorOffsetY = this.height / 2;
    }

    public getTextureName():string{
        return this.texture_name;
    }

    /**
     * 是否超出显示区域
     */
    public abstract isOutOfStage():boolean;

    /**
     * 每帧移动轨迹
     */
    public abstract moveByEnterFrame():any;

}