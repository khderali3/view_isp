
from pathlib import Path
from datetime import timedelta
import os


# from decouple import config

from decouple import Config, RepositoryEnv


DEBUG = True

IS_PRODUCTION_ENV = False

USE_AUTH_COOKIE_HTTPONLY = True








BASE_DIR = Path(__file__).resolve().parent.parent

# ENV_FILE = os.getenv("DJANGO_ENV_FILE", BASE_DIR / ".env.development")


ENV_FILE = BASE_DIR / (".env.production" if IS_PRODUCTION_ENV else ".env.development")


config = Config(RepositoryEnv(ENV_FILE))


SECRET_KEY = config("SECRET_KEY")


 

# SECURITY WARNING: don't run with debug turned on in production!

# ALLOWED_HOSTS = []
ALLOWED_HOSTS=['127.0.0.1', 'localhost', 'back.cloudtech-it.com']

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
    # 'ticketSystemApp',
    'ticketSystemApp.apps.TicketsystemappConfig',

    'sitestaffApp',
	# 'ticketSystemStaffApp',
    'ticketSystemStaffApp.apps.TicketsystemstaffappConfig',   

	'usersManagmentStaffApp',
    # 'projectFlowApp',
    'projectFlowApp.apps.ProjectflowappConfig',

    'logSystemApp',
    'django_celery_beat',


]


AUTHENTICATION_BACKENDS = [
    'social_core.backends.google.GoogleOAuth2',
    'social_core.backends.facebook.FacebookOAuth2',
    'django.contrib.auth.backends.ModelBackend',
]

if not IS_PRODUCTION_ENV:

    REST_FRAMEWORK = {
        'DEFAULT_AUTHENTICATION_CLASSES': [
            'usersAuthApp.authentication.CustomJWTAuthentication',
        ],
        'DEFAULT_PERMISSION_CLASSES': [
            'rest_framework.permissions.IsAuthenticated',
        ],
        'DEFAULT_RENDERER_CLASSES': [
            'rest_framework.renderers.JSONRenderer',
            'rest_framework.renderers.BrowsableAPIRenderer',
        ],
    }
else:
    REST_FRAMEWORK = {
        'DEFAULT_AUTHENTICATION_CLASSES': [
            'usersAuthApp.authentication.CustomJWTAuthentication',
        ],
        'DEFAULT_PERMISSION_CLASSES': [
            'rest_framework.permissions.IsAuthenticated',
        ],
        'DEFAULT_RENDERER_CLASSES': [
            'rest_framework.renderers.JSONRenderer',
        ],
    }
#DJOSER domain and site name to use it with email templates.
if IS_PRODUCTION_ENV:
    RECAPTCHA_ENABLED = True

    DOMAIN = 'cloudtech-it.com'
    SOCIAL_AUTH_ALLOWED_REDIRECT_URIS = ['https://cloudtech-it.com/account/google']
    MY_SITE_URL = 'https://back.cloudtech-it.com'  # Replace with your domain in production

else:
    RECAPTCHA_ENABLED = False

    DOMAIN = 'localhost:3000'
    SOCIAL_AUTH_ALLOWED_REDIRECT_URIS = ['http://localhost:3000/account/google' ]
    MY_SITE_URL = 'http://localhost:8000'  # Replace with your domain in production


SITE_NAME = 'CloudTech Sky Company '







DJOSER = {

    'PASSWORD_RESET_CONFIRM_URL': 'account/password-reset/{uid}/{token}',
    'SEND_ACTIVATION_EMAIL': True,
    'ACTIVATION_URL': 'account/activation/{uid}/{token}',
    'USER_CREATE_PASSWORD_RETYPE': True,
    'PASSWORD_RESET_CONFIRM_RETYPE': True,
    'TOKEN_MODEL': None,
    'SOCIAL_AUTH_ALLOWED_REDIRECT_URIS':SOCIAL_AUTH_ALLOWED_REDIRECT_URIS,
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





# CORS_ALLOWED_ORIGINS = [
#     'http://localhost:3000',
#     'http://127.0.0.1:3000'
# ]

CORS_ALLOWED_ORIGINS = [
    'http://localhost:3000',
    'http://127.0.0.1:3000',
    'https://cloudtech-it.com',
    'http://cloudtech-it.com:3000',
    'http://cloudtech-it.com'
]

CORS_ALLOW_CREDENTIALS = True
 

SIMPLE_JWT = {

    "TOKEN_OBTAIN_SERIALIZER": "usersAuthApp.myutils.custom_serializers.MyTokenObtainPairSerializer",
    "ACCESS_TOKEN_LIFETIME": timedelta(hours=1),
    "REFRESH_TOKEN_LIFETIME": timedelta(weeks=104),
}


MIDDLEWARE = [
    "corsheaders.middleware.CorsMiddleware",
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
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



if IS_PRODUCTION_ENV:
    DATABASES = {
        'default': {
            'ENGINE': 'django.db.backends.mysql',
            'NAME': config("DB_NAEM"),  # Replace with your database name
            'USER': config("DB_USER"),         # Default MySQL username
            'PASSWORD': config("DB_PASSWORD"),         # Default MySQL password (empty for XAMPP)
            'HOST': config("DB_HOST"),    # Default MySQL host
            'PORT': config("DB_PORT"),         # Default MySQL port
        }
    }

else:

    DATABASES = {
        'default': {
            'ENGINE': 'django.db.backends.sqlite3',
            'NAME': BASE_DIR / 'db.sqlite3',
        }
    }

 
 

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

# TIME_ZONE = 'UTC'
TIME_ZONE = 'Asia/Damascus'
USE_TZ = True
 

USE_I18N = True



# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/4.2/howto/static-files/




# Default primary key field type
# https://docs.djangoproject.com/en/4.2/ref/settings/#default-auto-field

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

AUTH_USER_MODEL = 'usersAuthApp.UserAccount'



# EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'

EMAIL_BACKEND = 'usersAuthApp.email_backend.SSLIgnoreEmailBackend'

EMAIL_HOST = config("EMAIL_HOST")
EMAIL_USE_SSL = config("EMAIL_USE_SSL")
EMAIL_PORT = config("EMAIL_PORT")
DEFAULT_FROM_EMAIL = config("DEFAULT_FROM_EMAIL")
EMAIL_HOST_USER = config("EMAIL_HOST_USER")  # Your email password
EMAIL_HOST_PASSWORD = config("EMAIL_HOST_PASSWORD")


 
MEDIA_ROOT = os.path.join(BASE_DIR, 'media_root_dir/')
MEDIA_URL = '/media_url/'
STATIC_URL = 'static/'
STATIC_ROOT = os.path.join(BASE_DIR, 'staticfiles')
STATICFILES_DIRS = []






# Auth cookie settings
AUTH_COOKIE_MAX_AGE = 60 * 60 * 24 * 365 * 2 
AUTH_COOKIE_PATH = '/'

if USE_AUTH_COOKIE_HTTPONLY:
    AUTH_COOKIE_SECURE = True
    AUTH_COOKIE_HTTP_ONLY = True
    AUTH_COOKIE_SAMESITE = 'None'
else:
    AUTH_COOKIE_SECURE = False
    AUTH_COOKIE_HTTP_ONLY = False
    AUTH_COOKIE_SAMESITE = 'lax'








PROJECT_FLOW_PAGINATION_PAGE_SIZE = 30


CACHES = {
    "default": {
        "BACKEND": "django_redis.cache.RedisCache",
        "LOCATION": "redis://127.0.0.1:6379/1",
        "OPTIONS": {
            "CLIENT_CLASS": "django_redis.client.DefaultClient",
        }
    }
}

CELERY_BROKER_URL = 'redis://127.0.0.1:6379/0'  # Redis URL
CELERY_RESULT_BACKEND = 'redis://127.0.0.1:6379/0'

CELERY_ACCEPT_CONTENT = ['json']
CELERY_TASK_SERIALIZER = 'json'

 



 

# LOGGING = {
#     "version": 1,
#     "disable_existing_loggers": False,
#     "formatters": {
#         "verbose": {
#             "format": "[{asctime}] {levelname} {name} {message}\n########",
#             "style": "{",
#             "datefmt": "%Y-%m-%d %H:%M:%S",
#         },
#     },
#     "handlers": {
#         "file": {
#             "level": "ERROR",
#             "class": "logging.FileHandler",
#             "filename": os.path.join(BASE_DIR, "django_errors.log"),
#             "formatter": "verbose",
#         },
#     },
#     "loggers": {
#         "django": {
#             "handlers": ["file"],
#             "level": "ERROR",
#             "propagate": True,
#         },
#     },
# }
 
 





LOGGING = {
    "version": 1,
    "disable_existing_loggers": False,
    "filters": {
        "request_context": {
            "()": "django_project.logs_utils.RequestLogFilter",  # Adjust path if needed
        },
    },
    "formatters": {
        "verbose": {
            "format": (
                "[{asctime}] {levelname} {name} {message} "
                "| Method: {request_method} | Path: {request_path} | User: {user_display} | IP: {client_ip}"
                "\n########"
            ),
            "style": "{",
            "datefmt": "%Y-%m-%d %H:%M:%S",
        },
        "default": {
            "()": "django.utils.log.ServerFormatter",
            "format": "[{server_time}] {message}",
            "style": "{",
        },
    },
    "handlers": {
        "file": {
            "level": "ERROR",
            "class": "logging.FileHandler",
            "filename": os.path.join(BASE_DIR, "django_errors.log"),
            "formatter": "verbose",
            "filters": ["request_context"],
        },
        "console": {
            "level": "INFO",
            "class": "logging.StreamHandler",
            "formatter": "default",  # <-- use Django's built-in format
        },

        "db": {
            "level": "ERROR",
            "class": "django_project.logs_utils.DBErrorLogHandler",  # Adjust to your file path
            "filters": ["request_context"],
        },

     },
    "loggers": {

        "": {
            "handlers": ["file", "console"],
            "level": "WARNING",  # or ERROR, depending on how verbose you want root logs
        },


        "custom_loger": {
            "handlers": ["file", "db", "console"],  # Add DB handler
            "level": "ERROR",
            "propagate": False,
        },

        "django.request": {          # Add this!
            "handlers": ["file", "db", "console"],
            "level": "ERROR",
            "propagate": False,
        },


        "django.server": {
            "handlers": ["console"],
            "level": "INFO",
            "propagate": False,
        },

        "django": {
            "handlers": ["file", "db", "console"],  # Add DB handler
            "level": "ERROR",
            "propagate": False,
        },
 
    },
}
