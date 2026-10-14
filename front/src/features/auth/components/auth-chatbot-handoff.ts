export const chatbotDesktopQuery = "(min-width: 1024px)";
export const chatbotAvatarSelector = "[data-chatbot-avatar]";
const introSelector = '[data-chatbot-placement="inline"]';

export function hideIntroChatbots(): void {
  document.querySelectorAll<HTMLElement>(introSelector).forEach(element => { element.style.visibility = "hidden"; });
}
