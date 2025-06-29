from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    GEMINI_API_KEY: str
    SQLALCHEMY_DB_URL: str
    SECRET_KEY: str
    ALGORITHM: str
    ACCESS_TOKEN_EXPIRE_MINUTES: int
    TEST_SQLALCHEMY_DB_URL: str

    model_config = SettingsConfigDict(env_file="backend/.env")


settings = Settings()  # type: ignore
