
from decouple import config
from pathlib import Path
from datetime import timedelta


# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent


# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/4.2/howto/deployment/checklist/


SECRET_KEY = config("SECRET_KEY")



# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True

# ALLOWED_HOSTS = []
ALLOWED_HOSTS=['127.0.0.1', 'localhost']


# Application definition

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    # lib apps
    'corsheaders',
    'djoser',
    'rest_framework',
    'social_django',
    # project apps 
    'usersAuthApp',
    'staffAuthApp',
    'siteusersApp',
    'ticketSystemApp',
    'sitestaffApp',
	'ticketSystemStaffApp',
	'usersManagmentStaffApp',
    'projectFlowApp',
    'logSystemApp',
]


AUTHENTICATION_BACKENDS = [
    'social_core.backends.google.GoogleOAuth2',
    'social_core.backends.facebook.FacebookOAuth2',
    'django.contrib.auth.backends.ModelBackend',
]



REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'usersAuthApp.authentication.CustomJWTAuthentication',
    ],
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.IsAuthenticated',
    ]
}

#DJOSER domain and site name to use it with email templates.
DOMAIN = 'localhost:3000'
SITE_NAME = 'CloudTech Sky Company '







DJOSER = {

    'PASSWORD_RESET_CONFIRM_URL': 'account/password-reset/{uid}/{token}',
    'SEND_ACTIVATION_EMAIL': False,
    'ACTIVATION_URL': 'account/activation/{uid}/{token}',
    'USER_CREATE_PASSWORD_RETYPE': True,
    'PASSWORD_RESET_CONFIRM_RETYPE': True,
    'TOKEN_MODEL': None,
    'SOCIAL_AUTH_ALLOWED_REDIRECT_URIS':['http://localhost:3000/account/google' ],
    'SOCIAL_AUTH_TOKEN_STRATEGY': "usersAuthApp.myutils.custom_serializers.CustomProviderTokenStrategy",

    'SERIALIZERS': {

        'user': 'usersAuthApp.myutils.custom_serializers.CustomUserSerializer',  # Update with the path to your CustomUserSerializer
        'current_user': 'usersAuthApp.myutils.custom_serializers.CustomUserSerializer',
        'password_reset': 'usersAuthApp.myutils.custom_serializers.CustomPasswordResetSerializer',  # Path to your custom serializer

    }

}



GOOGLE_RECAPCHA_SECRET_KEY = config("GOOGLE_RECAPCHA_SECRET_KEY")
GOOGLE_RECAPCHA_CHECK_URL = config("GOOGLE_RECAPCHA_CHECK_URL")




SOCIAL_AUTH_GOOGLE_OAUTH2_KEY = config("SOCIAL_AUTH_GOOGLE_OAUTH2_KEY")
SOCIAL_AUTH_GOOGLE_OAUTH2_SECRET = config("SOCIAL_AUTH_GOOGLE_OAUTH2_SECRET")




SOCIAL_AUTH_GOOGLE_OAUTH2_SCOPE = [
    'https://www.googleapis.com/auth/userinfo.email',
    'https://www.googleapis.com/auth/userinfo.profile',
    'openid'
]

SOCIAL_AUTH_GOOGLE_OAUTH2_EXTRA_DATA = ['first_name', 'last_name']

SOCIAL_AUTH_FACEBOOK_KEY = "getenv('FACEBOOK_AUTH_KEY')"
SOCIAL_AUTH_FACEBOOK_SECRET = "getenv('FACEBOOK_AUTH_SECRET_KEY')"
SOCIAL_AUTH_FACEBOOK_SCOPE = ['email']
SOCIAL_AUTH_FACEBOOK_PROFILE_EXTRA_PARAMS = {
    'fields': 'email, first_name, last_name'
}





CORS_ALLOWED_ORIGINS = [
    'http://localhost:3000',
    'http://127.0.0.1:3000'
]

CORS_ALLOW_CREDENTIALS = True
 

SIMPLE_JWT = {

  "TOKEN_OBTAIN_SERIALIZER": "usersAuthApp.myutils.custom_serializers.MyTokenObtainPairSerializer",

    "ACCESS_TOKEN_LIFETIME": timedelta(weeks=104),

    "REFRESH_TOKEN_LIFETIME": timedelta(weeks=104),
}


MIDDLEWARE = [
    # "usersAuthApp.custommiddlewareCors.CorsMiddleware",
    "corsheaders.middleware.CorsMiddleware",

    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
    # 'logSystemApp.middleware.RequestMiddleware',
    # 'projectFlowApp.middleware.RequestMiddleware',
    'django_project.middleware.RequestMiddleware',


]


ROOT_URLCONF = 'django_project.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'django_project.wsgi.application'


# Database
# https://docs.djangoproject.com/en/4.2/ref/settings/#databases

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}

# DATABASES = {
#     'default': {
#         'ENGINE': 'django.db.backends.mysql',
#         'NAME': 'django_cloudtech',  # Replace with your database name
#         'USER': 'db_cloudtech_user',         # Default MySQL username
#         'PASSWORD': 'db_cloudtech_password',         # Default MySQL password (empty for XAMPP)
#         'HOST': '127.0.0.1',    # Default MySQL host
#         'PORT': '3306',         # Default MySQL port
#     }
# }

# DATABASES = {
#     'default': {
#         'ENGINE': 'django.db.backends.mysql',
#         'NAME': config("DB_NAEM"),  # Replace with your database name
#         'USER': config("DB_USER"),         # Default MySQL username
#         'PASSWORD': config("DB_PASSWORD"),         # Default MySQL password (empty for XAMPP)
#         'HOST': config("DB_HOST"),    # Default MySQL host
#         'PORT': config("DB_PORT"),         # Default MySQL port
#     }
# }


# Password validation
# https://docs.djangoproject.com/en/4.2/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]


# Internationalization
# https://docs.djangoproject.com/en/4.2/topics/i18n/

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'UTC'

USE_I18N = True

USE_TZ = True


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/4.2/howto/static-files/

STATIC_URL = 'static/'

# Default primary key field type
# https://docs.djangoproject.com/en/4.2/ref/settings/#default-auto-field

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

AUTH_USER_MODEL = 'usersAuthApp.UserAccount'



EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
EMAIL_HOST = 'smtp.view.sy'
EMAIL_USE_TLS = False
EMAIL_USE_SSL = False
EMAIL_PORT = 25
DEFAULT_FROM_EMAIL = 'khder@view.sy'

# EMAIL_HOST_USER = 'your email address@gmail.com'
# EMAIL_HOST_PASSWORD = 'gmail API Key (password)'

'''
test email from django shell
python .\manage.py shell
from django.core.mail import send_mail
send_mail('cloudTech sky test', 'This is a test from cloudtech sky application', 'khder@view.sy', ['khdersliman3@gmail.com'],fail_silently=False)

send_mail('Test4', 'This is a test4',None ,['khdersliman3@gmail.com'],fail_silently=False)
'''

import os

MEDIA_ROOT = os.path.join(BASE_DIR, 'media_root_dir/')
MEDIA_URL = '/media_url/'

MY_SITE_URL = 'http://localhost:8000'  # Replace with your domain in production


RECAPTCHA_ENABLED = False

#auth cookie settings 
AUTH_COOKIE_MAX_AGE = 60 * 60 * 24 * 365 * 2 
AUTH_COOKIE_SECURE =  True
AUTH_COOKIE_HTTP_ONLY = True
AUTH_COOKIE_PATH = '/'
AUTH_COOKIE_SAMESITE = 'None'


PROJECT_FLOW_PAGINATION_PAGE_SIZE = 30





 