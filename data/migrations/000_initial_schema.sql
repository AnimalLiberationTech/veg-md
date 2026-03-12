CREATE TABLE resources (
    id INTEGER PRIMARY KEY,
    slug TEXT NOT NULL UNIQUE,
    image_url TEXT NOT NULL,
    type TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL
);

CREATE TABLE localized_resources (
    id INTEGER PRIMARY KEY,
    resource_id INTEGER NOT NULL,
    wtf_id INTEGER NULL,
    locale TEXT NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    image_url TEXT NULL,
    method TEXT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL,
    FOREIGN KEY (resource_id) REFERENCES resources(id)
);

CREATE TABLE localized_resource_links (
    id INTEGER PRIMARY KEY,
    localized_resource_id INTEGER NOT NULL,
    type TEXT NOT NULL,
    url TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL,
    FOREIGN KEY (localized_resource_id) REFERENCES localized_resources(id) ON DELETE CASCADE
);

CREATE TABLE missing_localized_resources (
    resource_id INTEGER NOT NULL,
    locale TEXT NOT NULL,
    UNIQUE(resource_id, locale),
    FOREIGN KEY (resource_id) REFERENCES resources(id)
);

CREATE TABLE localized_resource_ratings (
    localized_resource_id INTEGER NOT NULL,
    rating INTEGER NOT NULL,
    user_id TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(localized_resource_id, user_id),
    FOREIGN KEY (localized_resource_id) REFERENCES localized_resources(id)
)