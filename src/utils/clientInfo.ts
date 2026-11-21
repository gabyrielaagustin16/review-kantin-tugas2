import type { Request } from 'express';

export interface ClientInfo {
  ipAddress: string | null;
  userAgent: string | null;
}

export function getClientInfo(req: Request): ClientInfo {
  return {
    ipAddress: req.ip ?? req.socket.remoteAddress ?? null,
    userAgent: req.get('user-agent')?.slice(0, 255) ?? null,
  };
}
