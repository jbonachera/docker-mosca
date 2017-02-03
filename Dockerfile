FROM jbonachera/arch

RUN pacman -S --noconfirm nodejs npm
COPY . /usr/share/mqtt-broker
WORKDIR /usr/share/mqtt-broker
RUN npm install
EXPOSE 1883
CMD node /usr/share/mqtt-broker/server.js
