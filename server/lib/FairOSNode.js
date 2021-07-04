const fetch = require('node-fetch');
const {FormData, File} = require('formdata-node');
const {Encoder} = require('form-data-encoder');
const {Readable} = require('stream');

module.exports = class FairOS {
    apiUrl;
    cookie = '';
    isNew = false;

    constructor(apiUrl = 'http://localhost:9090/v1/', isNew = false) {
        // constructor(apiUrl = `${process.env.REACT_APP_FAIROSHOST}/v1/`) {
        this.apiUrl = apiUrl;
        this.isNew = isNew;
    }

    api(method, url, formData = {} | FormData, type = 'json', result = 'default', customHeaders = '') {
        let headers = type === 'json' ? {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Cookie': this.cookie
        } : {
            'Cookie': this.cookie
        };
        if (customHeaders) {
            headers = {
                'Cookie': this.cookie,
                ...formData.getHeaders()
            };
            console.log(headers);
        }
        const postData = (method === 'POST' || method === 'DELETE') ? {
            method: method,
            headers,
            // todo check is work if received formData as object
            body: type === 'json' ? JSON.stringify(formData) : formData,
            credentials: 'include'
        } : {
            method: method,
            headers: {
                'Cookie': this.cookie
            },
            credentials: 'include'
        };

        return fetch(url, postData).then(data => {
            // console.log(data.headers.raw()['set-cookie']);
            let receivedCookie = data.headers.raw()['set-cookie'];
            if (receivedCookie && receivedCookie.length) {
                receivedCookie = receivedCookie[0].split(';');
                if (receivedCookie && receivedCookie.length) {
                    this.cookie = receivedCookie[0];
                }
            }

            return result === 'text' ? data.text() : data.json();
        });
    }

    isUserLoggedIn(username) {
        return this.api('GET', `${this.apiUrl}user/isloggedin?user=${username}`);
    }

    userLogin(username, password) {
        const formData = this.isNew ? {
            user_name: username,
            password
        } : {};
        return this.api('POST', this.isNew ? `${this.apiUrl}user/login` : `${this.apiUrl}user/login?user=${username}&password=${password}`, formData);
    }

    userSignup(username, password, mnemonic = '') {
        const formData = this.isNew ? {
            user_name: username,
            password,
            mnemonic
        } : {};
        return this.api('POST', this.isNew ? `${this.apiUrl}user/signup` : `${this.apiUrl}user/signup?user=${username}&password=${password}&mnemonic=${mnemonic}`, formData);
    }

    // signup(username, password, mnemonic) {
    //     let formData = new FormData();
    //     formData.append('user_name', username);
    //     formData.append('password', password);
    //     formData.append('mnemonic', mnemonic);
    //     return this.api('POST', `${this.apiUrl}user/signup`, formData);
    // }

    podOpen(pod, password) {
        const formData = this.isNew ? {pod_name: pod, password} : {};
        return this.api('POST', this.isNew ? `${this.apiUrl}pod/open` : `${this.apiUrl}pod/open?pod=${pod}&password=${password}`, formData);
    }

    mkdir(pod, dir) {
        const formData = {pod_name: pod, dir_path: dir};
        return this.api('POST', `${this.apiUrl}dir/mkdir`, formData);
    }

    podShare(pod, password) {
        const formData = {pod_name: pod, password};
        return this.api('POST', this.isNew ? `${this.apiUrl}pod/share` : `${this.apiUrl}pod/share?pod=${pod}&password=${password}`, formData);
    }

    // fileShare(file) {
    //     const formData = {file};
    //     return this.api('POST', this.isNew ? `${this.apiUrl}file/share` : `${this.apiUrl}file/share?file=${file}`, formData);
    // }

    podNew(pod, password) {
        const formData = this.isNew ? {
            pod_name: pod, password
        } : {};
        return this.api('POST', this.isNew ? `${this.apiUrl}pod/new` : `${this.apiUrl}pod/new?password=${password}&pod=${pod}`, formData);
    }

    podReceive(reference) {
        return this.api('GET', this.isNew ? `${this.apiUrl}pod/receive?sharing_ref=${reference}` : `${this.apiUrl}pod/receive?ref=${reference}`);
    }

    podReceiveInfo(reference) {
        return this.api('GET', this.isNew?`${this.apiUrl}pod/receiveinfo?sharing_ref=${reference}`:`${this.apiUrl}pod/receiveinfo?ref=${reference}`);
    }

    dirLs(podName, dir = '/') {
        return this.api('GET', this.isNew ? `${this.apiUrl}dir/ls?pod_name=${podName}&dir_path=${dir}` : `${this.apiUrl}dir/ls?dir=${dir}`);
    }

    podLs() {
        return this.api('GET', `${this.apiUrl}pod/ls`);
    }

    kvLs(podName) {
        return this.api('GET', `${this.apiUrl}kv/ls?pod_name=${podName}`);
    }

    kvGet(podName, tableName, key) {
        return this.api('GET', this.isNew ? `${this.apiUrl}kv/entry/get?pod_name=${podName}&table_name=${tableName}&key=${key}` : `${this.apiUrl}kv/entry/get?name=${tableName}&key=${key}`);
    }

    kvLoadCsv(podName, tableName, csv) {
        let formData = new FormData();
        formData.append('csv', new Blob([csv], {
            encoding: "UTF-8",
            type: "text/csv;charset=UTF-8"
        }), '1.csv');
        // formData.append('table_name', tableName);
        return this.api('POST', `${this.apiUrl}kv/loadcsv?pod_name=${podName}&table_name=${tableName}`, formData, 'multi');
    }

    kvCount(podName, kvName) {
        let formData = new FormData();
        formData.append('table_name', kvName);
        formData.append('pod_name', podName);
        return this.api('POST', `${this.apiUrl}kv/count?pod_name=${podName}`, formData);
    }

    kvOpen(podName, kvName) {
        const formData = this.isNew ? {table_name: kvName} : {};
        return this.api('POST', this.isNew ? `${this.apiUrl}kv/open?pod_name=${podName}` : `${this.apiUrl}kv/open?name=${kvName}`, formData);
    }

    kvNew(podName, kvName) {
        const formData = {table_name: kvName};
        return this.api('POST', `${this.apiUrl}kv/new?pod_name=${podName}`, formData);
    }

    kvPut(podName, kvName, key, value) {
        const formData = {table_name: kvName, key, value};
        return this.api('POST', `${this.apiUrl}kv/entry/put?pod_name=${podName}`, formData);
    }

    kvDelete(podName, kvName) {
        const formData = {table_name: kvName};
        return this.api('POST', `${this.apiUrl}kv/delete?pod_name=${podName}`, formData, 'json', 'text');
    }

    fileDownload(podName, file) {
        return this.api('POST', this.isNew ? `${this.apiUrl}file/download?pod_name=${podName}&file_path=/${file}` : `${this.apiUrl}file/download?file=/${file}`, {}, 'etc', 'text');
    }

    fileDelete(podName, file) {
        const formData = {file_path: '/' + file, pod_name: podName};

        return this.api('DELETE', this.isNew ? `${this.apiUrl}file/delete?pod_name=${podName}&file_path=/${file}` : `${this.apiUrl}file/delete?file=/${file}`, formData);
    }

    fileUpload(content, fileName, pod) {
        const file = new File([content], fileName);
        let formData = new FormData();
        if (this.isNew) {
            formData.set("files", file);
            formData.set("dir_path", '/');
            formData.set("block_size", '64Mb');
        } else {
            formData.set("files", file);
            formData.set("pod_dir", '/');
            formData.set("block_size", '1Mb');
        }

        const encoder = new Encoder(formData);
        const url = this.isNew ? `${this.apiUrl}file/upload?pod_name=${pod}&dir_path=/&block_size=64Mb` : `${this.apiUrl}file/upload`;
        const postData = {
            method: 'POST',
            headers: {
                'Cookie': this.cookie,
                ...encoder.headers
            },
            body: Readable.from(encoder.encode()),
            credentials: 'include'
        };

        return fetch(url, postData).then(data => data.json());
    }

    async openAll(password) {
        const pods = await this.podLs();
        for (let pod of [...pods.shared_pod_name, ...pods.pod_name]) {
            await this.podOpen(pod, password);
            const kvs = await this.kvLs(pod);
            if (kvs.Tables) {
                for (let kv of kvs.Tables) {
                    await this.kvOpen(pod, kv.table_name);
                    // await this.kvCount(pod, kv.table_name);
                }
            }
        }
    }

    async getMapsIndex(password) {
        let index = {
            pods: [],
            // urlNotFound: 'https://sometileurl.com'
        };
        const pods = await this.podLs();
        for (let pod of [...pods.shared_pod_name, ...pods.pod_name]) {
            const mapIndex = await this.getPodIndex(pod, password);
            index.pods.push(mapIndex);
        }

        // await this.kvLoadCsv('maps', 'sw', localStorage.getItem('osm_sw'));
        // await this.kvLoadCsv('czech_shadurin_map', 'map', localStorage.getItem('osm_cz'));

        return index;
    }

    async getPodIndex(pod, password) {
        let result = null;
        await this.podOpen(pod, password);
        const kvs = await this.kvLs(pod);
        if (kvs.Tables) {
            for (let kv of kvs.Tables) {
                await this.kvOpen(pod, kv.table_name);
                let mapIndex = await this.kvGet(pod, kv.table_name, 'map_index');
                if (mapIndex.code !== 500 && mapIndex.values) {
                    mapIndex = atob(mapIndex.values)
                    if (mapIndex.indexOf('map_index,') === -1) {
                        continue;
                    }

                    mapIndex = mapIndex.replace('map_index,', '');
                    mapIndex = mapIndex.replaceAll('""', '"');
                    mapIndex = mapIndex.slice(1, -1);
                    mapIndex = JSON.parse(mapIndex);
                    result = {
                        pod,
                        kv: kv.table_name,
                        index: mapIndex
                    };
                }
            }
        }

        return result;
    }
}
