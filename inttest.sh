#!/bin/bash
# kill any instance of local or node selenium
pkill -f selenium
pkill -f node

#start static server 
nohup node static-serve.js &
sleep 3
nightwatch




