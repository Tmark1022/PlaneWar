/**
 * 飞机工厂类
 * planeType{0:错误飞机类型, 1:我方主飞机, 2:我方护卫飞机, 3:敌方普通飞机1, 4:敌方普通飞机2, 5:敌方普通飞机3, 6:Boss战机}
 */
var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var PlaneFactory = (function () {
    /**不能实例化 */
    function PlaneFactory() {
    }
    /**
     * 创建飞机工厂方法
     */
    PlaneFactory.createPlane = function (plane_type, texture_name) {
        var new_plane_obj;
        // 敌机会使用到飞机缓存
        switch (plane_type) {
            case 1:
                new_plane_obj = new MyPlane(plane_type, texture_name);
                break;
            case 2:
                new_plane_obj = new GuardPlane(plane_type, texture_name);
                break;
            case 3:
                {
                    new_plane_obj = PlaneFactory.getPlaneObjFromCache(plane_type, texture_name);
                    if (new_plane_obj == null)
                        new_plane_obj = new NormalPlane1(plane_type, texture_name);
                }
                break;
            case 4:
                {
                    new_plane_obj = PlaneFactory.getPlaneObjFromCache(plane_type, texture_name);
                    if (new_plane_obj == null)
                        new_plane_obj = new NormalPlane2(plane_type, texture_name);
                }
                break;
            case 5:
                {
                    new_plane_obj = PlaneFactory.getPlaneObjFromCache(plane_type, texture_name);
                    if (new_plane_obj == null)
                        new_plane_obj = new NormalPlane3(plane_type, texture_name);
                }
                break;
            case 6:
                {
                    new_plane_obj = PlaneFactory.getPlaneObjFromCache(plane_type, texture_name);
                    if (new_plane_obj == null)
                        new_plane_obj = new NormalPlane4(plane_type, texture_name);
                }
                break;
            case 7:
                {
                    new_plane_obj = PlaneFactory.getPlaneObjFromCache(plane_type, texture_name);
                    if (new_plane_obj == null)
                        new_plane_obj = new BossPlane(plane_type, texture_name);
                }
                break;
            default:
                new_plane_obj = null;
                break;
        }
        return new_plane_obj;
    };
    /**
     * 从缓存中获得飞机
     */
    PlaneFactory.getPlaneObjFromCache = function (plane_type, texture_name) {
        var plane_list;
        if (GameData.planeCacheDict[plane_type.toString()] == null)
            GameData.planeCacheDict[plane_type.toString()] = [];
        // 获得对应飞机类型的缓存列表
        plane_list = GameData.planeCacheDict[plane_type.toString()];
        // 判断资源名是否相同
        if (plane_list.length > 0) {
            for (var index = 0; index < plane_list.length; ++index) {
                var res_plane = plane_list[index];
                if (res_plane.getTextureName() == texture_name) {
                    plane_list.splice(index, 1);
                    return res_plane;
                }
            }
        }
        // 没能在缓存中找到
        return null;
    };
    /**
     * 回收飞机对象
     */
    PlaneFactory.reclaimPlaneObjToCache = function (plane_obj) {
        if (plane_obj == null)
            return;
        var plane_type = plane_obj.plane_type;
        var plane_list = GameData.planeCacheDict[plane_type.toString()];
        if (plane_list == null)
            GameData.planeCacheDict[plane_type.toString()] = plane_list = [];
        plane_list.push(plane_obj);
    };
    return PlaneFactory;
}());
__reflect(PlaneFactory.prototype, "PlaneFactory");
//# sourceMappingURL=PlanrFactory.js.map