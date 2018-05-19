/**
 * 信息面板
 */

class InfoPanel extends egret.Sprite{

    private score_text_field:egret.TextField;
    private HP_text_filed_temp:egret.TextField;
    private HP_text_field:egret.TextField;
    private min_blood:number;
    private max_blood:number;
    private blood_width_radix:number;
    private now_blood:number;
    private blood_shape:egret.Shape;

    constructor(){
        super();
        this.width = GameData.stageW;
        this.height = 30;
        this.alpha = 0.6;

        // 初始化属性值
        this.min_blood = 0;
        this.max_blood = 100;
        

        // 绘制背景
        this.graphics.beginFill(0x1874CD);
        this.graphics.drawRect(0, 0, this.width, this.height);

        // 得分
        this.score_text_field = new egret.TextField();
        this.score_text_field.x = 0;
        this.score_text_field.y = 0;
        this.addChild(this.score_text_field);

        

        this.HP_text_filed_temp = new egret.TextField();
        this.HP_text_filed_temp.x = GameData.stageW / 2 - 50;
        this.HP_text_filed_temp.y = 0;
        this.HP_text_filed_temp.text = "HP:"
        this.addChild(this.HP_text_filed_temp);

        // 血量条绘制
        this.blood_shape = new egret.Shape();
        this.blood_shape.x = GameData.stageW / 2;
        this.blood_shape.y = 2.5;
        this.blood_shape.width = GameData.stageW / 2;
        this.blood_shape.height = 30;
        this.addChild(this.blood_shape);

        this.blood_width_radix = this.blood_shape.width / this.max_blood;

        // 血量文字
        this.HP_text_field = new egret.TextField();
        this.HP_text_field.x = this.blood_shape.x + this.blood_shape.width / 3;
        this.HP_text_field.y = 0;
        this.addChild(this.HP_text_field);

    }

    public updateScore():void{
        let now_score:number = GameData.Score;
        this.score_text_field.text = `关卡${GameData.MissionId} 得分:${now_score}`;
    }

    public updateBlood(new_blood:number):void{
        if (new_blood < this.min_blood)
            this.now_blood = this.min_blood;
        else if (new_blood > this.max_blood)
            this.now_blood = this.max_blood;
        else
            this.now_blood = new_blood;

        
        let color_num:number;
        // 血条颜色
        if (this.now_blood >= 80)
            color_num = 0x7FFF00;
        else if(this.now_blood >= 30)
            color_num = 0xEEC900;
        else
            color_num = 0xCD0000;


        this.blood_shape.graphics.clear();
        // 绘制背景条
        this.blood_shape.graphics.beginFill(0xCCCCCC);
        // this.blood_shape.graphics.lineStyle(2, 0xEE1289);
        this.blood_shape.graphics.drawRoundRect(0, 0, this.blood_shape.width, this.blood_shape.height - 5, 20);
        this.blood_shape.graphics.endFill();

        this.blood_shape.graphics.beginFill(color_num);
        // this.blood_shape.graphics.lineStyle(7, 0xEE1289);
        this.blood_shape.graphics.drawRoundRect(0, 0, this.blood_width_radix * this.now_blood, this.blood_shape.height - 5, 20);
        this.blood_shape.graphics.endFill();


        this.HP_text_field.text = `${this.now_blood}/${this.max_blood}`;
    }








}