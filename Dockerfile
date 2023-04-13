FROM node:16-alpine

RUN npm install -g ts-node

WORKDIR /usr/src/app

COPY package*.json ./

COPY . .

RUN npm install

ENV PORT=8000

ENV SUPABASE_URL=https://oszvkemeojwtevviwzfb.supabase.co

ENV SUPABASE_PUBLIC_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9zenZrZW1lb2p3dGV2dml3emZiIiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODAxMzM1MzEsImV4cCI6MTk5NTcwOTUzMX0.fB0O5UJDTCazVjzLislEYxFLsMPToOJbVZevORJ73Rw

ENV SUPABASE_KEY_SERVICE_ROLE=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9zenZrZW1lb2p3dGV2dml3emZiIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTY4MDEzMzUzMSwiZXhwIjoxOTk1NzA5NTMxfQ.xbRwfdu_u3HXTsfYTC5VePn_8FqXuWN6mju5UBUQkt8


EXPOSE 8000

CMD ["npm", "start"]