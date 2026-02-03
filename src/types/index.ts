export interface User {
  id: string;
  name: string;
  email: string;
  groups: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Adapter {
  id: string;
  mcpServerId: string;
  name: string;
  connectionType: 'StreamableHttp' | 'Remote';
  protocol: string;
  status: 'ready' | 'deploying' | 'error' | 'stopped';
  environmentVariables: Record<string, string>;
  routeAssignments: RouteAssignment[];
  capabilities?: AdapterCapabilities;
  createdAt: string;
  updatedAt: string;
}

export interface RouteAssignment {
  group?: string;
  user?: string;
  permissions: ('read' | 'write' | 'admin')[];
}

export interface AdapterCapabilities {
  tools?: Tool[];
  resources?: Resource[];
  prompts?: Prompt[];
}

export interface Tool {
  name: string;
  description: string;
  inputSchema: object;
}

export interface Resource {
  uri: string;
  name: string;
  description?: string;
  mimeType?: string;
}

export interface Prompt {
  name: string;
  description: string;
  arguments?: PromptArgument[];
}

export interface PromptArgument {
  name: string;
  description?: string;
  required?: boolean;
}

export interface ClientConfig {
  gemini: {
    mcpServers: Record<string, ServerConfig>;
  };
  vscode: {
    inputs: any[];
    servers: Record<string, VSCodeServerConfig>;
  };
}

export interface ServerConfig {
  headers: {
    Authorization: string;
    'X-User-ID': string;
  };
  httpUrl: string;
}

export interface VSCodeServerConfig {
  headers: {
    Authorization: string;
    'X-User-ID': string;
  };
  type: string;
  url: string;
}

export interface ClientTokenResponse {
  token: string;
  expiresAt: string;
}

export interface ErrorResponse {
  error: string;
}
