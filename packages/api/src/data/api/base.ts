import fetch from 'node-fetch';

class APIWrapper {
  baseUrl: string;
  token: string;

  constructor(baseUrl, token?) {
    this.baseUrl = baseUrl;
    if (token) {
      this.token = token;
    }
  }

  async get(resource, id) {
    const response = await fetch(`${this.baseUrl}/api/${resource}/${id}`, {
      headers: { ...(this.token && { 'Authorization': `Bearer ${this.token}` }) }
    });
    if (!response.ok) {
      throw new Error(`Failed to get ${resource} with id ${id}: ${response.statusText}`);
    }
    return response.json();
  }

  async getAll(resource) {
    const response = await fetch(`${this.baseUrl}/api/${resource}`, {
      headers: { ...(this.token && { 'Authorization': `Bearer ${this.token}` }) }
    });
    if (!response.ok) {
      throw new Error(`Failed to get ${resource} list: ${response.statusText}`);
    }
    return response.json();
  }

  async create(resource, data) {
    const response = await fetch(`${this.baseUrl}/api/${resource}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...(this.token && { 'Authorization': `Bearer ${this.token}` }) },
      body: JSON.stringify(data),
    });
    console.log(JSON.stringify({ url: `${this.baseUrl}/api/${resource}`, body: JSON.stringify(data), ...(this.token && { 'Authorization': `Bearer ${this.token}` }) }))
    if (!response.ok) {
      const error = await response.json();
      console.log(JSON.stringify({ error }));
      throw new Error(`Failed to create ${resource}: ${response.statusText}`);
    }
    return response.json();
  }

  async update(resource, id, data) {
    const response = await fetch(`${this.baseUrl}/api/${resource}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...(this.token && { 'Authorization': `Bearer ${this.token}` }) },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error(`Failed to update ${resource} with id ${id}: ${response.statusText}`);
    }
    return response.json();
  }

  async delete(resource, id) {
    const response = await fetch(`${this.baseUrl}/api/${resource}/${id}`, {
      method: 'DELETE',
      headers: { ...(this.token && { 'Authorization': `Bearer ${this.token}` }) }
    });
    if (!response.ok) {
      throw new Error(`Failed to delete ${resource} with id ${id}: ${response.statusText}`);
    }
    return response.json();
  }
}

export default APIWrapper;
