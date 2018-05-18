/*
    背景管理模块。
*/
var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
// 滚动背景
var ScrollBg = (function (_super) {
    __extends(ScrollBg, _super);
    function ScrollBg() {
        var _this = _super.call(this) || this;
        _this.scroll_speed = 2; // 滚动速度
        _this.addEventListener(egret.Event.ADDED_TO_STAGE, _this.onAddedToStage, _this);
        return _this;
    }
    ScrollBg.prototype.onAddedToStage = function (evt) {
        console.log("init ScrollBg successfully.");
    };
    ScrollBg.prototype.refreshBgTextute = function () {
        this.initScrollBgData();
    };
    /**
     * 初始化滚动背景数据
     */
    ScrollBg.prototype.initScrollBgData = function () {
        this.bg_bitmap_array = [];
        // 初始化舞台宽高
        this.stage_h = this.stage.stageHeight;
        this.stage_w = this.stage.stageWidth;
        // 初始化纹理高
        var bg_num = Math.floor(Math.random() * 6) + 1;
        var texture_name;
        switch (bg_num) {
            case 1:
                texture_name = "bg_png";
                break;
            case 2:
                texture_name = "bg2_jpg";
                break;
            case 3:
                texture_name = "bg3_jpg";
                break;
            case 4:
                texture_name = "bg4_jpg";
                break;
            case 5:
                texture_name = "bg5_jpg";
                break;
            case 6:
                texture_name = "bg6_jpg";
                break;
            default:
                texture_name = "bg_png";
                break;
        }
        var texture = RES.getRes(texture_name);
        this.bg_picture_h = texture.textureHeight;
        // 计算完成滚动需要多少图片
        this.bg_bitmap_cnt = Math.ceil(this.stage_h / this.bg_picture_h) + 1;
        // 创建bitmap对象
        for (var index = 0; index < this.bg_bitmap_cnt; ++index) {
            var bitmap_obj = new egret.Bitmap();
            bitmap_obj.texture = texture;
            bitmap_obj.width = this.stage_w; // 设置宽度等于舞台宽度
            bitmap_obj.y = this.stage_h - this.bg_picture_h * (this.bg_bitmap_cnt - index);
            this.addChild(bitmap_obj);
            this.bg_bitmap_array.push(bitmap_obj);
        }
    };
    /**
     * 开始背景滚动
     */
    ScrollBg.prototype.startScroll = function () {
        this.addEventListener(egret.Event.ENTER_FRAME, this.scrollBgBitMapSlotSFunc, this);
    };
    /**
     * ，每帧滚动背景响应函数
     */
    ScrollBg.prototype.scrollBgBitMapSlotSFunc = function (evt) {
        for (var index = 0; index < this.bg_bitmap_cnt; ++index) {
            var bitmap_obj = this.bg_bitmap_array[index];
            bitmap_obj.y += this.scroll_speed;
            // 已经超出舞台区域(只有最后的bitmap对象才会出现这种情况)
            if (index == this.bg_bitmap_cnt - 1) {
                if (bitmap_obj.y > this.stage_h) {
                    bitmap_obj.y = this.bg_bitmap_array[0].y - this.bg_picture_h;
                    // 通关更换背景图片
                    // 移动bitmap数组
                    this.bg_bitmap_array.pop();
                    this.bg_bitmap_array.unshift(bitmap_obj);
                }
            }
        }
    };
    /**
     * 停止背景滚动
     */
    ScrollBg.prototype.stopScroll = function () {
        this.removeEventListener(egret.Event.ENTER_FRAME, this.scrollBgBitMapSlotSFunc, this);
    };
    /**
     * 设置背景滚动速度
     */
    ScrollBg.prototype.setScrollSpeed = function (new_speed) {
        // 速度不能超过纹理高度，不然就会出现一次超出两张纹理图片的情况。
        if (new_speed <= 0 || this.scroll_speed == new_speed || new_speed > this.bg_picture_h)
            return;
        this.scroll_speed = new_speed;
    };
    return ScrollBg;
}(egret.DisplayObjectContainer));
__reflect(ScrollBg.prototype, "ScrollBg");
//# sourceMappingURL=BgMgr.js.map