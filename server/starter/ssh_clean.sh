#!/bin/bash

ssh pi@raspberrypi.local -t 'sudo systemctl stop beetest && sudo systemctl stop fairostest && sudo rm -rf /var/lib/bee-test/localstore/ && sudo rm -rf /root/.fairOS/dfs-test && sudo systemctl start beetest && sudo systemctl start fairostest'
