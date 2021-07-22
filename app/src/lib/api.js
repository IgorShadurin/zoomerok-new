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

    const url = `${this.serverUrl}/${method}`;
    return fetch(url, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(sendData)
    })
      .then(data => data.json());
  }

  async postForm(method, formData, isSendLoginPassword = true) {
    if (isSendLoginPassword) {
      formData.append('username', this.username);
      formData.append('password', this.password);
    }

    const url = `${this.serverUrl}/${method}`;
    const data = await fetch(url, {
      method: 'POST',
      body: formData
    });
    return data.json();
  }

  setCredentials(username, password) {
    this.username = username;
    this.password = password;
  }

  login() {
    return this.postJson('user/login');
  }

  register(username, password, mnemonic = '') {
    return this.postJson('user/new', {username, password, mnemonic}, false);
  }

  addFriend(reference) {
    return this.postJson('feed/friend/add', {reference});
  }

  getVideos() {
    return this.postJson('feed/friend/get-videos');
  }

  getMyVideos() {
    return this.postJson('feed/friend/get-my-videos');
  }

  getUserVideos(pod) {
    return this.postJson('feed/friend/get-user-videos', {pod});
  }

  getMyReference() {
    return this.postJson('feed/friend/get-my-reference');
  }

  getStaticUrl(pod, name) {
    return `${this.staticUrl}/${pod}/${name}`.toLowerCase();
  }

  uploadVideo(uri, description) {
    const type = `video/mp4`;
    const formData = new FormData();
    formData.append('description', description);
    formData.append('video', {
      name: 'video',
      type,
      uri
    });
    return this.postForm('feed/friend/upload', formData);
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
