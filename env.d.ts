declare namespace NodeJS {
  interface ProcessEnv {
    PORT: string;
    MONGODB_URI: string;
    Client_URL: string;
    Admin_Url: string;
    Api_Key: string;
    NODE_ENV: string;
    JWT_SECRET: string;
    JWT_REFRESH_WEBSITE: string;
    JWT_REFRESH_ADMIN: string;
    JWT_EXPIRE: string;
    GOOGLE_ID: string;
    GOOGLE_SECRET: string;
    FACEBOOK_ID: string;
    FACEBOOK_SECRET: string;
    Google_API_Key: string;
    EMAIL_TO_SEND: string;
    EMAIL_PASSWORD: string;
  }
}
