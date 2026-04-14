# SUSE AI Universal Proxy - User Portal

A minimal Next.js portal for users to access their MCP adapter configurations from the SUSE AI Universal Proxy system.

## Features

- **Simple Email Authentication**: Users sign in with their email address (dev mode - no passwords)
- **Adapter Dashboard**: View all accessible MCP adapters as SUSE-styled cards
- **Individual Adapter Configuration**: View per-adapter configuration for Gemini/Claude Desktop and VSCode clients
- **Full User Configuration**: Download complete user configuration with all adapters via `GET /api/v1/user/config`
- **SUSE Design System**: Uses SUSE branding and styling from the Optimizely frontend components
- **User-Friendly UI**: Icons on buttons, intuitive navigation

## Architecture

- **Frontend**: Next.js 14 with React 18
- **Base Image**: `registry.suse.com/bci/nodejs:22` (multi-arch support)
- **Authentication**: Simple email-based lookup via backend API
- **Backend API**: Communicates with SUSE AI Universal Proxy at configurable URL

## API Integration

The portal integrates with these backend endpoints:

| Endpoint | Purpose |
|----------|---------|
| `GET /api/v1/users` | Retrieve all users (filtered client-side by email) |
| `GET /api/v1/adapters` | List all adapters the user can access |
| `GET /api/v1/adapters/{name}/client-token` | Get per-user authentication token |

## Quick Start

### Local Development

```bash
# Install dependencies
npm install

# Run dev server
npm run dev
```

### Build Container

```bash
# Build multi-arch image
docker buildx build --platform linux/amd64,linux/arm64 -t ghcr.io/alessandro-festa/kord-user-portal:latest .

# Push to registry
docker push ghcr.io/alessandro-festa/kord-user-portal:latest
```

### Deploy to Kubernetes

```bash
# Apply manifests
kubectl apply -f deployment.yaml
kubectl apply -f service.yaml

# Access via NodePort
kubectl get svc kord-user-portal
```

## Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NEXT_PUBLIC_BACKEND_API_URL` | Backend API base URL | `http://10.9.0.80:8911` |
| `BACKEND_API_URL` | Backend API base URL (server-side) | `http://10.9.0.80:8911` |
| `NEXT_PUBLIC_APP_DOMAIN` | Portal domain for external links | `localhost:3000` |
| `PORT` | Server port | `3000` |

### Kubernetes Deployment

The `deployment.yaml` includes:
- Single replica (dev mode)
- Resource limits: 256Mi-512Mi memory, 100m-500m CPU
- NodePort service on port 30080
- Health and readiness probes

## File Structure

```
kord-user-portal/
├── src/
│   ├── app/
│   │   ├── layout.tsx          # Root layout with SUSE styling
│   │   ├── page.tsx            # Login page
│   │   ├── dashboard/page.tsx  # Adapter dashboard
│   │   └── globals.css         # Global styles
│   ├── components/
│   │   ├── MinimalHeader.tsx   # SUSE header
│   │   ├── EmailLoginForm.tsx  # Login form
│   │   ├── AdapterCard.tsx     # Adapter card
│   │   ├── AdapterGrid.tsx     # Cards grid
│   │   └── ConfigModal.tsx     # Config display modal
│   ├── lib/
│   │   ├── api.ts              # Backend API client
│   │   └── session.ts          # Session management
│   └── types/
│       └── index.ts            # TypeScript types
├── public/assets/              # SUSE design system assets
├── Dockerfile                  # Multi-arch BCI Node 22 build
├── deployment.yaml             # Kubernetes deployment
├── service.yaml                # Kubernetes service
└── package.json
```

## Design System

The portal uses the SUSE design system with:
- Pine green (`#0C322C`) theme
- SUSE logo and branding
- Card components from `simple-cards` pattern
- Typography and buttons from SUSE frontend library

## License

Apache 2.0 - See LICENSE file for details.
