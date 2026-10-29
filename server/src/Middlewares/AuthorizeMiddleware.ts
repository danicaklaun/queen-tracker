import { Request, Response, NextFunction } from "express";

export function authorizeMiddleware(...allowedRoles: Array<"beekeeper" | "admin">) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: "Zabranjen pristup.",
      });
    }

    next();
  };
}