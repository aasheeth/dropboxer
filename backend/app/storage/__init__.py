from app.storage.interface import StorageInterface
from storage_local.storage import LocalStorage
from storage_db.storage import DBStorage

STORAGE_PROVIDERS = {
    "local": LocalStorage,
    "db": DBStorage,
}

def get_storage_provider(name: str) -> StorageInterface:
    try:
        return STORAGE_PROVIDERS[name]()
    except KeyError:
        raise ValueError(f"Storage provider '{name}' not found.")
