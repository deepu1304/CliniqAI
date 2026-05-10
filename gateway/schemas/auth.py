from pydantic import BaseModel

class LoginRequest(BaseModel):
    email: str        # changed from EmailStr — no extra dependency needed
    password: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user_id: str
    name: str
    role: str = "doctor"