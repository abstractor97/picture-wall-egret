class Main extends egret.DisplayObjectContainer {
  // private swiper: swiper.Swiper;
  public constructor() {
    super();
    this.addEventListener(egret.Event.ADDED_TO_STAGE, this._onAddToStage, this);
  }

  private _onAddToStage() {
    this.touchEnabled = true;
    let count = 8;
    let radius = 100;
    let center = new egret.Point(200, 200);
    let perDeg = 360 / count;
    _.times(count, (index) => {
      let item = new Item(10, 10);
      let deg = perDeg * index;
      let pos = util.cyclePoint(center, radius, deg);
      item.x = pos.x;
      item.y = pos.y;
      this.addChild(item);
    });
    let r = new Repel(0, 0, 100, 1);
    // r.toStrong(0, 2000, () => {
    //   console.log('done!');
    // });
    egret.Ticker.getInstance().register(this._animate, this);
    let p = new egret.Point();
    console.log(typeof p);
  }

  private _animate() {
    TWEEN.update();
  }

  // private _addSwiper() {
  //   this.swiper = new swiper.Swiper({
  //     viewHeight: 100,
  //     viewWidth: 500,
  //     slideWidth: 100,
  //     slideHeight: 100,
  //     activeCenter: false,
  //     loop: true,
  //     effect: 'carrousel',
  //     carrousel: {
  //       minScale: 0.1,
  //       radius: 100
  //     }
  //   });
  //   this.swiper.x = 10;
  //   this.swiper.y = 30;
  //   let t1 = new egret.TextField();
  //   let t2 = new egret.TextField();
  //   let t3 = new egret.TextField();
  //   let t4 = new egret.TextField();
  //   let t5 = new egret.TextField();
  //   let t6 = new egret.TextField();
  //   let t7 = new egret.TextField();
  //   let t8 = new egret.TextField();
  //   let t9 = new egret.TextField();
  //   let t10 = new egret.TextField();
  //   t1.text = '0';
  //   t2.text = '1';
  //   t3.text = '2';
  //   t4.text = '3';
  //   t5.text = '4';
  //   t6.text = '5';
  //   t7.text = '6';
  //   t8.text = '7';
  //   t9.text = '8';
  //   t10.text = '9';
  //   t1.textColor = t2.textColor = t5.textColor = t3.textColor = t4.textColor = t6.textColor = t7.textColor = t8.textColor = t9.textColor = t10.textColor = 0x000000;
  //   this.swiper
  //     .addSlide(t1)
  //     .addSlide(t2)
  //     .addSlide(t3)
  //     .addSlide(t4)
  //     .addSlide(t5)
  //     .start();
  //   this.swiper.onChange = function(activeIndex: number, preActiveIndex: number) {
  //     console.log(`active index changed from ${preActiveIndex} to ${activeIndex}.`);
  //   };
  //   this.addChild(this.swiper);
  // }
}
