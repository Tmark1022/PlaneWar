var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
/**
 * 游戏数据
 */
var GameData = (function () {
    /**私有构造函数，防止初始化对象 */
    function GameData() {
    }
    GameData.planeCacheDict = {}; // 后台飞机缓存
    GameData.bulletCacheDict = {}; // 后台子弹缓存
    GameData.aeroliteCacheList = []; // 陨石缓存
    GameData.powerCacheDict = {}; // 后台Power缓存
    GameData.myPlane = null; // 我的飞机对象
    GameData.guardPlaneLeft = null; // 左护卫机
    GameData.guardPlaneRight = null; // 右护卫机
    GameData.enemyPlaneOnStage = []; // 存在于舞台上的敌方飞机对象列表
    GameData.myBulletOnStage = []; // 存在于舞台上的我方子弹列表
    GameData.enemyBulletOnStage = []; // 存在于舞台上的敌方子弹列表
    GameData.aeroliteOnStage = []; // 存在于舞台上的陨石列表
    GameData.powerOnStage = []; // 存在于舞台上的Power列表
    return GameData;
}());
__reflect(GameData.prototype, "GameData");
//# sourceMappingURL=GameData.js.map