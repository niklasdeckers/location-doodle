FROM php:7.2-cli

RUN php -r "copy('https://getcomposer.org/installer', 'composer-setup.php');"
RUN php composer-setup.php
RUN mv composer.phar /usr/local/bin/composer

WORKDIR /data
COPY . .

RUN composer install

CMD [ "php", "./bin/console", "server:run", "0.0.0.0:8181" ]