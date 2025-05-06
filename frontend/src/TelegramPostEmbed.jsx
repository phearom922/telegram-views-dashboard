import React, { useEffect } from 'react';

export default function TelegramPostEmbed({ channelUsername, messageId }) {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://telegram.org/js/telegram-widget.js?22';
    script.setAttribute('data-telegram-post', `${channelUsername}/${messageId}`);
    script.setAttribute('data-width', '100%');
    script.async = true;

    const container = document.getElementById(`telegram-embed-${messageId}`);
    container.innerHTML = ''; // clear any previous content
    container.appendChild(script);
  }, [channelUsername, messageId]);

  return <div id={`telegram-embed-${messageId}`} />;
}
