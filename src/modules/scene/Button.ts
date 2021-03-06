namespace scene {

  /**
   * @class Button 类，展示为一个圆形的按钮，可设置背景色，图标，大小
   * @author HuangYaxiong <hyxiong@qq.com>
   */
  export class Button extends egret.DisplayObjectContainer {
    /**
     * 半径
     */
    private _radius: number;
    /**
     * 背景色
     */
    private _bgColor: number;
    /**
     * 图标 Texture 对象
     */
    private _iconTexture: egret.Texture;
    /**
     * 按钮主体 Shape 对象
     */
    private _shape: egret.Shape;
    /**
     * 图标 Bitmap 对象
     */
    private _icon: egret.Bitmap;
    /**
     * bling bling 的外框
     */
    private _outline: egret.Shape;
    /**
     * 屏幕 dpi
     */
    private _dpi: number = 1;
    /**
     * 关联的 Tween 对象数组
     */
    public tweens: TWEEN.Tween[] = [];
    /**
     * 标签
     */
    public label: egret.TextField;
    /**
     * label 动画的 tween
     */
    public labelTween: TWEEN.Tween;
    /**
     * 关联的 Tween 对象的 obj
     */
    public twObj: any;
    /**
     * 点击按钮时的回调方法
     */
    public onClick: (event?: egret.TouchEvent) => any;

    /**
     * @constructor 生成一个 Button 实例
     * @param radius {number} 半径大小
     * @param bgColor {number} 背景色
     * @param iconTexture {egret.Texture} 图标纹理 Texture 对象的
     * @param showOutline {boolean} 是否显示发光外框
     */
    constructor(radius: number, bgColor: number, iconTexture: egret.Texture, lableStr?: string , showOutline: boolean = true, dpi: number = 1) {
      super();
      this._radius = radius * dpi;
      this._bgColor = bgColor;
      this._iconTexture = iconTexture;
      if (iconTexture) {
        refManager.TextureManager.addRef(iconTexture);
      }
      this._dpi = dpi;
      this._createShape();
      this._createIcon();
      this._createLabel(lableStr);
      this._createOutline(showOutline);
    }

    /**
     * @public
     * @get 获取 icon 图片Texture
     */
    public get iconTexture(): egret.Texture {
      return this._iconTexture;
    }

    /**
     * @public
     * @set 设置 icon 图片 Texture
     */
    public set iconTexture(texture: egret.Texture) {
      if (this._iconTexture) {
        refManager.TextureManager.removeRef(this._iconTexture);
      }
      this._iconTexture = texture;
      this._icon.texture = texture;
      if (this._iconTexture) {
        refManager.TextureManager.addRef(this._iconTexture);
      }
    }

    /**
     * @public 清除关联的所有 Tween 对象
     */
    public clearTweens() {
      _.forEach(this.tweens, (tw) => {
        tw.stop();
        TWEEN.remove(tw);
      });
      this.tweens = [];
    }

    /**
     * @private 创建按钮主体 Shape 对象
     */
    private _createShape() {
      this._shape = new egret.Shape();
      const g = this._shape.graphics;
      g.beginFill(this._bgColor);
      g.drawCircle(0, 0, this._radius);
      g.endFill();
      this.addChild(this._shape);
      this._shape.touchEnabled = true;
      this._shape.addEventListener(egret.TouchEvent.TOUCH_TAP, this._onClickFunc, this);
    }

    /**
     * @private
     */
    private _onClickFunc(event: egret.TouchEvent) {
        if (this.onClick) {
          this.onClick(event);
        }
    }

    /**
     * @private 创建按钮图标
     */
    private  _createIcon() {
      this._icon = new egret.Bitmap(this._iconTexture);
      this._icon.width = this._radius * 2;
      this._icon.height = this._radius * 2;
      this._icon.x = -this._radius;
      this._icon.y = -this._radius;
      this.addChild(this._icon);
    }

    /**
     * @private 创建标签文字
     */
    private _createLabel(labelStr?: string) {
      if (!labelStr) {
        return;
      }
      this.label = new egret.TextField;
      this.label.text = labelStr;
      this.label.textColor = this._bgColor;
      this.label.backgroundColor = 0xffffff;
      this.label.size = 12 * this._dpi;
      this.label.x = -this.label.width / 2;
      this.label.y = this.label.height * 1.5;
      this.label.alpha = 0;
      this.addChild(this.label);
    }

    /**
     *  显示标签
     */
    public showLable() {
      if (!this.label || this.label.alpha === 1) {
        return;
      }
      if (this.labelTween) {
        this.labelTween.stop();
        TWEEN.remove(this.labelTween);
      }
      let label = this.label;
      let tween = new TWEEN.Tween(this.label)
        .to({alpha: 1}, 500)
        .onComplete(() => {
          this.labelTween = null;
        })
        .start();
      this.labelTween = tween;
    }

    /**
     * 隐藏标签
     */
    public hideLable() {
      if (!this.label || this.label.alpha === 0) {
        return;
      }
      if (this.labelTween) {
        this.labelTween.stop();
        TWEEN.remove(this.labelTween);
      }
      let label = this.label;
      let tween = new TWEEN.Tween(this.label)
        .to({alpha: 0}, 500)
        .onComplete(() => {
          this.labelTween = null;
        })
        .start();
      this.labelTween = tween;
    }

    /**
     * @public 销毁实例
     */
    public destroy() {
      if (this._iconTexture) {
        refManager.TextureManager.removeRef(this._iconTexture);
        this._iconTexture = null;
      }
      this._shape.removeEventListener(egret.TouchEvent.TOUCH_TAP, this._onClickFunc, this);
      this._shape = null;
      this._icon = null;
      this._outline = null;
      this.clearTweens();
      this.label = null;
      TWEEN.remove(this.labelTween);
      this.labelTween = null;
      this.twObj = null;
      this.onClick = null;
    };

    /**
     * 创建发光外框
     */
    private _createOutline(showOutline: boolean) {
      if (!showOutline) {
        return;
      }
      this._outline = new egret.Shape();
      const g = this._outline.graphics;
      g.lineStyle(5 * this._dpi, 0xffffff);
      g.drawCircle(0, 0, this._radius);
      g.endFill();
      this._outline.alpha = 0.5;
      this.addChildAt(this._outline, 0);
      let tw = new TWEEN.Tween(this._outline)
        .delay(500)
        .easing(TWEEN.Easing.Cubic.Out)
        .to({
          scaleX: 2,
          scaleY: 2,
          alpha: 0
        }, 1000)
        .repeat(Infinity)
        .start();
    }
  }
}
