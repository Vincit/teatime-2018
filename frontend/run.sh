#!/bin/sh

envsubst '${LB_IP_ADDR}' < /etc/nginx/nginx.conf.tmpl > /etc/nginx/nginx.conf

exec nginx -g "daemon off;"

