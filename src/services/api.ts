export const onFetchChatId = async (API_TOKEN) => {
    const updated_id = localStorage.getItem('updated_id');
    const params = new URLSearchParams({
      offset: updated_id ? String(Number(updated_id) + 1) : "",
      limit: "100",
      timeout: "25",
    });

    const response = await fetch(
      `https://api.telegram.org/bot${API_TOKEN}/getUpdates?${params.toString()}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    const { result } = await response.json();
    if (result && result.length > 0) {
      const lastUpdate = result[result.length - 1];
      localStorage.setItem('updated_id', lastUpdate.update_id);
      localStorage.setItem('chat_id', lastUpdate.message.chat.id);
    }
  }

  export const onSendMessage = async (message, API_TOKEN) => {
    const chatId = localStorage.getItem('chat_id');
    
    const response = await fetch(`http://localhost:3001/webhook`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message,
          token: API_TOKEN,
          chatId,
        }),
      }
    );
    const result = await response.json();
    return result
  }