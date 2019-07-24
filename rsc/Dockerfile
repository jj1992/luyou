FROM nginx:1.15.2


RUN rm /etc/nginx/conf.d/default.conf

COPY nginx.conf /etc/nginx/conf.d/default.conf

COPY dist/ /usr/share/nginx/html/



EXPOSE 9000