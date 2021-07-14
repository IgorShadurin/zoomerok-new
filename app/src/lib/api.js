export default class Api {
  serverUrl = '';
  staticUrl = '';
  username = '';
  password = '';

  constructor(serverUrl = '', staticUrl = '', username = '', password = '') {
    this.serverUrl = serverUrl;
    this.staticUrl = staticUrl;
    this.setCredentials(username, password);
  }

  setServerUrl(serverUrl) {
    this.serverUrl = serverUrl;
  }

  setStaticUrl(staticUrl) {
    this.staticUrl = staticUrl;
  }

  postJson(method, data = {}, isSendLoginPassword = true) {
    let sendData = {...data};
    if (isSendLoginPassword) {
      sendData = {...sendData, ...{username: this.username, password: this.password}}
    }

    return fetch(`${this.serverUrl}/${method}`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(sendData)
    })
      .then(data => data.json());
  }

  setCredentials(username, password) {
    this.username = username;
    this.password = password;
  }

  login() {
    return this.postJson('user/login');
  }

  getVideos() {
    return this.postJson('feed/friend/get-videos');
  }

  getStaticVideo(/*podOwnerAddress, */pod, name) {
    // return `${this.staticUrl}/${podOwnerAddress}/${pod}/${name}`;
    return `${this.staticUrl}/${pod}/${name}`;
  }
}

/**
 * @type Api
 */
export let apiInstance;

export function getApi() {
  if (!apiInstance) {
    apiInstance = new Api();
  }

  return apiInstance;
}
