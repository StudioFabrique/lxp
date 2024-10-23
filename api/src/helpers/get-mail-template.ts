export const getTemplate = (template: string, token: string) => {
  let link = "";
  switch (template) {
    case "activation":
      link = `${process.env.FRONT_URL}register?id=${token}`;
      return `<b>Hello apprenant, pour activer votre compte veuillez cliquer sur le lien ci-dessous dans un délai de 24h</b><br/><a href=${link}>Lien d'activation</a><br/><p>A bientôt !</p>`;
    case "reset":
      link = `${process.env.FRONT_URL}reset-update?id=${token}`;
      return `<b>Bonjour, vous avez demandé la réinitialisation de votre mot de passe, pour enregistrer votre nouveau mot de passe veuillez suivre ce lien.</b><br/><a href=${link}>Lien pour réinitialiser votre mot de passe</a><br/><p>A bientôt !</p>`;
    default:
      break;
  }
};
