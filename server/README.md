# How to start?

TODO

# How to test?

Copy `node-config/run-bee-prod.sh` to machine which will store Bee data. Replace `YOUR_XDAI_ENDPOINT_HERE` with you xDai
node endpoint and `YOUR_STORAGE_PASSWORD_HERE` replace with Bee storage password.

`chmod +x ./run-bee-prod.sh`

`sudo ./run-bee-prod.sh`

Run FairOS instance. If you are using Raspberry PI, then you need to run it manually as there is no RaspberryPI version
on Docker Hub.

`cp .env.example .env` then fill params

Run Bee node in production with

Before test start:

1 - Start cleaner

Use ```--runInBand``` for ```jest```

Tested with

Bee: 1.4.1

FairOS-dfs: ~
