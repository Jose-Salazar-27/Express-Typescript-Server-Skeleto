import * as dotenv from "dotenv";
import { injectable } from "inversify";
import { SupabaseClient, createClient } from "@supabase/supabase-js";

@injectable()
export abstract class ServerConfig {
  protected supabaseClient;

  constructor() {
    dotenv.config();
    this.supabaseClient = this.configSupabase();
  }

  getEnvVar(envVar: string): string {
    const variable = process.env[envVar];
    if (variable === undefined) {
      throw new Error(`process.env.${envVar} is undefined`);
    }

    return variable;
  }

  configSupabase() {
    const supabaseUrl = this.getEnvVar("SUPABASE_URL");
    const supabaseKey = this.getEnvVar("SUPABASE_PUBLIC_ANON_KEY");
    const supabase = createClient<SupabaseClient>(supabaseUrl, supabaseKey);

    return supabase;
  }
}
