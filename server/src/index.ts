import "dotenv/config";
import app from "./app";
import { db } from "./Database/connection/DbConnectionPool";

const PORT = 4567;
async function start() {
  await db.init();

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

start().catch(console.error);