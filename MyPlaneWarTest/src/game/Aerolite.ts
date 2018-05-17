/**
 * 陨石类
 */

class Aerolite extends MovableBitMap{
    private speed:number;
    private move_right:boolean;
    public blood:number;

    /**创建陨石 */
    public static createAerolite(texture_name_temp:string):Aerolite{
        if (GameData.aeroliteCacheList.length > 0){
            let aerolite_list:Aerolite[] = GameData.aeroliteCacheList;
            for (let index:number = 0; index < aerolite_list.length; ++index)
            {
                let res_aerolite_obj:Aerolite = aerolite_list[index];
                if (res_aerolite_obj.getTextureName() == texture_name_temp)
                {
                    aerolite_list.splice(index, 1);
                    return res_aerolite_obj;
                }
            }
        }
        return new Aerolite(texture_name_temp);
    }

    /**回收陨石 */
    public static reclaimAerolite(aerolite_obj:Aerolite):any{
        if (aerolite_obj == null)
            return ;
        GameData.aeroliteCacheList.push(aerolite_obj);
    }

    constructor(texture_name_temp:string){
        super(texture_name_temp);

        this.speed = 1;
        this.move_right = true;
        this.blood = 100;

        this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
    }

    /**加入舞台 */
    private onAddToStage(evt:egret.Event):void{
        this.move_right = true;
        this.blood = 100;
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
        let temp_rotation:number = this.rotation += 1;
        if (this.rotation >= 180)
            this.rotation = temp_rotation - 360;
        else
            this.rotation = temp_rotation;
        
        if(GameData.fpsOffset == null)
            return;
        
        if (this.x > GameData.stageW - this.width)
            this.move_right = false;
        
        if (this.x < this.width)
            this.move_right = true;

        if (this.move_right)
            this.x += this.speed * GameData.fpsOffset;
        else
            this.x -= this.speed * GameData.fpsOffset;

        this.y += this.speed * GameData.fpsOffset;
    }



}