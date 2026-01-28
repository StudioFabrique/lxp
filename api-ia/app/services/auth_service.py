class AuthService:
    def __init__(self, auth_repository, token_service):
        self.auth_repository = auth_repository
        self.token_service = token_service
