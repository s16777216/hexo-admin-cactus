FROM node:20-slim

RUN npm install -g hexo-cli && npm install

EXPOSE 4000

CMD ["hexo", "server", "-d"]