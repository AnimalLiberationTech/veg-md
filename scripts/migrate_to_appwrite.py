import os
import sqlite3
import time
import re
from appwrite.client import Client
from appwrite.services.databases import Databases
from appwrite.id import ID
from appwrite.exception import AppwriteException

# Appwrite config from issue
APPWRITE_ENDPOINT = "https://fra.cloud.appwrite.io/v1"
APPWRITE_PROJECT_ID = "69496060003d273d4a8c"
DATABASE_ID = "resources"

# Collections
COLLECTIONS = [
    {"id": "resources", "name": "resources"},
    {"id": "localized_resources", "name": "localized_resources"},
    {"id": "localized_resource_links", "name": "localized_resource_links"},
    {"id": "localized_resource_ratings", "name": "localized_resource_ratings"},
    {"id": "missing_localized_resources", "name": "missing_localized_resources"},
]

def migrate():
    appwrite_key = os.environ.get("APPWRITE_API_KEY")
    if not appwrite_key:
        print("Please provide APPWRITE_API_KEY environment variable")
        return

    client = Client()
    client.set_endpoint(APPWRITE_ENDPOINT)
    client.set_project(APPWRITE_PROJECT_ID)
    client.set_key(appwrite_key)

    databases = Databases(client)

    db_path = os.path.join(os.getcwd(), "data", "resources.sqlite3")
    if not os.path.exists(db_path):
        print(f"Database file not found at {db_path}")
        return

    conn = sqlite3.connect(db_path)
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()

    try:
        # 0. Ensure database exists
        try:
            databases.get(DATABASE_ID)
            print(f"Database {DATABASE_ID} already exists.")
        except AppwriteException:
            print(f"Database {DATABASE_ID} not found, creating it...")
            databases.create(DATABASE_ID, DATABASE_ID)

        # 1. Create collections if they don't exist
        for coll in COLLECTIONS:
            coll_id = coll["id"]
            coll_name = coll["name"]
            try:
                databases.get_collection(DATABASE_ID, coll_id)
                print(f"Collection {coll_name} already exists.")
            except AppwriteException:
                print(f"Creating collection {coll_name}...")
                databases.create_collection(DATABASE_ID, coll_id, coll_name)
                
                # Add attributes based on schema
                if coll_id == "resources":
                    databases.create_integer_attribute(DATABASE_ID, coll_id, "id", True)
                    databases.create_string_attribute(DATABASE_ID, coll_id, "slug", 255, True)
                    databases.create_string_attribute(DATABASE_ID, coll_id, "image_url", 1024, True)
                    databases.create_string_attribute(DATABASE_ID, coll_id, "type", 50, True)
                    databases.create_string_attribute(DATABASE_ID, coll_id, "created_at", 50, False)
                    databases.create_string_attribute(DATABASE_ID, coll_id, "updated_at", 50, False)
                    databases.create_string_attribute(DATABASE_ID, coll_id, "deleted_at", 50, False)
                elif coll_id == "localized_resources":
                    databases.create_integer_attribute(DATABASE_ID, coll_id, "id", True)
                    databases.create_integer_attribute(DATABASE_ID, coll_id, "resource_id", True)
                    databases.create_integer_attribute(DATABASE_ID, coll_id, "wtf_id", False)
                    databases.create_string_attribute(DATABASE_ID, coll_id, "locale", 10, False)
                    databases.create_string_attribute(DATABASE_ID, coll_id, "title", 255, True)
                    databases.create_string_attribute(DATABASE_ID, coll_id, "description", 5000, True)
                    databases.create_string_attribute(DATABASE_ID, coll_id, "image_url", 1024, False)
                    databases.create_string_attribute(DATABASE_ID, coll_id, "method", 50, False)
                    databases.create_string_attribute(DATABASE_ID, coll_id, "created_at", 50, False)
                    databases.create_string_attribute(DATABASE_ID, coll_id, "updated_at", 50, False)
                    databases.create_string_attribute(DATABASE_ID, coll_id, "deleted_at", 50, False)
                elif coll_id == "localized_resource_links":
                    databases.create_integer_attribute(DATABASE_ID, coll_id, "id", True)
                    databases.create_integer_attribute(DATABASE_ID, coll_id, "localized_resource_id", True)
                    databases.create_string_attribute(DATABASE_ID, coll_id, "type", 50, True)
                    databases.create_string_attribute(DATABASE_ID, coll_id, "url", 1024, True)
                    databases.create_string_attribute(DATABASE_ID, coll_id, "created_at", 50, False)
                    databases.create_string_attribute(DATABASE_ID, coll_id, "updated_at", 50, False)
                    databases.create_string_attribute(DATABASE_ID, coll_id, "deleted_at", 50, False)
                elif coll_id == "localized_resource_ratings":
                    databases.create_integer_attribute(DATABASE_ID, coll_id, "localized_resource_id", True)
                    databases.create_integer_attribute(DATABASE_ID, coll_id, "rating", True)
                    databases.create_string_attribute(DATABASE_ID, coll_id, "user_id", 255, True)
                    databases.create_string_attribute(DATABASE_ID, coll_id, "created_at", 50, False)
                    databases.create_string_attribute(DATABASE_ID, coll_id, "updated_at", 50, False)
                elif coll_id == "missing_localized_resources":
                    databases.create_integer_attribute(DATABASE_ID, coll_id, "resource_id", True)
                    databases.create_string_attribute(DATABASE_ID, coll_id, "locale", 10, True)
                
                print(f"Attributes created for {coll_name}. Wait for attributes to become available...")
                # Wait a bit for attributes to be processed
                time.sleep(5)

        # 2. Migrate data
        for coll in COLLECTIONS:
            coll_id = coll["id"]
            coll_name = coll["name"]
            print(f"Migrating data for {coll_name}...")
            
            cursor.execute(f"SELECT * FROM {coll_id}")
            rows = cursor.fetchall()
            
            for row in rows:
                try:
                    row_dict = dict(row)
                    
                    # In Appwrite, we need a unique document ID.
                    doc_id = ID.unique()
                    if "id" in row_dict and row_dict["id"] is not None:
                        doc_id = str(row_dict["id"])
                    elif "localized_resource_id" in row_dict and "user_id" in row_dict:
                        user_id_clean = re.sub(r'[^a-zA-Z0-9_-]', '_', str(row_dict["user_id"]))
                        doc_id = f"{row_dict['localized_resource_id']}_{user_id_clean}"
                    elif "resource_id" in row_dict and "locale" in row_dict:
                        doc_id = f"{row_dict['resource_id']}_{row_dict['locale']}"

                    # Clean up row for Appwrite (remove nulls)
                    data = {k: v for k, v in row_dict.items() if v is not None}

                    databases.create_document(DATABASE_ID, coll_id, doc_id, data)
                except AppwriteException as e:
                    if e.code == 409:
                        # Already exists, skip
                        pass
                    else:
                        print(f"Error migrating row in {coll_name}: {e.message}")
                except Exception as e:
                    print(f"Unexpected error migrating row in {coll_name}: {str(e)}")
            
            print(f"Finished migrating {coll_name}.")

        print("Migration completed successfully!")

    except Exception as error:
        print(f"Migration failed: {error}")
    finally:
        conn.close()

if __name__ == "__main__":
    migrate()
