import { createMiddleware, createStart } from '@tanstack/react-start'
import { authkitMiddleware } from '@workos/authkit-tanstack-react-start'

const authHeaderMiddleware = createMiddleware({ type: 'function' }).client(
  async ({ next }) => {
    // TODO: Replace with actual token retrieval logic
    const token = 'random-bearer-token-12345'
    return next({
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
  },
)

export const startInstance = createStart(() => ({
  requestMiddleware: [authkitMiddleware()],
  functionMiddleware: [authHeaderMiddleware],
}))
