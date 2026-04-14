# Kord User Portal - Implementation Complete

## Summary

A complete Next.js portal for the SUSE MCP Adapter system has been successfully built and packaged.

## What Was Built

### Application Features
- **Email-based Authentication**: Simple dev-mode login using email lookup via backend API
- **Adapter Dashboard**: Grid view of accessible MCP adapters with SUSE-styled cards
- **Configuration Display**: Modal showing Gemini/VSCode client configurations with per-user tokens
- **SUSE Design System**: Uses official SUSE styling, logo, and components

### Architecture
- **Frontend**: Next.js 14 with React 18, TypeScript
- **Base Image**: `registry.suse.com/bci/nodejs:22` (multi-arch: linux/amd64, linux/arm64)
- **Container Size**: 599MB
- **Authentication**: Simple session-based (localStorage) for dev mode

## File Structure

```
kord-user-portal/
├── src/
│   ├── app/
│   │   ├── api/health/route.ts    # Health check endpoint
│   │   ├── dashboard/page.tsx     # Adapter dashboard
│   │   ├── layout.tsx             # Root layout with SUSE assets
│   │   ├── page.tsx               # Email login page
│   │   └── globals.css            # Global styles
│   ├── components/
│   │   ├── MinimalHeader.tsx      # SUSE header
│   │   ├── EmailLoginForm.tsx     # Login form
│   │   ├── AdapterCard.tsx        # Single adapter card
│   │   ├── AdapterGrid.tsx        # Cards grid layout
│   │   └── ConfigModal.tsx        # Config display modal
│   ├── lib/
│   │   ├── api.ts                 # Backend API client
│   │   └── session.ts             # Session management
│   └── types/
│       └── index.ts               # TypeScript definitions
├── public/assets/                 # SUSE design system files
│   ├── main.css
│   ├── main.js
│   └── img/
│       ├── suse-white-logo-green.svg
│       └── favicon.ico
├── Dockerfile                     # Multi-arch BCI Node 22 build
├── deployment.yaml                # Kubernetes deployment
├── service.yaml                   # Kubernetes NodePort service
├── package.json
├── tsconfig.json
├── jsconfig.json
├── next.config.js
└── README.md
```

## API Integration

The portal integrates with the SUSE AI Universal Proxy backend:

| Endpoint | Purpose |
|----------|---------|
| `GET /api/v1/users` | Retrieve all users, filtered client-side by email |
| `GET /api/v1/adapters` | List accessible adapters with `X-User-ID` header |
| `GET /api/v1/adapters/{name}/client-token` | Get per-user auth token |

## Container Image

**Image**: `ghcr.io/alessandro-festa/kord-user-portal:latest`
**Size**: 599MB
**Platforms**: linux/amd64, linux/arm64
**Base**: SUSE BCI Node.js 22

## To Push to GitHub Container Registry

Run these commands to push the built image:

```bash
# Login to GitHub Container Registry
export GITHUB_TOKEN="your_github_token_here"
echo $GITHUB_TOKEN | docker login ghcr.io -u alessandro-festa --password-stdin

# Push the image
docker push ghcr.io/alessandro-festa/kord-user-portal:latest
```

Or build and push in one command:

```bash
docker buildx build --platform linux/amd64,linux/arm64 \
  -t ghcr.io/alessandro-festa/kord-user-portal:latest \
  --push .
```

## Kubernetes Deployment

### Deploy to cluster:

```bash
# Update the BACKEND_API_URL in deployment.yaml if needed
kubectl apply -f deployment.yaml
kubectl apply -f service.yaml

# Check deployment
kubectl get pods -l app=kord-user-portal
kubectl get svc kord-user-portal
```

### Access the portal:

The service uses NodePort on port **30080**:

```bash
# Get node IP
kubectl get nodes -o wide

# Access via
http://<node-ip>:30080
```

Or use port-forward for local testing:

```bash
kubectl port-forward svc/kord-user-portal 3000:80
# Access at http://localhost:3000
```

## Configuration

### Environment Variables (in deployment.yaml)

| Variable | Description | Default |
|----------|-------------|---------|
| `NEXT_PUBLIC_BACKEND_API_URL` | Client-side Backend API URL | `http://10.9.0.80:8911` |
| `BACKEND_API_URL` | Server-side Backend API URL | `http://10.9.0.80:8911` |
| `NEXT_PUBLIC_APP_DOMAIN` | Portal domain | `kord-portal.192.168.105.3.sllip.io` |
| `PORT` | Server port | `3000` |

## User Flow

1. User accesses portal → sees login page with email form
2. Enters email → portal calls `GET /api/v1/users`
3. Filters list to find matching email → stores user session
4. Redirects to dashboard showing adapter cards
5. Clicks "View Config" on any adapter → fetches per-user token
6. Displays configuration in Gemini/VSCode formats

## Security Notes

- Non-root user (`nodejs`) runs the container
- Health checks enabled on `/api/health`
- Resource limits: 256Mi-512Mi memory, 100m-500m CPU
- No password authentication (dev mode only)

## Next Steps

1. **Push to Registry**: Run the push commands above
2. **Deploy to K8s**: Apply the Kubernetes manifests
3. **Test**: Access the portal and verify backend connectivity
4. **Production Hardening**: Add OIDC authentication, HTTPS, secrets management

## Files Created (21 total)

- Source code: 15 files (components, pages, lib, types)
- Assets: 4 files (SUSE CSS, JS, logo, favicon)
- Config: 2 files (Dockerfile, K8s manifests)

All files are ready for use!
