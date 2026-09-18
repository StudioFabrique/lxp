cd api

echo "Nettoyage données volumes docker..."
# Supprime uniquement les conteneurs, réseaux et volumes déclarés par le
# Compose de développement lxp-api. L'option -v évite les erreurs lorsque les
# volumes n'existent pas encore et inclut la base pgvector `pg_ai`.
docker compose down --volumes --remove-orphans

echo "Nettoyage des données des fichiers activité..."
rm ./uploads/activities/* 2> /dev/null
rm ./uploads/activities/files/* 2> /dev/null
rm ./uploads/activities/images/* 2> /dev/null
rm ./uploads/activities/videos/* 2> /dev/null

# Ces fichiers survivent à la suppression des volumes Docker. Les conserver
# ferait croire à une nouvelle instance que l'onboarding root est déjà terminé.
echo "Réinitialisation de la personnalisation de l'instance..."
rm -f ./uploads/company/instance-settings.json \
  ./uploads/company/company-logo.jpeg \
  ./uploads/company/company-color.txt

echo -e "\033[1;32mDonnées nettoyées avec succès. \033[0m"
