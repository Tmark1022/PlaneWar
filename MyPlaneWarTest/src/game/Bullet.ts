/**
 * 子弹类
 * 子弹类型{1:我的普通子弹, 2:我的五连发子弹, 3:我的激光子弹, 4:敌人子弹1，5:敌人子弹2, 6:敌人子弹3, 7:敌人子弹4}
 */

class Bullet extends MovableBitMap{
    private bullet_type:number;                         // 子弹类型
    private vertical_speed:number;                      // 子弹垂直速度（正数往下移动， 负数往上移动）
    private horizontal_speed:number;                    // 子弹水平速度（正数往右移动， 负数往左移动）
    damage_init:number;                                 // 子弹初始伤害
    damage:number;                                      // 子弹伤害

    /**
     * 静态成员函数
     */
    /**创建子弹 */
    static createBullet(bullet_type_temp:number, texture_index?:number):Bullet{
        let bullet_obj:Bullet;
        bullet_obj = Bullet.getBulletObjFromCache(bullet_type_temp, texture_index);
        if (bullet_obj == null)
            bullet_obj = new Bullet(bullet_type_temp, texture_index);
        return bullet_obj;
    }

    /**从缓存里边获得对象 */
    static getBulletObjFromCache(bullet_type_temp:number, texture_index?:number):Bullet{
        let res_bullet_obj:Bullet = null;               // 缓存没有对象就返回NULL

        if (GameData.bulletCacheDict[bullet_type_temp.toString()] == null)
            GameData.bulletCacheDict[bullet_type_temp.toString()] = []
        
        // 对应类型的缓存列表
        let bullet_cache_list:Bullet[] = GameData.bulletCacheDict[bullet_type_temp.toString()]
        if (bullet_cache_list.length > 0){
            if (bullet_type_temp == 3)          // 3类型的子弹要特殊处理
            {
                for (let index:number = 0; index < bullet_cache_list.length; ++index)
                {
                    let temp_bullet_obj:Bullet = bullet_cache_list[index];
                    if (temp_bullet_obj.getTextureName() == "mybullet_json.bullet-self3-" + texture_index.toString()){
                        res_bullet_obj = temp_bullet_obj;
                        bullet_cache_list.splice(index, 1);
                        break;
                    }
                }
            }
            else{
                res_bullet_obj = bullet_cache_list.pop();
            }
        }
        return res_bullet_obj;
    }

    /**回收子弹 */
    static reclaimBullet(bullet_obj:Bullet):any{
        if (bullet_obj == null)
            return;
        
        let bullet_type:number = bullet_obj.bullet_type;
        if (GameData.bulletCacheDict[bullet_type.toString()] == null)
            GameData.bulletCacheDict[bullet_type.toString()] = [];
        let bullet_cache_list:Bullet[] = GameData.bulletCacheDict[bullet_type.toString()];
        bullet_cache_list.push(bullet_obj);
    }

    constructor(bullet_type_temp:number, texture_index?:number){
        let texture_name:string;
        let damage_temp:number;
        switch(bullet_type_temp){
            case 1: texture_name = "mybullet_json.mybullet_norm"; damage_temp = 20; break;
            case 2: texture_name = "mybullet_json.mybullet2"; damage_temp = 12; break;
            case 3: texture_name = "mybullet_json.bullet-self3-" + texture_index.toString(); damage_temp = 4; break;
            case 4: texture_name = "enemybullet_json.enemybullet1"; damage_temp = 20; break;
            case 5: texture_name = "enemybullet_json.enemybullet2"; damage_temp = 20; break;
            case 6: texture_name = "enemybullet_json.enemybullet3"; damage_temp = 20; break;
            case 7: texture_name = "enemybullet_json.enemybullet4"; damage_temp = 20; break;
        }
        super(texture_name);

        // 初始化成员属性
        this.bullet_type = bullet_type_temp;
        this.damage_init = damage_temp;
        this.damage = this.damage_init;
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
        this.y += this.vertical_speed * GameData.fpsOffset;
        this.x += this.horizontal_speed * GameData.fpsOffset;
    }

    /**设置子弹垂直速度 */
    public setVerticalSpeed(new_vertical_speed:number):any{
        if (new_vertical_speed == 0 || new_vertical_speed == null)          // 垂直速度不能为0
            return ;
        this.vertical_speed = new_vertical_speed;
    }

    /**设置子弹水平速度 */
    public setHorizontalSpeed(new_horizontal_speed:number):any{
        if (new_horizontal_speed == null)          // 水平速度可以为0
            return ;
        this.horizontal_speed = new_horizontal_speed;
    }

}