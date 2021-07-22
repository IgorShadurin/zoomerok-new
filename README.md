# Zoomerok - fair video platform

Are you Zoomer? OK, it doesn't matter. Everyone deserves fair platform for their content.

The platform was created by content creators who have been interfered with by large corporations and have been removed
from major social networks. After the removal, the authors lost all their many years of work: photos, videos, articles
and fan base. Just at the snap of the fingers. Without possibility to recover any piece of data.

The idea of creating a project where only content creators will own their content and their fan base has been in the air
for many years.

Right now, the world is changing and fair finance ([Ethereum](https://ethereum.org/en/)
, [Bitcoin](https://bitcoin.org/en/)), an fair data registry (Ethereum, [xDai](https://www.xdaichain.com/)) and a fair
data storage ([SWARM](https://github.com/ethersphere/bee), [FairOS](https://github.com/fairDataSociety/fairOS-dfs)) are
becoming available to all people in the world.

Based on these technologies, a mobile application was created with one of the most trending types of content - short
videos. Anyone in the world can become a content producer on our test* platform.

## How does the project work?

The mobile app is built on top of [React Native](https://reactnative.dev/) and supports Android and iOS mobile
platforms.

[FairOS](https://github.com/fairDataSociety/fairOS-dfs) is used as an authentication and data management system, which
operates on the basis of the [SWARM](https://github.com/ethersphere/bee) decentralized data storage system.

For reliable access to your account and fan base, a Web3 sign-on
solution [GetLogin](https://github.com/GetLoginEth/login) is being developed and planned for implementation.

A distinctive feature of the project is that all your content can be accessed from applications that support the FairOS
API. For example, [Fairdrive](https://github.com/fairDataSociety/fairdrive-theapp). You always have a choice with which
tool you will create/consume content.

To access your data, the application contacts the servers, which have access to all the latest updates from users of the
decentralized system. If you do not want a third-party server to see which resources you are accessing and from which IP
address, then you can always independently launch the local version of the server and connect it to the mobile
application. This will keep the network truly decentralized.

## Server installation

You could setup all software stack with Docker. This is fastest way. Let's start.

###  Install Docker

Tested on Ubuntu 18.04.1 LTS and Ubuntu 20.04.2.

`curl -sSL https://get.docker.com | sh`

`sudo usermod -aG docker ${USER}`

`sudo apt-get install libffi-dev libssl-dev`

`sudo apt install python3-dev`

`sudo apt-get install -y python3 python3-pip`

`sudo pip3 install docker-compose`

`sudo systemctl enable docker`

### Install server software

`mkdir zoo bee-docker-data dfs-docker-data zoomerok-docker-data`

Inside `zoo` will be stored `docker-compose.yml`. In `bee-docker-data` data for bee node.
In `dfs-docker-data` will be stored FairOS related content. In `zoomerok-docker-data` static cached
data (video, photo) from FairOS that accessible from mobile devices.

`chmod 0777 bee-docker-data dfs-docker-data zoomerok-docker-data`

`cd zoo`

`wget https://raw.githubusercontent.com/IgorShadurin/zoomerok-new/master/docker-compose.yml`

Fix your local paths for bee, fairos, zoo. For example this path from your local
machine `/home/ubuntu/zoomerok-docker-data`. Change it to correct one.

Define correct `cors-origins` and `cookieDomain` for your domains.

Start all stack. Fund bee node.

`docker-compose up`

Restart in detached mode.

`docker-compose up -d`

TODO: Setup your server software to host static data and redirect 8080 port from your machine to https.

### Urls

Docker repo: https://hub.docker.com/r/sdancer/zoomerok-fds-server

### Disclaimer

* There is an active development phase in the SWARM and Ethereum testnets. Therefore, the creators of the project do not
  give any guarantee for the preservation of data in these networks and Zoomerok application. Use the project for
  informational purposes only.
