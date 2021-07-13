#!/bin/bash

#CLEAR_FAIROS=" rm -rf /Users/sdancer/.fairOS/dfs-test && mkdir /Users/sdancer/.fairOS/dfs-test &&  chown -R sdancer:staff /Users/sdancer/.fairOS/dfs-test"
#CLEAR_BEE="ssh pi@raspberrypi.local -t 'sudo systemctl stop beetest && sudo rm -rf /var/lib/bee-test/localstore/ && sudo systemctl start beetest'"
#FAIROS="/Users/sdancer/Downloads/fairOS-dfs-new/dist/dfs server --cors-origins \"http://localhost:3000\" --cookieDomain localhost --beeHost raspberrypi.local --beePort 16333 --httpPort 9099 --dataDir /Users/sdancer/.fairOS/dfs-test"

#RUN="$CLEAR_FAIROS && $CLEAR_BEE && sleep 15s && $FAIROS"
#echo "$RUN"
#eval "$RUN"

RUN="./0_clear_fairos.sh && ./1_clear_bee.sh && sleep 15s && ./2_start_fairos.sh"
echo "$RUN"
eval "$RUN"
