#!/bin/bash
export STANDALONE_SELENIUM=/opt/selenium/selenium-server-standalone-2.44.0.jar
pkill -f $STANDALONE_SELENIUM
nohup java -jar $STANDALONE_SELENIUM -role hub > selenium_hub.log &
sleep 3
nohup java -jar $STANDALONE_SELENIUM -role node -nodeConfig selenium.conf.json > selenium_node.log &
