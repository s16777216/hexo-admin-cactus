FROM node:slim

RUN npm install -g hexo-cli

RUN npm install

CMD ["hexo", "server", "-d"]