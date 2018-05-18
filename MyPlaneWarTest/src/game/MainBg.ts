/**
 * 主背景类
 */

// 开始背景
class StartMainBg extends egret.Sprite{
    private bg_bitmap:egret.Bitmap;
    public start_button:egret.Bitmap;

    constructor(){
        super();
        this.createView();
    }

    /**创建视图 */
    private createView(){
        this.bg_bitmap = new egret.Bitmap();
        this.bg_bitmap.width = GameData.stageW;
        this.bg_bitmap.height = GameData.stageH;
        this.bg_bitmap.texture = RES.getRes("mainbg_jpg");
        this.addChild(this.bg_bitmap);


        this.start_button = new egret.Bitmap();
        this.start_button.texture = RES.getRes("startbutton_png");
        this.start_button.anchorOffsetX = this.start_button.width / 2;
        this.start_button.anchorOffsetY = this.start_button.height / 2;
        this.start_button.x = GameData.stageW / 2;
        this.start_button.y = GameData.stageH / 2;
        this.addChild(this.start_button);

    }

}


// 结束背景
class EndMainBg extends egret.Sprite{
    private bg_shape:egret.Shape;
    private text_field:egret.TextField;

    constructor(){
        super();
        this.createView();
    }

    /**创建视图 */
    private createView(){
        this.bg_shape = new egret.Shape();
        this.bg_shape.graphics.beginFill(0x969696);
        this.bg_shape.graphics.drawRect(0, 0, GameData.stageW, GameData.stageH);
        this.bg_shape.graphics.endFill();
        this.bg_shape.alpha = 0.5;
        this.addChild(this.bg_shape);

        this.text_field = new egret.TextField();
        this.text_field.x = GameData.stageW / 5 * 2;
        this.text_field.y = GameData.stageH / 2;
        this.addChild(this.text_field);
    }

    public updateScore(){
        this.text_field.text = `得分:${GameData.Score}`;
    }
} 