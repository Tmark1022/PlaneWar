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
    bg_music1:egret.Sound;
    bg_music2:egret.Sound;
    bg_music_boss:egret.Sound;
    bg_music_channel:egret.SoundChannel;


    /**
     * 构造函数 
     */
    constructor(){
        super();

        // 初始化属性
        this.scroll_bg = null;
        this.enemy_plane_timer1 = new egret.Timer(1000);                    // 创建敌方飞机计时器1
        this.enemy_plane_timer2 = new egret.Timer(5000);                   // 创建敌方飞机计时器2
        this.enemy_plane_timer3 = new egret.Timer(20000);                   // 创建敌方飞机计时器3
        this.boss_plane_timer = new egret.Timer(20000);                     // Boss计时器
        this.aerolite_timer = new egret.Timer(2000);                        // 陨石计时器

        this.bullet_music = RES.getRes("bullet_mp3");
        this.bullet2_music = RES.getRes("bullet2_mp3");
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
        // 初始化GmaeData的一些需要初始化的数据
        GameData.stageW = this.stage.stageWidth;
        GameData.stageH = this.stage.stageHeight;
        GameData.targetFps = 60;
        GameData.fpsOffset = 1;
        GameData.fpsLastRecordTime = 0;
        
        // 初始化滚动背景
        this.scroll_bg = new ScrollBg();
        this.addChild(this.scroll_bg);

        // 设置事件响应
        this.enemy_plane_timer1.addEventListener(egret.TimerEvent.TIMER, this.createEnemyPlane1, this);
        this.enemy_plane_timer2.addEventListener(egret.TimerEvent.TIMER, this.createEnemyPlane2, this);
        this.enemy_plane_timer3.addEventListener(egret.TimerEvent.TIMER, this.createEnemyPlane3, this);
        this.boss_plane_timer.addEventListener(egret.TimerEvent.TIMER, this.createBossPlane, this);
        this.aerolite_timer.addEventListener(egret.TimerEvent.TIMER, this.createAerolite, this);
        
        this.addEventListener(egret.Event.ENTER_FRAME, this.updateGameView, this);


         // test
        let my_plane:PlaneBase = PlaneFactory.createPlane(1, "myplane_json.myplane");
        my_plane.addEventListener(BulletEvent.CREATE_BULLET, this.createBullet, this);
        this.addChild(my_plane);
        GameData.myPlane = <MyPlane>my_plane;

        my_plane = PlaneFactory.createPlane(2, "myplane_json.myplane_add");
        my_plane.addEventListener(BulletEvent.CREATE_BULLET, this.createBullet, this);
        this.addChild(my_plane);
        GameData.guardPlaneLeft = <GuardPlane>my_plane;

        my_plane = PlaneFactory.createPlane(2, "myplane_json.myplane_add");
        my_plane.addEventListener(BulletEvent.CREATE_BULLET, this.createBullet, this);
        this.addChild(my_plane);
        GameData.guardPlaneRight = <GuardPlane>my_plane;

        // 开始游戏
        this.gameStart();
    }

    /**
     * 开始游戏
     */
    private gameStart():any{
        this.scroll_bg.startScroll();               // 开始滚动背景
        this.startTimeCount();

        // this.bg_music_channel.stop();
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
     * 暂停游戏
     */
    private gameStop():any{
        this.scroll_bg.stopScroll();               // 停止滚动背景
        this.stopTimeCount();
    }

    /**
     * 重新游戏
     */
    private gameRestart():any{

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


        // test
        this.createPower(aerolite_obj);
        this.createBomb(GameData.myPlane);
        
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
            my_plane_obj.setBulletLevel(3);
            my_plane_obj.bullet_type = 3;
            
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
                GameData.myBulletOnStage.push(bullet_obj);
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
                GameData.myBulletOnStage.push(bullet_obj);
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
                GameData.myBulletOnStage.push(bullet_obj);
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

        // 回收飞出边界的可移动对象
        for (let index:number = 0; index < reclaim_list.length; ++index){
            let reclaim_obj:MovableBitMap = reclaim_list[index];

            this.removeChild(reclaim_obj);
            on_stage_list.splice(on_stage_list.indexOf(reclaim_obj), 1);
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

    }
}