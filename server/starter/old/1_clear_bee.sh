#!/bin/bash

ssh pi@raspberrypi.local -t 'sudo systemctl stop beetest && sudo rm -rf /var/lib/bee-test/localstore/ && sudo systemctl start beetest'
