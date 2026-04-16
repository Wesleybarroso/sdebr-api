const blockedIPs = new Map();

// ⏱️ tempo de bloqueio (ex: 10 minutos)
const BLOCK_TIME = 10 * 60 * 1000;

export function blockIP(ip) {
  const expireAt = Date.now() + BLOCK_TIME;

  blockedIPs.set(ip, expireAt);

  console.log(`🚫 IP bloqueado: ${ip}`);
}

export function ipBlocker(req, res, next) {
  const ip = req.ip;
  const now = Date.now();

  if (blockedIPs.has(ip)) {
    const expireAt = blockedIPs.get(ip);

    // ⏱️ ainda bloqueado
    if (now < expireAt) {
      return res.status(403).json({
        error: 'Seu acesso foi bloqueado temporariamente'
      });
    }

    // ✅ desbloqueia automaticamente
    blockedIPs.delete(ip);
    console.log(`✅ IP desbloqueado: ${ip}`);
  }

  next();
}