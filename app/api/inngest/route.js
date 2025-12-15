import { serve } from "inngest/next";
import {
  createUserOrder,
  inngest,
  syncUserCreation,
  syncUserDeletion,
  syncUserUpdation, // ✅ matches the export in config/inngest.js
} from "@/config/inngest";

export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [
    createUserOrder,
    syncUserCreation,
    syncUserDeletion,
    syncUserUpdation, // ✅ included here
  ],
});
