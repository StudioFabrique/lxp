/**
 * Récupère les données d'une certification RNCP depuis l'API France Compétences
 * @param rncp - Le code RNCP de la certification (sans le préfixe "RNCP")
 * @returns Un objet contenant les informations de la certification
 */
export default async function getRncpData(rncp: string) {
  // Appel à l'API avec authentification via token
  const response = await fetch(
    `https://api.apprentissage.beta.gouv.fr/api/certification/v1?identifiant.rncp=RNCP${rncp}`,
    {
      headers: {
        Authorization: `Bearer ${process.env.RNCP_API}`,
      },
    }
  );

  // Récupération et parsing des données
  const data: any = await response.json();
  console.log({ data });

  if (data.length === 0)
    throw {
      statusCode: 404,
      message: "Aucune donnée n'a été renvoyée par l'API Apprentissage.",
    };

  // Extraction des informations pertinentes
  const title = data[0].intitule.rncp; // Titre de la certification
  const level = data[0].intitule.niveau.rncp.europeen; // Niveau européen

  // Transformation des blocs de compétences
  const skillsSets = data[0].blocs_competences.rncp.map((item: any) => ({
    rncpbc: item.code, // Code du bloc de compétences
    name: item.intitule, // Intitulé du bloc
  }));

  // Date d'expiration de la certification
  const expires_at = data[0].periode_validite.fin;

  /* Vérification de la validité temporelle désactivée
  if (new Date(expires_at) < new Date())
    throw {
      statusCode: 500,
      message: "La certification professionnelle n'est plus valide.",
    };
  */

  // Retourne un objet avec les données formatées
  return { title, level, skillsSets, expires_at };
}
