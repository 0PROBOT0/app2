docker build -t haas .
docker run --init -p 4000:3000 haas
