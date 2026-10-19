import axios from 'axios';
import { FALLBACK_ARTICLES } from './fallbackData';

const API_BASE = '/api';

export async function fetchArticles({ category = 'All', search = '', language = 'te', limit = 50 } = {}) {
  try {
    const params = new URLSearchParams();
    if (category && category !== 'All') params.append('category', category);
    if (search) params.append('search', search);
    if (language) params.append('language', language);
    if (limit) params.append('limit', limit);

    const response = await axios.get(`${API_BASE}/articles?${params.toString()}`);
    return response.data;
  } catch (error) {
    console.warn('[API Client] Falling back to CDN seed data:', error.message);
    let filtered = [...FALLBACK_ARTICLES];
    if (category && category !== 'All') {
      filtered = filtered.filter(a => a.category?.toLowerCase() === category.toLowerCase());
    }
    if (search) {
      const q = search.toLowerCase();
      filtered = filtered.filter(a => 
        (a.localized?.[language]?.title || a.originalTitle).toLowerCase().includes(q)
      );
    }
    return { success: true, count: filtered.length, articles: filtered };
  }
}

export async function fetchArticleById(id) {
  try {
    const response = await axios.get(`${API_BASE}/articles/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching article:', error);
    throw error;
  }
}

export async function reactToArticle(id, type) {
  try {
    const response = await axios.post(`${API_BASE}/articles/${id}/react`, { type });
    return response.data;
  } catch (error) {
    console.error('Error reacting to article:', error);
    throw error;
  }
}

export async function runCrawler({ sourceId, limitPerSource = 3 } = {}) {
  try {
    const response = await axios.post(`${API_BASE}/crawler/run`, { sourceId, limitPerSource });
    return response.data;
  } catch (error) {
    console.error('Error triggering crawler:', error);
    throw error;
  }
}

export async function localizeCustomArticle({ url, title, content, category }) {
  try {
    const response = await axios.post(`${API_BASE}/agent/localize-custom`, {
      url,
      title,
      content,
      category,
    });
    return response.data;
  } catch (error) {
    console.error('Error custom localizing:', error);
    throw error;
  }
}

export async function fetchStats() {
  try {
    const response = await axios.get(`${API_BASE}/stats`);
    return response.data;
  } catch (error) {
    console.error('Error fetching stats:', error);
    throw error;
  }
}

export async function fetchConfig() {
  try {
    const response = await axios.get(`${API_BASE}/config`);
    return response.data;
  } catch (error) {
    console.error('Error fetching config:', error);
    throw error;
  }
}

export async function fetchSettings() {
  try {
    const response = await axios.get(`${API_BASE}/settings`);
    return response.data;
  } catch (error) {
    console.error('Error fetching settings:', error);
    throw error;
  }
}

export async function updateSettings(newSettings) {
  try {
    const response = await axios.post(`${API_BASE}/settings`, newSettings);
    return response.data;
  } catch (error) {
    console.error('Error updating settings:', error);
    throw error;
  }
}
