FROM nginx:1.17-alpine
COPY dist /usr/share/nginx/html/sktl-inner-dev/meetingroom
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]