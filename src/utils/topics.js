
/**
 * Prepares topics for processing by creating a formatted string
 * @param {Array} topics - Array of topic objects with name and text properties
 * @returns {string} Formatted string of topics
 */
export const prepareTopics = (topics) => {
  return topics.map(topic => `${topic.name}: ${topic.text.trim()}`).join('\n');
};