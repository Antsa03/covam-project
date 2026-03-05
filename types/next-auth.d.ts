import "next-auth";
import "next-auth/jwt";

declare module "next-auth" {
  interface User {
    id: string;
    role: "CLIENT" | "TRANSPORTEUR" | "ADMIN";
  }

  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      role: "CLIENT" | "TRANSPORTEUR" | "ADMIN";
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: "CLIENT" | "TRANSPORTEUR" | "ADMIN";
    image?: string | null;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: "CLIENT" | "TRANSPORTEUR";
  }
}
