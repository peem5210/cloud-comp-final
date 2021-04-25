import requests
from functools import wraps


class AuthUtil:
    def __init__(self, company_service):
        self.user_service = user_service

    def verify_company_authorization_username(self, func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            if not ('user' in kwargs and 'company_name' in kwargs):
                kwargs['response'].status_code=401
                return 'Missing params'
            if not self.verify_accessed_equipment_username(kwargs['user'].email, kwargs['company_name']):
                kwargs['response'].status_code=401
                return 'Fobbiden access'
            return func(*args, **kwargs)
        return wrapper
    
