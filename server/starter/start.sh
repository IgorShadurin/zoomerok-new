#!/bin/bash

CLEAR_FAIROS="sudo rm -rf /Users/sdancer/.fairOS/dfs-test && mkdir /Users/sdancer/.fairOS/dfs-test && sudo chown -R sdancer:staff /Users/sdancer/.fairOS/dfs-test"
CLEAR_BEE="ssh pi@raspberrypi.local -t 'sudo systemctl stop beetest && sudo rm -rf /var/lib/bee-test/localstore/ && sudo systemctl start beetest'"
FAIROS="/Users/sdancer/Downloads/fairOS-dfs-new/dist/dfs server --cors-origins \"http://localhost:3000\" --cookieDomain localhost --beeHost raspberrypi.local --beePort 16333 --httpPort 9099 --dataDir /Users/sdancer/.fairOS/dfs-test"
#BEE="ls -l"
RUN="$CLEAR_FAIROS && $CLEAR_BEE && sleep 15s && $FAIROS"
echo "$RUN"
eval "$RUN"
