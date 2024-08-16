#!/bin/bash
set -xe

cp /home/ec2-user/env/.env-artiside /home/ec2-user/Artiside-frontend/.env

chown -R ec2-user:ec2-user /home/ec2-user/Artiside-frontend

sudo -i -u ec2-user bash << EOF
cd /home/ec2-user/Artiside-frontend

yarn
yarn build
EOF
