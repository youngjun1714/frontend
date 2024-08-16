#!/bin/bash
set -xe

sudo -i -u ec2-user bash << EOF
cd /home/ec2-user/Artiside-frontend
pm2 start ./ecosystem.config.js
EOF
