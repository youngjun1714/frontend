#!/bin/bash
set -x

sudo -i -u ec2-user bash << EOF
cd /home/ec2-user/Artiside-frontend
pm2 delete artiside
EOF
