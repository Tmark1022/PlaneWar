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
        this.start_button.y = GameData.stageH / 6 * 5;
        this.addChild(this.start_button);

    }

}


// 结束背景
class EndMainBg extends egret.Sprite{
    private bg_shape:egret.Shape;
    private text_field:egret.TextField;
    private game_over_bitmap:egret.Bitmap;

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

        this.game_over_bitmap = new egret.Bitmap();
        this.game_over_bitmap.texture = RES.getRes("gameover_png");
        let readix_temp:number = this.game_over_bitmap.texture.textureHeight / this.game_over_bitmap.texture.textureWidth;
        this.game_over_bitmap.width = GameData.stageW;
        this.game_over_bitmap.height = this.game_over_bitmap.width * readix_temp;
        this.game_over_bitmap.anchorOffsetX = this.game_over_bitmap.width / 2;
        this.game_over_bitmap.anchorOffsetY = this.game_over_bitmap.height / 2;
        this.game_over_bitmap.x = GameData.stageW / 2;
        this.game_over_bitmap.y = GameData.stageH / 5 * 2;
        this.addChild(this.game_over_bitmap);

        this.text_field = new egret.TextField();
        this.text_field.width = GameData.stageW;
        this.text_field.x = 0;
        this.text_field.y = GameData.stageH / 6 * 4;
        this.text_field.textAlign = "center";
        this.text_field.size = 40;
        this.addChild(this.text_field);
    }

    public updateScore(){
        this.text_field.text = `到达关卡:${GameData.MissionId}\n\n\n总得分:${GameData.Score}`;
    }
} 