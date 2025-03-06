export const getTemplate = (template: string, token: string) => {
  let link = "";
  switch (template) {
    case "activation":
      link = `${process.env.FRONT_URL}register?id=${token}`;
      return `Bonjour,<br/>
<br/>
bienvenue sur la plateforme ANDRIA ! 🎉<br/>>

Votre compte a bien été créé.<br/>Pour finaliser votre inscription et accéder à toutes les fonctionnalités, veuillez activer votre compte en cliquant sur le lien ci-dessous : <br/>
<br/>
👉 <a href=${link}>Lien d'activation</a><br/><br/>

Ce lien expirera dans 24 heures, alors n’attendez pas trop longtemps !<br/><br/>

Si vous n’avez pas demandé la création de ce compte, vous pouvez ignorer cet email.<br/><br/>

Si vous avez des questions, notre équipe est là pour vous aider : <a href="mailto:studio@step.eco">support</a> .<br/><br/>

À bientôt,
l’équipe Andria`;
    case "reset":
      link = `${process.env.FRONT_URL}reset-update?id=${token}`;
      return `<b>Bonjour, vous avez demandé la réinitialisation de votre mot de passe, pour enregistrer votre nouveau mot de passe veuillez suivre ce lien.</b><br/><a href=${link}>Lien pour réinitialiser votre mot de passe</a><br/><p>A bientôt !</p>`;
    case "updated-user":
      return `<b>Bonjour, votre compte a été mis à jour avec succès.</b><br/><p>Si vous n'êtes pas à l'origine de la demande de modification, veuillez contacter un administrateur.</p>
      <br/>
      <p>A bientôt !</p>`;
    default:
      break;
  }
};
