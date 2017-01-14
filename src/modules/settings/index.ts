namespace settings {

  interface IAppSettings {
    sceneWidth: number;
    sceneHeight: number;
    rowCount: number;
    padding: number;
    speed: number;
    sceneChangeTime: number;
    apiList: string[];
    bgColor: string;
    bgImage: string;
    autoResetTime: number;
    [key: string]: any;
  }

  export let appSettings: IAppSettings;

  export function init() {
    window.onload = _init;
  }

  const defaultSetting: IAppSettings = {
    sceneWidth: 1366,
    sceneHeight: 768,
    padding: 30,
    rowCount: 6,
    speed: 1,
    bgColor: '#f2f2f2',
    bgImage: '/assets/images/bg/bg.jpg',
    sceneChangeTime: 120,
    autoResetTime: 30,
    apiList: ['/api/items.json', '/api/items-2.json']
  };

  let settingsDiv: HTMLElement;
  let settingsForm: HTMLFormElement;
  let egretPlayerDiv: HTMLElement;

  function _init() {
    settingsDiv = document.getElementById('settings');
    egretPlayerDiv = document.getElementById('egret-player');
    settingsForm = settingsDiv.getElementsByTagName('form')[0];

    appSettings = _.assign(
      {},
      defaultSetting,
      getStorageSettings()
    );

    setSettingsValueToForm(appSettings, settingsForm);

    settingsForm.onsubmit = function(e) {
      e.preventDefault();
      appSettings = getFormValues(settingsForm);
      let valid = doVerify(appSettings);
      if (!valid) {
        return;
      }
      showEgretPlayer();
    };
  }

  function doVerify(settings: IAppSettings): boolean {
    if (
      _.isNaN(settings.sceneWidth)
      || _.isUndefined(settings.sceneWidth)
      || settings.sceneWidth <= 0
      || _.isNaN(settings.sceneHeight)
      || _.isUndefined(settings.sceneHeight)
      || settings.sceneHeight <= 0
      || _.isNaN(settings.rowCount)
      || _.isUndefined(settings.rowCount)
      || settings.rowCount <= 0
      || _.isNaN(settings.padding)
      || _.isUndefined(settings.padding)
      || settings.padding <= 0
      || _.isNaN(settings.speed)
      || _.isUndefined(settings.speed)
      || settings.speed <= 0
      || _.isNaN(settings.sceneChangeTime)
      || _.isUndefined(settings.sceneChangeTime)
      || settings.sceneChangeTime < 0
      || _.isNaN(settings.autoResetTime)
      || _.isUndefined(settings.autoResetTime)
      || settings.autoResetTime < 0
    ) {
      alert('数字格式不正确');
      return false;
    }
    if (!settings.apiList || !settings.apiList.length) {
      alert('请输入api列表');
      return false;
    }
    return true;
  }

  function getFormValues(form: HTMLFormElement) {
    let inputs = form.querySelectorAll('input, textarea');
    let retObj: any = {};
    _.forEach(inputs, (input) => {
      let key = input.getAttribute('name');
      let value = _.trim((<HTMLInputElement>input).value);
      let valueType = input.getAttribute('value-type');
      let parsedValue: number | string | string[];
      switch (valueType) {
        case 'int':
          parsedValue = parseInt(value, 10);
          break;
        case 'float':
          parsedValue = parseFloat(value);
          break;
        case 'string[]':
          let arr: string[] = value.split('\n');
          parsedValue = _.chain(arr)
            .map(function (v) {
              return _.trim(v);
            })
            .filter(function (v) {
              return !!v;
            })
            .value();
          break;
        default:
          parsedValue = value;
          break;
      }
      // console.log(`${key}: ${valueType} = ${parsedValue}`);
      retObj[key] = parsedValue;
    });
    return retObj;
  }

  function setSettingsValueToForm(settings: IAppSettings, form: HTMLFormElement) {
    console.log(settings);
    _.forIn(settings, (value, key) => {
      if (!value) {
        return;
      }
      let input: HTMLInputElement = <HTMLInputElement>form.querySelector(`[name="${key}"]`);
      if (input) {
        if (_.isArray(value)) {
          input.value = (<string[]>value).join('\r\n');
        } else {
          input.value = value;
        }
      }
    });
  }

  function showEgretPlayer() {
    settingsDiv.style.display = 'none';
    egretPlayerDiv.style.visibility = 'visible';
  };

  /**
   * 从 localStorage 获取设置数据
   * @return {IAppSettings}
   */
  function getStorageSettings(): IAppSettings {
    let storageSettingsStr = localStorage.getItem('picture-wall-settings');
    let storageSettings = <IAppSettings>{};
    try {
      storageSettings = JSON.parse(storageSettingsStr) || {};
    } catch (e) {
    }
    return storageSettings;
  }

  /**
   * 将设置数据写入 localStorage
   * @param settings {IAppSettings}
   */
  function saveStorageSettings(settings: IAppSettings): void {
    let settingsStr;
    try {
      settingsStr = JSON.stringify(settings);
    } catch (e) {
    }
    localStorage.setItem('picture-wall-settings', settingsStr);
  }

}
