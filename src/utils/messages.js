/**
 * Prepares messages for AI processing by separating recent user messages (query)
 * from previous conversation history. Consecutive user messages are joined with newlines.
 * @param {Array} messages - Array of message objects with sender and text properties
 * @param {number} maxMessages - Maximum number of messages to process
 * @returns {Object} Object containing query and history strings
 */
export const prepareMessages = (messages, maxMessages = 50) => {
  const result = {
    query: [],
    history: [],
  };

  // Limit total messages from most recent
  const limitedMessages = messages.slice(-maxMessages);

  let currentGroup = [];
  let lastSender = null;

  // Process messages from bottom up
  for (let i = limitedMessages.length - 1; i >= 0; i--) {
    const message = limitedMessages[i];
    const currentText = message.text.trim();

    // If sender changes or we're starting history, format the current group
    if (lastSender !== message.sender && currentGroup.length > 0) {
      const formattedGroup = `${lastSender}: ${currentGroup.reverse().join('\n')}`;

      if (!result.history.length && lastSender === 'user') {
        result.query.unshift(formattedGroup);
      } else {
        result.history.unshift(formattedGroup);
      }
      currentGroup = [];
    }

    // If we hit assistant and haven't started history, move everything to history
    if (message.sender === 'assistant' && !result.history.length) {
      if (currentGroup.length > 0) {
        const formattedGroup = `user: ${currentGroup.reverse().join('\n')}`;
        result.query.unshift(formattedGroup);
        currentGroup = [];
      }
      result.history.unshift(`assistant: ${currentText}`);
    } else {
      currentGroup.push(currentText);
    }

    lastSender = message.sender;
  }

  // Handle any remaining group
  if (currentGroup.length > 0) {
    const formattedGroup = `${lastSender}: ${currentGroup.reverse().join('\n')}`;
    if (!result.history.length && lastSender === 'user') {
      result.query.unshift(formattedGroup);
    } else {
      result.history.unshift(formattedGroup);
    }
  }

  return {
    query: result.query.join('\n'),
    history: result.history.join('\n'),
  };
};
