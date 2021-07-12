export default class Api {
  serverUrl = '';
  username = '';
  password = '';

  constructor(serverUrl = '', username = '', password = '') {
    this.serverUrl = serverUrl;
    this.setCredentials(username, password);
  }

  setServerUrl(serverUrl) {
    this.serverUrl = serverUrl;
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
