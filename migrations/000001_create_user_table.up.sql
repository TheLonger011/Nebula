CREATE TABLE users (
    id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username          VARCHAR(16)  NOT NULL,
    display_name      VARCHAR(64)  NOT NULL,
    email             VARCHAR(255) NOT NULL,
    password_hash     VARCHAR(127) NOT NULL,
    avatar_url        TEXT,
    bio               VARCHAR(255),
    last_seen_at      TIMESTAMPTZ,
    email_verified_at TIMESTAMPTZ,
    created_at        TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    updated_at        TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    deleted_at        TIMESTAMPTZ
);

CREATE UNIQUE INDEX users_username_lower_idx ON users (LOWER(username));
CREATE UNIQUE INDEX users_email_lower_idx ON users (LOWER(email));

