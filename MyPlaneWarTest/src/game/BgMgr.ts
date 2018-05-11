/*
    背景管理模块。
*/

// 滚动背景
class ScrollBg extends egret.DisplayObjectContainer{
    private bg_bitmap_array:egret.Bitmap[] = [];            // 背景数组
    private bg_bitmap_cnt:number;                           // 数组长度
    private bg_picture_h:number;                            // 背景图片(纹理)高度
    private stage_w:number;                                 // 舞台宽度
    private stage_h:number;                                 // 舞台高度
    private scroll_speed:number = 2;                        // 滚动速度

    constructor(){
        super();
        this.once(egret.Event.ADDED_TO_STAGE, this.onAddedToStage, this);
    }

    private onAddedToStage(evt:egret.Event):void{
        this.initScrollBgData();
        console.log("init ScrollBg successfully.");
    }
    
    /**
     * 初始化滚动背景数据
     */
    private initScrollBgData():any{
        // 初始化舞台宽高
        this.stage_h = this.stage.stageHeight;
        this.stage_w = this.stage.stageWidth;
        
        // 初始化纹理高
        let texture:egret.Texture = RES.getRes("bg_png");

        this.bg_picture_h = texture.textureHeight;

        // 计算完成滚动需要多少图片
        this.bg_bitmap_cnt = Math.ceil(this.stage_h / this.bg_picture_h) + 1;

        // 创建bitmap对象
        for(let index:number = 0; index < this.bg_bitmap_cnt; ++index){
            let bitmap_obj:egret.Bitmap = new egret.Bitmap();
            bitmap_obj.texture = texture;
            bitmap_obj.width = this.stage_w;                // 设置宽度等于舞台宽度
            bitmap_obj.y = this.stage_h - this.bg_picture_h * (this.bg_bitmap_cnt - index);
            this.addChild(bitmap_obj);
            this.bg_bitmap_array.push(bitmap_obj);
        }

        //console.log( this.bg_bitmap_array);
    }

    /**
     * 开始背景滚动
     */
    public startScroll():any{
        this.addEventListener(egret.Event.ENTER_FRAME, this.scrollBgBitMapSlotSFunc, this);
    }

    /**
     * ，每帧滚动背景响应函数
     */
    private scrollBgBitMapSlotSFunc(evt:egret.Event):void{
        for(let index:number = 0; index < this.bg_bitmap_cnt; ++index){
            let bitmap_obj:egret.Bitmap = this.bg_bitmap_array[index];
            bitmap_obj.y += this.scroll_speed;

            // 已经超出舞台区域(只有最后的bitmap对象才会出现这种情况)
            if (index == this.bg_bitmap_cnt - 1){
                if (bitmap_obj.y > this.stage_h){
                    bitmap_obj.y = this.bg_bitmap_array[0].y - this.bg_picture_h;
                    // 通关更换背景图片

                    // 移动bitmap数组
                    this.bg_bitmap_array.pop();
                    this.bg_bitmap_array.unshift(bitmap_obj);
                }
            }
        }
    }

    /**
     * 停止背景滚动
     */
    public stopScroll():any{
        this.removeEventListener(egret.Event.ENTER_FRAME, this.scrollBgBitMapSlotSFunc, this);
    }

    /**
     * 设置背景滚动速度
     */
    public setScrollSpeed(new_speed:number):any{

        // 速度不能超过纹理高度，不然就会出现一次超出两张纹理图片的情况。
        if (new_speed <= 0 || this.scroll_speed == new_speed || new_speed > this.bg_picture_h)
            return;
        this.scroll_speed = new_speed;
    }





}