FROM alpine:3.18 AS build

RUN apk add --no-cache git build-base zlib-dev pcre-dev openssl-dev wget cmake

WORKDIR /tmp

RUN wget http://nginx.org/download/nginx-1.25.4.tar.gz && \
    tar -zxvf nginx-1.25.4.tar.gz && \
    git clone --recursive https://github.com/google/ngx_brotli.git


WORKDIR /tmp/ngx_brotli/deps/brotli


RUN mkdir -p out && cd out && cmake -DCMAKE_BUILD_TYPE=Release .. && make

WORKDIR /tmp/nginx-1.25.4

RUN ./configure \
    --prefix=/etc/nginx \
    --add-module=../ngx_brotli \
    --with-http_gzip_static_module \
    --with-http_ssl_module \
    --with-http_v3_module && \
    make && make install

FROM alpine:3.18

RUN apk add --no-cache libgcc libstdc++ brotli pcre && mkdir -p /var/log/nginx && touch /var/log/nginx/error.log

COPY --from=build /etc/nginx /etc/nginx



EXPOSE 80
EXPOSE 443

CMD ["/etc/nginx/sbin/nginx", "-g", "daemon off;"]
