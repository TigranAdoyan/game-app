echo 'Press'
echo '1) To run docker container: '
echo '2) To stop and remove docker container: '

read option

if [ "$option" == 1 ]; then
  docker run --name nats --network nats --rm -p 4222:4222 -p 8222:8222 -d nats --http_port 8222
  docker run --name redis_socket -p 6379:6379 -d redis:alpine
  docker run --name redis_auth -p 6380:6379 -d redis:alpine
  docker run --name redis_game -p 6381:6379 -d redis:alpine
elif [ "$option" == 2 ]; then
   docker stop redis_game
   docker stop redis_auth
   docker stop redis_socket
   docker stop nats

   docker rm redis_game
   docker rm redis_auth
   docker rm redis_socket
fi

