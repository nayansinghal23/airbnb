import { RequestHandler } from "express";
import { createProxyMiddleware } from "http-proxy-middleware";

export function proxy(targetBaseUrl: string): RequestHandler {
    return createProxyMiddleware({
        target: targetBaseUrl,
        changeOrigin: true,
        onProxyReq: (proxyReq, req) => {
            const userId = (req as any).userId;
            if (userId) {
                proxyReq.setHeader("X-User-ID", userId);
            }
        },
    });
}
