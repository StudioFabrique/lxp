cd api

docker compose down

echo "Nettoyage données volumes docker..."
docker volume rm lxp-api_mongo2 lxp-api_pg2

echo "Nettoyage des données des fichiers activité..."
rm ./uploads/activities/* 2> /dev/null
rm ./uploads/activities/files/* 2> /dev/null
rm ./uploads/activities/images/* 2> /dev/null
rm ./uploads/activities/videos/* 2> /dev/null

echo -e "\033[1;32mDonnées nettoyées avec succès. \033[0m"
