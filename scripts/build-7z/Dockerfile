FROM ubuntu:26.04
ENV DEBIAN_FRONTEND=noninteractive
RUN apt-get update
RUN apt-get install -y wget cmake make build-essential python3 git p7zip nodejs npm

WORKDIR /
RUN git clone https://github.com/emscripten-core/emsdk.git
WORKDIR /emsdk
RUN git checkout 6.0.9
RUN ./emsdk install latest
RUN ./emsdk activate latest

WORKDIR /emsdk/upstream/emscripten
RUN npm ci

WORKDIR /7z-src
RUN wget https://www.7-zip.org/a/7z2602-src.7z
RUN p7zip -d 7z2602-src.7z

WORKDIR /app