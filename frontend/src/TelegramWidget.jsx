import React, { useEffect } from 'react';

const TelegramWidget = ({ postId }) => {
    useEffect(() => {
        const script = document.createElement('script');
        script.src = 'https://telegram.org/js/telegram-widget.js?22';
        script.setAttribute('data-telegram-post', `SuccessmoreCambodiaOfficial/${postId}`);
        script.setAttribute('data-width', '20%');
        script.async = true;
        document.body.appendChild(script);

        return () => {
            // document.body.removeChild(script); // Cleanup
        };
    }, []);

    // return <div id="telegram-widget"></div>;
};

export default TelegramWidget;