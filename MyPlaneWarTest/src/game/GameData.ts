/**
 * 游戏数据
 */
class GameData{
    static stageW:number;
    static stageH:number;
    static targetFps:number;                            // 标准帧率
    static fpsOffset:number;                            // 相对于标准帧率的偏移值
    static fpsLastRecordTime:number;                    // 上一次记录帧率的时间(毫秒值)
    static GameAppObj:GameApp;                          // GameApp类对象


    static planeCacheDict:Object = {};                  // 后台飞机缓存
    static bulletCacheDict:Object = {};                 // 后台子弹缓存
    static aeroliteCacheList:Aerolite[] = [];           // 陨石缓存
    static powerCacheDict:Object = {};                  // 后台Power缓存
    static BombCacheList:Bomb[] = [];                   // 爆炸特效对象缓存列表

    static myPlane:MyPlane = null;                      // 我的飞机对象
    static guardPlaneLeft:GuardPlane = null;            // 左护卫机
    static guardPlaneRight:GuardPlane = null;           // 右护卫机

    static enemyPlaneOnStage:PlaneBase[] = [];          // 存在于舞台上的敌方飞机对象列表
    static myBulletOnStage:Bullet[] = [];               // 存在于舞台上的我方子弹列表
    static enemyBulletOnStage:Bullet[] = [];            // 存在于舞台上的敌方子弹列表
    static aeroliteOnStage:Aerolite[] = [];             // 存在于舞台上的陨石列表
    static powerOnStage:Power[] = [];                   // 存在于舞台上的Power列表

    /**私有构造函数，防止初始化对象 */
    private constructor(){
    }
}