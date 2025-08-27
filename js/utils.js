

/**
 * Utility Functions
 * Provides shared helper functions for the entire application.
 */

window.Utils = {
  /**
   * Cleans HTML and Markdown tags from a string to get plain text.
   * This is the single source of truth for text cleaning.
   * @param {string} text - The text to clean.
   * @returns {string} The cleaned, plain text.
   */
  cleanText: function(text) {
    if (!text || typeof text !== 'string') return "";

    try {
      let cleaned = text;

      // Remove HTML tags and entities
      cleaned = cleaned.replace(/<[^>]*>/g, "");
      cleaned = cleaned.replace(/&[a-zA-Z0-9#]+;/g, "");

      // Remove markdown formatting (comprehensive)
      cleaned = cleaned.replace(/\*\*\*([^*]+)\*\*\*/g, "$1"); // Bold + Italic
      cleaned = cleaned.replace(/___([^_]+)___/g, "$1"); // Bold + Italic underscore
      cleaned = cleaned.replace(/\*\*([^*]+)\*\*/g, "$1"); // Bold
      cleaned = cleaned.replace(/__([^_]+)__/g, "$1"); // Bold underscore
      cleaned = cleaned.replace(/\*([^*]+)\*/g, "$1"); // Italic
      cleaned = cleaned.replace(/_([^_]+)_/g, "$1"); // Italic underscore
      cleaned = cleaned.replace(/~~([^~]+)~~/g, "$1"); // Strikethrough
      cleaned = cleaned.replace(/^#{1,6}\s+/gm, ""); // Headers
      cleaned = cleaned.replace(/[[^\\\]]+)\]\([^)]*\)/g, "$1"); // Links
      cleaned = cleaned.replace(/!\[([^\]]*)\]\([^)]*\)/g, "[Gambar: $1]"); // Images
      cleaned = cleaned.replace(/```[\s\S]*?```/g, "[Blok Kode]"); // Code blocks
      cleaned = cleaned.replace(/`([^`]+)`/g, "$1"); // Inline code
      cleaned = cleaned.replace(/^>\s+/gm, ""); // Blockquotes
      cleaned = cleaned.replace(/^[​-‍﻿]/g, "• "); // Lists
      cleaned = cleaned.replace(/^[​-‍﻿]*\d+\.\s+/gm, ""); // Numbered lists
      cleaned = cleaned.replace(/^[-*_]{3,}$/gm, ""); // Horizontal rules
      cleaned = cleaned.replace(/\|.*\|/g, "[Tabel]"); // Tables

      // Clean up whitespace and special characters
      cleaned = cleaned.replace(/[​-‍﻿]/g, ""); // Zero-width spaces
      cleaned = cleaned.replace(/\u00A0/g, " "); // Non-breaking space
      cleaned = cleaned.replace(/\n\s*\n/g, "\n"); // Multiple newlines
      cleaned = cleaned.replace(/[ \t]+/g, " "); // Multiple spaces
      
      return cleaned.trim();
    } catch (error) {
      console.warn("Error cleaning text:", error);
      // Fallback to a simpler cleaning method
      return text.replace(/<[^>]*>/g, "").trim();
    }
  }
};

console.log("✅ Utility functions loaded.");
