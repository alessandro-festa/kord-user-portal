import { User, Adapter, ClientConfig, ClientTokenResponse, ErrorResponse } from '@/types';

const BACKEND_API_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL || 'http://10.9.0.80:8911';

class ApiClient {
  private baseUrl: string;

  constructor() {
    this.baseUrl = BACKEND_API_URL;
  }

  private async fetchWithAuth(endpoint: string, userId: string, options: RequestInit = {}): Promise<Response> {
    const url = `${this.baseUrl}${endpoint}`;
    const headers = {
      'Content-Type': 'application/json',
      'X-User-ID': userId,
      ...options.headers,
    };

    return fetch(url, {
      ...options,
      headers,
    });
  }

  async getUsers(): Promise<User[]> {
    const response = await fetch(`${this.baseUrl}/api/v1/users`);
    
    if (!response.ok) {
      const error: ErrorResponse = await response.json();
      throw new Error(error.error || 'Failed to fetch users');
    }

    return response.json();
  }

  async getUserByEmail(email: string): Promise<User | null> {
    const users = await this.getUsers();
    return users.find(user => user.email.toLowerCase() === email.toLowerCase()) || null;
  }

  async getAdapters(userId: string): Promise<Adapter[]> {
    const response = await this.fetchWithAuth('/api/v1/adapters', userId);
    
    if (!response.ok) {
      const error: ErrorResponse = await response.json();
      throw new Error(error.error || 'Failed to fetch adapters');
    }

    return response.json();
  }

  async getAdapter(userId: string, name: string): Promise<Adapter> {
    const response = await this.fetchWithAuth(`/api/v1/adapters/${name}`, userId);
    
    if (!response.ok) {
      const error: ErrorResponse = await response.json();
      throw new Error(error.error || 'Failed to fetch adapter');
    }

    return response.json();
  }

  async getClientToken(userId: string, adapterName: string): Promise<ClientTokenResponse> {
    const response = await this.fetchWithAuth(`/api/v1/adapters/${adapterName}/client-token`, userId);
    
    if (!response.ok) {
      const error: ErrorResponse = await response.json();
      throw new Error(error.error || 'Failed to get client token');
    }

    return response.json();
  }

  async getAdapterToken(userId: string, adapterName: string): Promise<string> {
    const tokenResponse = await this.getClientToken(userId, adapterName);
    return tokenResponse.token;
  }

  async getUserConfig(userId: string): Promise<any> {
    const response = await this.fetchWithAuth('/api/v1/user/config', userId);
    
    if (!response.ok) {
      const error: ErrorResponse = await response.json();
      throw new Error(error.error || 'Failed to fetch user configuration');
    }

    return response.json();
  }

  async browseRegistry(userId: string): Promise<any[]> {
    const response = await this.fetchWithAuth('/api/v1/registry/browse', userId);
    
    if (!response.ok) {
      const error: ErrorResponse = await response.json();
      throw new Error(error.error || 'Failed to browse registry');
    }

    return response.json();
  }

  buildClientConfig(userId: string, adapter: Adapter, token: string, baseUrl: string): ClientConfig {
    const httpUrl = `${baseUrl}/api/v1/adapters/${adapter.name}/mcp`;
    
    return {
      gemini: {
        mcpServers: {
          [adapter.name]: {
            headers: {
              Authorization: `Bearer ${token}`,
              'X-User-ID': userId,
            },
            httpUrl,
          },
        },
      },
      vscode: {
        inputs: [],
        servers: {
          [adapter.name]: {
            headers: {
              Authorization: `Bearer ${token}`,
              'X-User-ID': userId,
            },
            type: 'http',
            url: httpUrl,
          },
        },
      },
    };
  }
}

export const apiClient = new ApiClient();
