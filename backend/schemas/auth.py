from pydantic import BaseModel
from typing import Optional


class LoginResponse(BaseModel):
    message: str
    user: dict


class RegisterResponse(BaseModel):
    message: str
    user: dict