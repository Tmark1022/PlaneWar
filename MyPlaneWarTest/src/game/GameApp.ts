/**
 * 游戏程序类
 */
class GameApp extends egret.DisplayObjectContainer{
    scroll_bg:ScrollBg;
    enemy_plane_timer1:egret.Timer;
    enemy_plane_timer2:egret.Timer;
    enemy_plane_timer3:egret.Timer;
    boss_plane_timer:egret.Timer;
    aerolite_timer:egret.Timer;

    bullet_music:egret.Sound;
    bullet2_music:egret.Sound;
    get_power_music:egret.Sound;
    bg_music1:egret.Sound;
    bg_music2:egret.Sound;
    bg_music_boss:egret.Sound;
    bg_music_channel:egret.SoundChannel;

    start_main_bg:StartMainBg;
    end_main_bg:EndMainBg;

    /**
     * 构造函数 
     */
    constructor(){
        super();

        // 初始化属性
        this.scroll_bg = null;
        this.enemy_plane_timer1 = new egret.Timer(1000);                    // 创建敌方飞机计时器1
        this.enemy_plane_timer2 = new egret.Timer(10000);                   // 创建敌方飞机计时器2
        this.enemy_plane_timer3 = new egret.Timer(15000);                   // 创建敌方飞机计时器3
        this.boss_plane_timer = new egret.Timer(180000);                    // Boss计时器
        this.aerolite_timer = new egret.Timer(10000);                       // 陨石计时器

        this.bullet_music = RES.getRes("bullet_mp3");
        this.bullet2_music = RES.getRes("bullet2_mp3");
        this.get_power_music = RES.getRes("getpower_mp3");
        this.bg_music1 = RES.getRes("bgmusic_mp3");
        this.bg_music2 = RES.getRes("bgmusic2_mp3");
        this.bg_music_boss = RES.getRes("boss_music_mp3");

        this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
    }

    /**
     * 加入舞台相应函数
     */
    private onAddToStage(evt:egret.Event):void{
        this.createGameView();
    }

    /**
     * 创建游戏场景
     */
    private createGameView():any{
        // 初始化GmaeData的全局都在使用的基础数据
        GameData.stageW = this.stage.stageWidth;
        GameData.stageH = this.stage.stageHeight;
        GameData.targetFps = 60;
        
        // 初始化滚动背景
        this.scroll_bg = new ScrollBg();
        this.addChild(this.scroll_bg);

        // 初始化主背景
        this.start_main_bg = new StartMainBg();
        this.addChild(this.start_main_bg);
        this.start_main_bg.start_button.touchEnabled = true;
        this.start_main_bg.start_button.addEventListener(egret.TouchEvent.TOUCH_TAP, this.touchStartButton, this);

        // 开始播放背景音乐
        if (this.bg_music_channel != null)
            this.bg_music_channel.stop();
        this.bg_music_channel = this.bg_music2.play(0,-1);
        this.bg_music_channel.volume = 0.4;
    }

    /**点击开始按钮 */
    private touchStartButton(evt:egret.TouchEvent):void{
        this.start_main_bg.start_button.touchEnabled = false;
        this.start_main_bg.start_button.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.touchStartButton, this);
        this.removeChild(this.start_main_bg);
        this.gameStart();
    }

    /**
     * 开始游戏
     */
    private gameStart():any{
        // 初始化GameData
        GameData.fpsOffset = 1;
        GameData.fpsLastRecordTime = 0;
        GameData.Score = 0;

        // 创建我的战机
        if(GameData.myPlane == null){
            let my_plane:PlaneBase = PlaneFactory.createPlane(1, "myplane_json.myplane");
            GameData.myPlane = <MyPlane>my_plane;
        }
        GameData.myPlane.addEventListener(BulletEvent.CREATE_BULLET, this.createBullet, this);
        this.addChild(GameData.myPlane);
        
        /**显示数据面板 */
        GameData.InfoPanelObj.updateScore();
        GameData.InfoPanelObj.updateBlood(GameData.myPlane.blood);
        GameData.InfoPanelObj.visible = true;

         // 设置事件响应
        this.enemy_plane_timer1.addEventListener(egret.TimerEvent.TIMER, this.createEnemyPlane1, this);
        this.enemy_plane_timer2.addEventListener(egret.TimerEvent.TIMER, this.createEnemyPlane2, this);
        this.enemy_plane_timer3.addEventListener(egret.TimerEvent.TIMER, this.createEnemyPlane3, this);
        this.boss_plane_timer.addEventListener(egret.TimerEvent.TIMER, this.createBossPlane, this);
        this.aerolite_timer.addEventListener(egret.TimerEvent.TIMER, this.createAerolite, this);
        this.addEventListener(egret.Event.ENTER_FRAME, this.updateGameView, this);

        this.scroll_bg.startScroll();               // 开始滚动背景
        this.startTimeCount();                      // 开始计时器计时

        // 开始播放背景音乐
        if (this.bg_music_channel != null)
            this.bg_music_channel.stop();
        this.bg_music_channel = this.bg_music1.play(0,-1);
        this.bg_music_channel.volume = 0.4;
    }

    /**开始计时器 */
    private startTimeCount():any{
        this.enemy_plane_timer1.start();            // 敌机计时器1开始
        this.enemy_plane_timer2.start();            // 敌机计时器2开始
        this.enemy_plane_timer3.start();            // 敌机计时器3开始
        this.boss_plane_timer.start();              // Boss计时器
        this.aerolite_timer.start();                // 陨石计时器
    }

    /**暂停计时器 */
    private stopTimeCount():any{
        this.enemy_plane_timer1.stop();            // 敌机计时器1开始
        this.enemy_plane_timer2.stop();            // 敌机计时器2开始
        this.enemy_plane_timer3.stop();            // 敌机计时器3开始
        this.boss_plane_timer.stop();              // Boss计时器
        this.aerolite_timer.stop();                // 陨石计时器
    }

    /**
     * 结束游戏
     */
    private gameStop():any{
        // 我的战机
        GameData.myPlane.removeEventListener(BulletEvent.CREATE_BULLET, this.createBullet, this);
        this.removeChild(GameData.myPlane);

        // 护卫机
        if (GameData.guardPlaneLeft != null)
        {
            GameData.guardPlaneLeft.removeEventListener(BulletEvent.CREATE_BULLET, this.createBullet, this);
            this.removeChild(GameData.guardPlaneLeft);
            GameData.guardPlaneLeft = null;

            GameData.guardPlaneRight.removeEventListener(BulletEvent.CREATE_BULLET, this.createBullet, this);
            this.removeChild(GameData.guardPlaneRight);
            GameData.guardPlaneRight = null;
        }

        // 回收敌方飞机
        for (let index:number = 0; index < GameData.enemyPlaneOnStage.length; ++index){
            let enemy_plane:PlaneBase = GameData.enemyPlaneOnStage[index];
            this.removeChild(enemy_plane);
            PlaneFactory.reclaimPlaneObjToCache(enemy_plane);
        }
        GameData.enemyPlaneOnStage = [];

        // 回收我方子弹
        for (let index:number = 0; index < GameData.myBulletOnStage.length; ++index){
            let my_bullet:Bullet = GameData.myBulletOnStage[index];
            this.removeChild(my_bullet);
            Bullet.reclaimBullet(my_bullet);
        }
        GameData.myBulletOnStage = [];

        // 回收敌方子弹
        for (let index:number = 0; index < GameData.enemyBulletOnStage.length; ++index){
            let enemy_bullet:Bullet = GameData.enemyBulletOnStage[index];
            this.removeChild(enemy_bullet);
            Bullet.reclaimBullet(enemy_bullet);
        }
        GameData.enemyBulletOnStage = [];

        // 回收陨石
        for (let index:number = 0; index < GameData.aeroliteOnStage.length; ++index){
            let aerolite_temp:Aerolite = GameData.aeroliteOnStage[index];
            this.removeChild(aerolite_temp);
            Aerolite.reclaimAerolite(aerolite_temp);
        }
        GameData.aeroliteOnStage = [];

        // 回收power
        for (let index:number = 0; index < GameData.powerOnStage.length; ++index){
            let power_temp:Power = GameData.powerOnStage[index];
            this.removeChild(power_temp);
            Power.reclaimPower(power_temp);
        }
        GameData.powerOnStage = [];

         // 取消事件响应
        this.enemy_plane_timer1.removeEventListener(egret.TimerEvent.TIMER, this.createEnemyPlane1, this);
        this.enemy_plane_timer2.removeEventListener(egret.TimerEvent.TIMER, this.createEnemyPlane2, this);
        this.enemy_plane_timer3.removeEventListener(egret.TimerEvent.TIMER, this.createEnemyPlane3, this);
        this.boss_plane_timer.removeEventListener(egret.TimerEvent.TIMER, this.createBossPlane, this);
        this.aerolite_timer.removeEventListener(egret.TimerEvent.TIMER, this.createAerolite, this);
        this.removeEventListener(egret.Event.ENTER_FRAME, this.updateGameView, this);

        this.scroll_bg.stopScroll();                // 停止滚动背景
        this.stopTimeCount();                       // 停止计时器计时


        // 结束界面
        if (this.end_main_bg == null){
            this.end_main_bg = new EndMainBg();
        }
        this.end_main_bg.updateScore();
        this.addChild(this.end_main_bg);
        this.end_main_bg.touchEnabled = true;
        this.end_main_bg.addEventListener(egret.TouchEvent.TOUCH_TAP, this.touchEndMainBg, this)
    }

    /**点击结束界面 */
    private touchEndMainBg(evt:egret.TouchEvent):void{
        // 删除结束界面
        this.end_main_bg.touchEnabled = false;
        this.end_main_bg.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.touchEndMainBg, this);
        this.removeChild(this.end_main_bg);

        // 隐藏数据界面
        GameData.InfoPanelObj.visible = false;

        // 创建开始界面
        if (this.start_main_bg == null)
            this.start_main_bg = new StartMainBg();
        this.addChild(this.start_main_bg);
        this.start_main_bg.start_button.touchEnabled = true;
        this.start_main_bg.start_button.addEventListener(egret.TouchEvent.TOUCH_TAP, this.touchStartButton, this);
        
        // 开始播放背景音乐
        if (this.bg_music_channel != null)
            this.bg_music_channel.stop();
        this.bg_music_channel = this.bg_music2.play(0,-1);
        this.bg_music_channel.volume = 0.4;
    }


    /**
     * 重新游戏
     */
    private gameRestart():any{

    }

    /**创建护卫飞机 */
    public createGuardPlane():void{
        let my_plane:PlaneBase;
        my_plane = PlaneFactory.createPlane(2, "myplane_json.myplane_add");
        my_plane.addEventListener(BulletEvent.CREATE_BULLET, this.createBullet, this);
        my_plane.x = 0;
        my_plane.y = my_plane.height;
        this.addChild(my_plane);
        GameData.guardPlaneLeft = <GuardPlane>my_plane;
        egret.Tween.get(GameData.guardPlaneLeft).to({ x: GameData.myPlane.x - GameData.guardPlaneLeft.space_width, y:GameData.myPlane.y}, 2000, egret.Ease.circIn );

        my_plane = PlaneFactory.createPlane(2, "myplane_json.myplane_add");
        my_plane.addEventListener(BulletEvent.CREATE_BULLET, this.createBullet, this);
        my_plane.x = GameData.stageW;
        my_plane.y = my_plane.height;
        this.addChild(my_plane);
        GameData.guardPlaneRight = <GuardPlane>my_plane;
        egret.Tween.get(GameData.guardPlaneRight).to({ x: GameData.myPlane.x + GameData.guardPlaneRight.space_width, y:GameData.myPlane.y}, 2000, egret.Ease.circIn );
    }

    /**创建敌机响应函数1 */
    private createEnemyPlane1(evt:egret.TimerEvent):void{
        let plane_type:number = 2 + Math.floor(Math.random()*2) + 1;        // 飞机类型3~4
        let texture_name:string;
        if (plane_type == 3)
            texture_name = "enemyplane_json.enemyplane3"
        else
            texture_name = "enemyplane_json.enemyplane2"
        
        // 创建敌机
        let enemy_plane:PlaneBase = PlaneFactory.createPlane(plane_type, texture_name);
        if (enemy_plane == null){
            console.log('创建敌方飞机过程发生错误', plane_type, texture_name);
            return;
        }

        // 随机敌机产生位置
        enemy_plane.x = Math.random()*(GameData.stageW-enemy_plane.width) + enemy_plane.width / 2;
        enemy_plane.y = 0;

        enemy_plane.addEventListener(BulletEvent.CREATE_BULLET, this.createBullet, this);

        this.addChild(enemy_plane);
        GameData.enemyPlaneOnStage.push(enemy_plane);
    }

    /**创建敌机响应函数2 */
    private createEnemyPlane2(evt:egret.TimerEvent):void{
        let plane_type:number = 5;
        let texture_name:string = "enemyplane_json.enemyplane1"
        
        // 创建敌机
        let enemy_plane:PlaneBase = PlaneFactory.createPlane(plane_type, texture_name);
        if (enemy_plane == null){
            console.log('创建敌方飞机过程发生错误', plane_type, texture_name);
            return;
        }

        // 随机敌机产生位置
        enemy_plane.x = Math.random()*(GameData.stageW-enemy_plane.width) + enemy_plane.width / 2;
        enemy_plane.y = 0;

        enemy_plane.addEventListener(BulletEvent.CREATE_BULLET, this.createBullet, this);

        this.addChild(enemy_plane);
        GameData.enemyPlaneOnStage.push(enemy_plane);
    }

    /**创建敌机响应函数3 */
    private createEnemyPlane3(evt:egret.TimerEvent):void{
        let plane_type:number = 6;
        let texture_name:string = "enemyplane_json.enemyplane4"
        
        // 创建敌机
        let enemy_plane:PlaneBase = PlaneFactory.createPlane(plane_type, texture_name);
        if (enemy_plane == null){
            console.log('创建敌方飞机过程发生错误', plane_type, texture_name);
            return;
        }

        // 随机敌机产生位置
        enemy_plane.x = Math.random()*(GameData.stageW-enemy_plane.width) + enemy_plane.width / 2;
        enemy_plane.y = 0;

        enemy_plane.addEventListener(BulletEvent.CREATE_BULLET, this.createBullet, this);

        this.addChild(enemy_plane);
        GameData.enemyPlaneOnStage.push(enemy_plane);
    }

    /**创建Boss战机响应函数 */
    private createBossPlane(evt:egret.TimerEvent):void{
        let plane_type:number = 7;
        let texture_name:string = "enemyplane_json.BOSS"
        
        
        let warning_sound:egret.Sound = RES.getRes("warning_mp3");
        warning_sound.play(0, 1);


        // 创建敌机
        let enemy_plane:PlaneBase = PlaneFactory.createPlane(plane_type, texture_name);
        if (enemy_plane == null){
            console.log('创建敌方飞机过程发生错误', plane_type, texture_name);
            return;
        }

        // 随机敌机产生位置
        enemy_plane.x = Math.random()*(GameData.stageW-enemy_plane.width) + enemy_plane.width / 2;
        enemy_plane.y = 0;

        enemy_plane.addEventListener(BulletEvent.CREATE_BULLET, this.createBullet, this);

        this.addChild(enemy_plane);
        GameData.enemyPlaneOnStage.push(enemy_plane);

        // 停止其他战机或物品的计时
        this.stopTimeCount();

        // 更换music
        this.bg_music_channel.stop();
        this.bg_music_channel = this.bg_music_boss.play(0, -1);
        this.bg_music_channel.volume = 0.4;
    }

    /**创建陨石 */
    private createAerolite(evt:egret.TimerEvent):void{
        let texture_name:string = "power_json.store"
        
        // 创建陨石
        let aerolite_obj:Aerolite = Aerolite.createAerolite(texture_name);
        if (aerolite_obj == null){
            console.log('创建陨石过程发生错误', texture_name);
            return;
        }

        // 随机陨石产生位置
        aerolite_obj.x = Math.random()*(GameData.stageW-aerolite_obj.width) + aerolite_obj.width / 2;
        aerolite_obj.y = 0;

        this.addChild(aerolite_obj);
        GameData.aeroliteOnStage.push(aerolite_obj);
        
    }

    /**创建power */
    private createPower(display_obj:egret.DisplayObject):void{

        let temp_x:number = display_obj.x;
        let temp_y:number = display_obj.y;
        let power_type:number = Math.floor(Math.random() * 5) + 1;

        // 创建power
        let power_obj:Power = Power.createPower(power_type);
        if (power_obj == null){
            console.log('创建power过程发生错误', power_type);
            return;
        }

        // 随机陨石产生位置
        power_obj.x = temp_x;
        power_obj.y = temp_y;

        this.addChild(power_obj);
        GameData.powerOnStage.push(power_obj);
    }

    /**创建爆炸特效 */
    private createBomb(display_obj:egret.DisplayObject):void{
        if (display_obj == null)
            return ;
        let x_temp:number = display_obj.x;
        let y_temp:number = display_obj.y;

        let bomb_obj:Bomb = Bomb.createBomb();
        bomb_obj.x = x_temp;
        bomb_obj.y = y_temp;
        this.addChild(bomb_obj);
    }

    // 创建子弹响应函数
    private createBullet(evt:BulletEvent):void{
        let plane_obj:PlaneBase = evt.target;
        // 我方朱飞机发出的弹药和其他的不同
        if (plane_obj.plane_type == 1){
            let my_plane_obj:MyPlane = <MyPlane>plane_obj;
            
            if (my_plane_obj.bullet_type == 1){
                // 平行子弹
                let bullet_cnt:number = 1 + my_plane_obj.getBulletLevel();
                let x_change_radix:number;
                if (bullet_cnt % 2 == 0){
                    // 偶数个子弹
                    x_change_radix = (bullet_cnt - 1) / 2;
                }
                else{
                    // 奇数个子弹
                    x_change_radix = Math.floor(bullet_cnt / 2);
                }
                
                for(let index:number = 0; index < bullet_cnt; ++index)
                {
                    let bullet_obj:Bullet = Bullet.createBullet(my_plane_obj.bullet_type);
                    bullet_obj.x = my_plane_obj.x + (x_change_radix - index) * 25;
                    if (Math.abs(x_change_radix - index) < 1)
                        bullet_obj.y = my_plane_obj.y - my_plane_obj.width / 5;
                    else
                        bullet_obj.y = my_plane_obj.y;
                    bullet_obj.setHorizontalSpeed(0);
                    bullet_obj.setVerticalSpeed(-10);
                    this.addChild(bullet_obj);
                    GameData.myBulletOnStage.push(bullet_obj);
                }
                this.bullet_music.play(0, 1);
            }
            else if(my_plane_obj.bullet_type == 2){
                // 连发子弹
                let bullet_cnt:number = 1 + my_plane_obj.getBulletLevel() * 2;
                let x_change_radix:number = Math.floor(bullet_cnt / 2);
                
                for(let index:number = 0; index < bullet_cnt; ++index)
                {
                    let bullet_obj:Bullet = Bullet.createBullet(my_plane_obj.bullet_type);

                    bullet_obj.x = my_plane_obj.x;
                    bullet_obj.y = my_plane_obj.y;
                    bullet_obj.rotation = (20 - (x_change_radix - 1) * 5) * (index - x_change_radix)
                    bullet_obj.setHorizontalSpeed(10 * (bullet_obj.rotation / 60));
                    bullet_obj.setVerticalSpeed(-10);
                    this.addChild(bullet_obj);
                    GameData.myBulletOnStage.push(bullet_obj);
                }
                this.bullet_music.play(0, 1);
            }
            else if(my_plane_obj.bullet_type == 3){
                // 激光炮       
                for(var i: number = 1;i < 14;i++) {
                    let bullet_obj:Bullet = Bullet.createBullet(my_plane_obj.bullet_type, i);
                    bullet_obj.scaleX = my_plane_obj.getBulletLevel();
                    bullet_obj.scaleY = my_plane_obj.getBulletLevel();

                    bullet_obj.x = my_plane_obj.x;
                    bullet_obj.y = my_plane_obj.y-50*(i-1);
                    bullet_obj.setHorizontalSpeed(0);
                    bullet_obj.setVerticalSpeed(-40);
                    // this.addChild(bullet_obj);
                    this.addChildAt(bullet_obj, 1);             // 因为激活显示太厉害了，所以显示在图层的下方
                    GameData.myBulletOnStage.push(bullet_obj);
                }
                this.bullet2_music.play(0, 1);
            }
        }
        else if(plane_obj.plane_type == 2){
            let bullet_obj:Bullet = Bullet.createBullet(plane_obj.bullet_type);
            bullet_obj.x = plane_obj.x;
            bullet_obj.y = plane_obj.y;
            bullet_obj.setHorizontalSpeed(0);
            bullet_obj.setVerticalSpeed(-10);

            this.addChild(bullet_obj);
            GameData.myBulletOnStage.push(bullet_obj);

        }
        else if(plane_obj.plane_type == 5){
            // 创建三连发子弹
            for(let index:number = 0; index < 3; ++index)
            {
                let bullet_obj:Bullet = Bullet.createBullet(plane_obj.bullet_type);
                bullet_obj.x = plane_obj.x;
                bullet_obj.y = plane_obj.y;
                bullet_obj.rotation = 45 * (1 - index);
                bullet_obj.setHorizontalSpeed(-10 * (bullet_obj.rotation / 90));
                bullet_obj.setVerticalSpeed(10);
                this.addChild(bullet_obj);
                GameData.enemyBulletOnStage.push(bullet_obj);
            }
        }
        else if(plane_obj.plane_type == 6){
            // 创建三发平行子弹
            for(let index:number = 0; index < 3; ++index)
            {
                let bullet_obj:Bullet = Bullet.createBullet(plane_obj.bullet_type);
                bullet_obj.rotation = 0;                // 用了Boss的子弹缓存， 设置下旋转度
                bullet_obj.x = plane_obj.x + (1 - index) * 55;
                bullet_obj.y = plane_obj.y + plane_obj.width / 3;
                bullet_obj.setHorizontalSpeed(0);
                bullet_obj.setVerticalSpeed(10);
                this.addChild(bullet_obj);
                GameData.enemyBulletOnStage.push(bullet_obj);
            }
        }
        else if(plane_obj.plane_type == 7){
            // 创建七连发子弹
            for(let index:number = 0; index < 7; ++index)
             {
                let bullet_obj:Bullet = Bullet.createBullet(plane_obj.bullet_type);
                bullet_obj.x = plane_obj.x;
                bullet_obj.y = plane_obj.y;
                bullet_obj.rotation = (20 - Math.abs(2 * (3 - index)))  * (3 - index);
                bullet_obj.setHorizontalSpeed(-10 * (bullet_obj.rotation / 90) + 2 * (index - 3));
                bullet_obj.setVerticalSpeed(10);
                this.addChild(bullet_obj);
                GameData.enemyBulletOnStage.push(bullet_obj);
            }
        }
        else{
            let bullet_obj:Bullet = Bullet.createBullet(plane_obj.bullet_type);
            bullet_obj.x = plane_obj.x;
            bullet_obj.y = plane_obj.y;
            bullet_obj.setHorizontalSpeed(0);
            bullet_obj.setVerticalSpeed(10);

            this.addChild(bullet_obj);
            GameData.enemyBulletOnStage.push(bullet_obj);
        }

    }

    /**每帧移动并且检测是否出界 */
    private moveAndCheckOutOfRangeHelp(on_stage_list:MovableBitMap[], reclaim_func:any){
         // 移动以及判断是否飞出边界
        let reclaim_list:MovableBitMap[] = [];
        for (let index:number = 0; index < on_stage_list.length; ++index){
            let movable_bitmap_obj:MovableBitMap = on_stage_list[index];
            movable_bitmap_obj.moveByEnterFrame();

            // 飞出边界
            if (movable_bitmap_obj.isOutOfStage())
            {
                reclaim_list.push(movable_bitmap_obj);
            }
        }

        // 回收
        this.reclaimMovableBitMapHelp(on_stage_list, reclaim_list, reclaim_func);
    }

    /** 回收可移动bitmap对象辅助函数*/
    private reclaimMovableBitMapHelp(on_stage_list:MovableBitMap[], reclaim_list:MovableBitMap[], reclaim_func:any){
        // 回收飞出边界的可移动对象
        for (let index:number = 0; index < reclaim_list.length; ++index){
            let reclaim_obj:MovableBitMap = reclaim_list[index];
            this.removeChild(reclaim_obj);
            on_stage_list.splice(on_stage_list.indexOf(reclaim_obj), 1);

            if (reclaim_func == PlaneFactory.reclaimPlaneObjToCache)
            {
                // 如果是飞机
                let plane_obj:PlaneBase = <PlaneBase>reclaim_obj;
                reclaim_obj.removeEventListener(BulletEvent.CREATE_BULLET, this.createBullet, this);
            }
            reclaim_func(reclaim_obj);
        }
    }

    /**每帧更新响应函数 */
    private updateGameView(evt:egret.Event):void{
         //为了防止FPS下降造成回收慢，生成快，进而导致DRAW数量失控，需要计算一个系数，当FPS下降的时候，让运动速度加快
        let now_time:number = egret.getTimer();
        if (GameData.fpsLastRecordTime == 0){               // 特殊化处理第一次
            GameData.fpsOffset = 1;
        }
        else{
            let now_fps:number = 1000 / (now_time - GameData.fpsLastRecordTime);             // 求得帧率
            GameData.fpsOffset = 60 / now_fps;                                          
        }
        GameData.fpsLastRecordTime = now_time;


        // 敌方飞机
        this.moveAndCheckOutOfRangeHelp(GameData.enemyPlaneOnStage, PlaneFactory.reclaimPlaneObjToCache);
        // 我方子弹
        this.moveAndCheckOutOfRangeHelp(GameData.myBulletOnStage, Bullet.reclaimBullet);
        // 敌方子弹
        this.moveAndCheckOutOfRangeHelp(GameData.enemyBulletOnStage, Bullet.reclaimBullet);
        // 陨石
        this.moveAndCheckOutOfRangeHelp(GameData.aeroliteOnStage, Aerolite.reclaimAerolite);
        // power
        this.moveAndCheckOutOfRangeHelp(GameData.powerOnStage, Power.reclaimPower);


        // 碰撞检测
        this.gameHitTest();
    }

    /**游戏每帧碰撞检测 */
    private gameHitTest():void{
            // 敌方子弹与主战机
            if (GameData.myPlane.isInHurt() == false)
            {
                let enemy_bullet_reclaim_list:Bullet[] = [];
                for (let index:number = 0; index < GameData.enemyBulletOnStage.length; ++index){
                    let enemy_bullet_obj:Bullet = GameData.enemyBulletOnStage[index];

                    if (HitTest.hitTestP(GameData.myPlane, enemy_bullet_obj, true)){
                        GameData.myPlane.blood -= enemy_bullet_obj.damage;
                        GameData.InfoPanelObj.updateBlood(GameData.myPlane.blood);
                        
                        enemy_bullet_reclaim_list.push(enemy_bullet_obj);
                        
                        // 开始处于受到伤害期间
                        GameData.myPlane.hurtStart();
                        break;              // 避免同时受到两发以上伤害
                    }
                }
                this.reclaimMovableBitMapHelp(GameData.enemyBulletOnStage, enemy_bullet_reclaim_list, Bullet.reclaimBullet);
            }
            
            // 我方主战机与敌方战机
            if (GameData.myPlane.isInHurt() == false)
            {
                for (let index:number = 0; index < GameData.enemyPlaneOnStage.length; ++index){
                    let enemy_plane_obj:PlaneBase = GameData.enemyPlaneOnStage[index];

                    if (HitTest.hitTestP(enemy_plane_obj, GameData.myPlane)){
                        GameData.myPlane.blood -= 100;                  // 直接死亡
                        GameData.InfoPanelObj.updateBlood(GameData.myPlane.blood);
                        break;                                          // 避免同时受到两发以上伤害
                    }
                }
            }

            // 我方主战机与陨石
            if (GameData.myPlane.isInHurt() == false)
            {
                for (let index:number = 0; index < GameData.aeroliteOnStage.length; ++index){
                    let aerolite_obj:Aerolite = GameData.aeroliteOnStage[index];

                    if (HitTest.hitTestP(aerolite_obj, GameData.myPlane)){
                        GameData.myPlane.blood -= 100;                  // 直接死亡
                        GameData.InfoPanelObj.updateBlood(GameData.myPlane.blood);
                        break;                                          // 避免同时受到两发以上伤害
                    }
                }
            }

            // 我方主战机与power
            let power_reclaim_list:Power[] = [];
            for (let index:number = 0; index < GameData.powerOnStage.length; ++index){
                let power_obj:Power = GameData.powerOnStage[index];

                if (HitTest.hitTestP(GameData.myPlane, power_obj)){
                    power_obj.powerWork(GameData.myPlane);
                    this.get_power_music.play(0,1);
                    power_reclaim_list.push(power_obj)
                }
            }
            this.reclaimMovableBitMapHelp(GameData.powerOnStage, power_reclaim_list, Power.reclaimPower);

            // 我方子弹与敌方战机
            let mybullet_reclaim_list_2:Bullet[] = [];
            let enemy_plane_reclaim_list:PlaneBase[] = [];
            for (let index:number = 0; index < GameData.myBulletOnStage.length; ++index){
                let my_bullet_obj:Bullet = GameData.myBulletOnStage[index];

                for (let index_2:number = 0; index_2 < GameData.enemyPlaneOnStage.length; ++index_2)
                {
                    let enemy_plane_obj:PlaneBase = GameData.enemyPlaneOnStage[index_2];

                    // 敌机其实已经坏了
                    if (enemy_plane_obj.blood <= 0){
                        // console.log(`敌机其实已经坏了, ${enemy_plane_obj.blood}, ${enemy_plane_obj.plane_type}`);
                        continue;
                    }
                    
                    if (HitTest.hitTestP(enemy_plane_obj, my_bullet_obj)){
                        enemy_plane_obj.blood -= my_bullet_obj.damage;
                        // console.log(`hit enemy_plane, ${my_bullet_obj.damage}, ${enemy_plane_obj.blood}, ${enemy_plane_obj.plane_score}`);
                        if (enemy_plane_obj.blood <= 0){
                            // 敌机被打爆
                            GameData.Score += enemy_plane_obj.plane_score;
                            GameData.InfoPanelObj.updateScore();
                            this.createBomb(enemy_plane_obj);
                            enemy_plane_reclaim_list.push(enemy_plane_obj);

                            // Boss被打败
                            if (enemy_plane_obj.plane_type == 7){
                                // 停止其他战机或物品的计时
                                this.startTimeCount();

                                // 更换music
                                this.bg_music_channel.stop();
                                this.bg_music_channel = this.bg_music1.play(0, -1);
                                this.bg_music_channel.volume = 0.4;
                            }

                        }
                        mybullet_reclaim_list_2.push(my_bullet_obj);
                        break;                  // 一颗子弹同时只能打击一个目标
                    }
                }
            }
            this.reclaimMovableBitMapHelp(GameData.myBulletOnStage, mybullet_reclaim_list_2, Bullet.reclaimBullet);
            this.reclaimMovableBitMapHelp(GameData.enemyPlaneOnStage, enemy_plane_reclaim_list, PlaneFactory.reclaimPlaneObjToCache);

            // 我方子弹与陨石
            let mybullet_reclaim_list:Bullet[] = [];
            let aerolite_reclaim_list:Aerolite[] = [];
            for (let index:number = 0; index < GameData.myBulletOnStage.length; ++index){
                let my_bullet_obj:Bullet = GameData.myBulletOnStage[index];

                for (let index_2:number = 0; index_2 < GameData.aeroliteOnStage.length; ++index_2)
                {
                    let aerolite_obj:Aerolite = GameData.aeroliteOnStage[index_2];

                    // 陨石其实已经坏了
                    if (aerolite_obj.blood <= 0)
                        continue;

                    if (HitTest.hitTestP(aerolite_obj, my_bullet_obj)){
                        aerolite_obj.blood -= my_bullet_obj.damage;
                        if (aerolite_obj.blood <= 0){
                            // 陨石被打爆，产生power
                            GameData.Score += 50;
                            GameData.InfoPanelObj.updateScore();
                            this.createBomb(aerolite_obj);
                            this.createPower(aerolite_obj);
                            aerolite_reclaim_list.push(aerolite_obj);
                        }
                        mybullet_reclaim_list.push(my_bullet_obj);
                        break;                  // 一颗子弹同时只能打击一个目标
                    }
                }
            }
            this.reclaimMovableBitMapHelp(GameData.myBulletOnStage, mybullet_reclaim_list, Bullet.reclaimBullet);
            this.reclaimMovableBitMapHelp(GameData.aeroliteOnStage, aerolite_reclaim_list, Aerolite.reclaimAerolite);

            // 我的飞机血量
            if (GameData.myPlane.blood <= 0)
                this.gameStop();
    }
}