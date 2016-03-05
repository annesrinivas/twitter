#Start with ubuntu base image
#FROM ubuntu:14.04 

FROM node:4-onbuild
EXPOSE 80

RUN \
   apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv 7F0CEB10 && \
   echo 'deb http://downloads-distro.mongodb.org/repo/ubuntu-upstart dist 10gen' | sudo tee /etc/apt/sources.list.d/mongodb.list && \
   apt-get update && \
   apt-get install -y mongodb-org

VOLUME ["/data/db"]
WORKDIR /data

EXPOSE 27017

CMD ["mongod"]

# Create app directory
RUN mkdir -p /home/sri/twitter
WORKDIR /home/sri/twitter
