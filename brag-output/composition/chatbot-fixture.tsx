/** Render only the real launcher; the presentation never opens the live chatbot. */
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { writeFileSync } from 'node:fs';
import ChatbotButton from '../../front/src/features/chatbot/components/chatbot-button';

const markup = renderToStaticMarkup(<ChatbotButton onOpenChatbot={() => {}} />);
writeFileSync('brag-output/composition/assets/chatbot-launcher.html', markup);
