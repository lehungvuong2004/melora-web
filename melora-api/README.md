-- ============================================================
-- MELORA MUSIC STREAMING PLATFORM
-- Database: MySQL 8.x
-- Architecture: Monolithic
-- Normalization: 3NF
-- ============================================================

CREATE DATABASE IF NOT EXISTS melora_db
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

USE melora_db;


-- ============================================================
-- 01. ROLES
-- ============================================================

CREATE TABLE roles (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,

    name VARCHAR(50) NOT NULL UNIQUE,

    description VARCHAR(255),

    created_at TIMESTAMP NULL DEFAULT NULL,
    updated_at TIMESTAMP NULL DEFAULT NULL
) ENGINE=InnoDB;


-- ============================================================
-- 02. USERS
-- ============================================================

CREATE TABLE users (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,

    name VARCHAR(100) NOT NULL,

    email VARCHAR(255) NOT NULL UNIQUE,

    password VARCHAR(255) NULL,

    avatar_url VARCHAR(500),

    country VARCHAR(100),

    date_of_birth DATE,

    status ENUM(
        'ACTIVE',
        'INACTIVE',
        'BANNED'
    ) NOT NULL DEFAULT 'ACTIVE',

    email_verified_at TIMESTAMP NULL DEFAULT NULL,

    created_at TIMESTAMP NULL DEFAULT NULL,
    updated_at TIMESTAMP NULL DEFAULT NULL,

    INDEX idx_users_status (status),
    INDEX idx_users_country (country)
) ENGINE=InnoDB;


-- ============================================================
-- 03. ARTISTS
-- ============================================================

CREATE TABLE artists (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,

    name VARCHAR(150) NOT NULL,

    slug VARCHAR(180) NOT NULL UNIQUE,

    bio TEXT,

    avatar_url VARCHAR(500),

    cover_url VARCHAR(500),

    country VARCHAR(100),

    is_verified BOOLEAN NOT NULL DEFAULT FALSE,

    monthly_listeners BIGINT UNSIGNED NOT NULL DEFAULT 0,

    created_at TIMESTAMP NULL DEFAULT NULL,
    updated_at TIMESTAMP NULL DEFAULT NULL,

    INDEX idx_artists_name (name),
    INDEX idx_artists_verified (is_verified)
) ENGINE=InnoDB;


-- ============================================================
-- 04. GENRES
-- ============================================================

CREATE TABLE genres (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,

    name VARCHAR(100) NOT NULL UNIQUE,

    slug VARCHAR(120) NOT NULL UNIQUE,

    description TEXT,

    created_at TIMESTAMP NULL DEFAULT NULL,
    updated_at TIMESTAMP NULL DEFAULT NULL
) ENGINE=InnoDB;


-- ============================================================
-- 05. ALBUMS
-- ============================================================

CREATE TABLE albums (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,

    artist_id BIGINT UNSIGNED NOT NULL,

    title VARCHAR(200) NOT NULL,

    slug VARCHAR(220) NOT NULL UNIQUE,

    description TEXT,

    cover_url VARCHAR(500),

    album_type ENUM(
        'ALBUM',
        'SINGLE',
        'EP',
        'COMPILATION'
    ) NOT NULL DEFAULT 'ALBUM',

    release_date DATE,

    created_at TIMESTAMP NULL DEFAULT NULL,
    updated_at TIMESTAMP NULL DEFAULT NULL,

    CONSTRAINT fk_albums_artist
        FOREIGN KEY (artist_id)
        REFERENCES artists(id)
        ON DELETE RESTRICT
        ON UPDATE CASCADE,

    INDEX idx_albums_artist (artist_id),
    INDEX idx_albums_release_date (release_date)
) ENGINE=InnoDB;


-- ============================================================
-- 06. SONGS
-- ============================================================

CREATE TABLE songs (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,

    album_id BIGINT UNSIGNED NULL,

    title VARCHAR(200) NOT NULL,

    slug VARCHAR(220) NOT NULL UNIQUE,

    description TEXT,

    audio_url VARCHAR(1000) NOT NULL,

    cover_url VARCHAR(500),

    lyrics LONGTEXT,

    duration_seconds INT UNSIGNED NOT NULL,

    track_number INT UNSIGNED NULL,

    release_date DATE,

    is_explicit BOOLEAN NOT NULL DEFAULT FALSE,

    play_count BIGINT UNSIGNED NOT NULL DEFAULT 0,

    status ENUM(
        'DRAFT',
        'PUBLISHED',
        'ARCHIVED'
    ) NOT NULL DEFAULT 'DRAFT',

    created_at TIMESTAMP NULL DEFAULT NULL,
    updated_at TIMESTAMP NULL DEFAULT NULL,

    CONSTRAINT fk_songs_album
        FOREIGN KEY (album_id)
        REFERENCES albums(id)
        ON DELETE SET NULL
        ON UPDATE CASCADE,

    CONSTRAINT chk_song_duration
        CHECK (duration_seconds > 0),

    CONSTRAINT chk_song_track_number
        CHECK (
            track_number IS NULL
            OR track_number > 0
        ),

    INDEX idx_songs_album (album_id),
    INDEX idx_songs_title (title),
    INDEX idx_songs_status (status),
    INDEX idx_songs_play_count (play_count)
) ENGINE=InnoDB;


-- ============================================================
-- 07. SONG_ARTISTS
-- ============================================================

CREATE TABLE song_artists (
    song_id BIGINT UNSIGNED NOT NULL,

    artist_id BIGINT UNSIGNED NOT NULL,

    is_primary BOOLEAN NOT NULL DEFAULT FALSE,

    PRIMARY KEY (song_id, artist_id),

    CONSTRAINT fk_song_artists_song
        FOREIGN KEY (song_id)
        REFERENCES songs(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,

    CONSTRAINT fk_song_artists_artist
        FOREIGN KEY (artist_id)
        REFERENCES artists(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,

    INDEX idx_song_artists_artist (artist_id)
) ENGINE=InnoDB;


-- ============================================================
-- 08. SONG_GENRES
-- ============================================================

CREATE TABLE song_genres (
    song_id BIGINT UNSIGNED NOT NULL,

    genre_id BIGINT UNSIGNED NOT NULL,

    PRIMARY KEY (song_id, genre_id),

    CONSTRAINT fk_song_genres_song
        FOREIGN KEY (song_id)
        REFERENCES songs(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,

    CONSTRAINT fk_song_genres_genre
        FOREIGN KEY (genre_id)
        REFERENCES genres(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,

    INDEX idx_song_genres_genre (genre_id)
) ENGINE=InnoDB;


-- ============================================================
-- 09. ALBUM_GENRES
-- ============================================================

CREATE TABLE album_genres (
    album_id BIGINT UNSIGNED NOT NULL,

    genre_id BIGINT UNSIGNED NOT NULL,

    PRIMARY KEY (album_id, genre_id),

    CONSTRAINT fk_album_genres_album
        FOREIGN KEY (album_id)
        REFERENCES albums(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,

    CONSTRAINT fk_album_genres_genre
        FOREIGN KEY (genre_id)
        REFERENCES genres(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,

    INDEX idx_album_genres_genre (genre_id)
) ENGINE=InnoDB;


-- ============================================================
-- 10. PLAYLISTS
-- ============================================================

CREATE TABLE playlists (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,

    user_id BIGINT UNSIGNED NOT NULL,

    name VARCHAR(200) NOT NULL,

    description TEXT,

    cover_url VARCHAR(500),

    visibility ENUM(
        'PUBLIC',
        'PRIVATE'
    ) NOT NULL DEFAULT 'PRIVATE',

    created_at TIMESTAMP NULL DEFAULT NULL,
    updated_at TIMESTAMP NULL DEFAULT NULL,

    CONSTRAINT fk_playlists_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,

    INDEX idx_playlists_user (user_id),
    INDEX idx_playlists_visibility (visibility)
) ENGINE=InnoDB;


-- ============================================================
-- 11. PLAYLIST_SONGS
-- ============================================================

CREATE TABLE playlist_songs (
    playlist_id BIGINT UNSIGNED NOT NULL,

    song_id BIGINT UNSIGNED NOT NULL,

    position INT UNSIGNED NOT NULL,

    added_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY (playlist_id, song_id),

    CONSTRAINT fk_playlist_songs_playlist
        FOREIGN KEY (playlist_id)
        REFERENCES playlists(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,

    CONSTRAINT fk_playlist_songs_song
        FOREIGN KEY (song_id)
        REFERENCES songs(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,

    CONSTRAINT chk_playlist_position
        CHECK (position > 0),

    INDEX idx_playlist_songs_position
        (playlist_id, position),

    INDEX idx_playlist_songs_song
        (song_id)
) ENGINE=InnoDB;


-- ============================================================
-- 12. USER_LIKED_SONGS
-- ============================================================

CREATE TABLE user_liked_songs (
    user_id BIGINT UNSIGNED NOT NULL,

    song_id BIGINT UNSIGNED NOT NULL,

    created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY (user_id, song_id),

    CONSTRAINT fk_liked_songs_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,

    CONSTRAINT fk_liked_songs_song
        FOREIGN KEY (song_id)
        REFERENCES songs(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,

    INDEX idx_liked_songs_song (song_id)
) ENGINE=InnoDB;


-- ============================================================
-- 13. USER_FOLLOWED_ARTISTS
-- ============================================================

CREATE TABLE user_followed_artists (
    user_id BIGINT UNSIGNED NOT NULL,

    artist_id BIGINT UNSIGNED NOT NULL,

    created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY (user_id, artist_id),

    CONSTRAINT fk_followed_artists_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,

    CONSTRAINT fk_followed_artists_artist
        FOREIGN KEY (artist_id)
        REFERENCES artists(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,

    INDEX idx_followed_artists_artist (artist_id)
) ENGINE=InnoDB;


-- ============================================================
-- 14. USER_FOLLOWED_PLAYLISTS
-- ============================================================

CREATE TABLE user_followed_playlists (
    user_id BIGINT UNSIGNED NOT NULL,

    playlist_id BIGINT UNSIGNED NOT NULL,

    created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY (user_id, playlist_id),

    CONSTRAINT fk_followed_playlists_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,

    CONSTRAINT fk_followed_playlists_playlist
        FOREIGN KEY (playlist_id)
        REFERENCES playlists(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,

    INDEX idx_followed_playlists_playlist (playlist_id)
) ENGINE=InnoDB;


-- ============================================================
-- 15. LISTENING_HISTORY
-- ============================================================

CREATE TABLE listening_history (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,

    user_id BIGINT UNSIGNED NULL,

    song_id BIGINT UNSIGNED NOT NULL,

    played_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    duration_played INT UNSIGNED NOT NULL DEFAULT 0,

    completed BOOLEAN NOT NULL DEFAULT FALSE,

    device VARCHAR(50),

    CONSTRAINT fk_history_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE SET NULL
        ON UPDATE CASCADE,

    CONSTRAINT fk_history_song
        FOREIGN KEY (song_id)
        REFERENCES songs(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,

    CONSTRAINT chk_duration_played
        CHECK (duration_played >= 0),

    INDEX idx_history_user_played
        (user_id, played_at),

    INDEX idx_history_song
        (song_id),

    INDEX idx_history_played_at
        (played_at)
) ENGINE=InnoDB;


-- ============================================================
-- 16. SUBSCRIPTIONS
-- ============================================================

CREATE TABLE subscriptions (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,

    user_id BIGINT UNSIGNED NOT NULL,

    plan ENUM(
        'FREE',
        'PREMIUM',
        'FAMILY'
    ) NOT NULL DEFAULT 'FREE',

    status ENUM(
        'ACTIVE',
        'EXPIRED',
        'CANCELLED'
    ) NOT NULL DEFAULT 'ACTIVE',

    started_at TIMESTAMP NOT NULL,

    expires_at TIMESTAMP NULL,

    created_at TIMESTAMP NULL DEFAULT NULL,
    updated_at TIMESTAMP NULL DEFAULT NULL,

    CONSTRAINT fk_subscriptions_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,

    CONSTRAINT chk_subscription_dates
        CHECK (
            expires_at IS NULL
            OR expires_at > started_at
        ),

    INDEX idx_subscriptions_user (user_id),
    INDEX idx_subscriptions_status (status)
) ENGINE=InnoDB;


-- ============================================================
-- 17. PAYMENTS
-- ============================================================

CREATE TABLE payments (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,

    user_id BIGINT UNSIGNED NOT NULL,

    subscription_id BIGINT UNSIGNED NULL,

    amount DECIMAL(12,2) NOT NULL,

    currency CHAR(3) NOT NULL DEFAULT 'VND',

    provider ENUM(
        'MOMO',
        'VNPAY',
        'STRIPE'
    ) NOT NULL,

    transaction_id VARCHAR(255) NOT NULL UNIQUE,

    status ENUM(
        'PENDING',
        'SUCCESS',
        'FAILED',
        'REFUNDED'
    ) NOT NULL DEFAULT 'PENDING',

    paid_at TIMESTAMP NULL,

    created_at TIMESTAMP NULL DEFAULT NULL,
    updated_at TIMESTAMP NULL DEFAULT NULL,

    CONSTRAINT fk_payments_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE RESTRICT
        ON UPDATE CASCADE,

    CONSTRAINT fk_payments_subscription
        FOREIGN KEY (subscription_id)
        REFERENCES subscriptions(id)
        ON DELETE SET NULL
        ON UPDATE CASCADE,

    CONSTRAINT chk_payment_amount
        CHECK (amount >= 0),

    INDEX idx_payments_user (user_id),
    INDEX idx_payments_subscription (subscription_id),
    INDEX idx_payments_status (status),
    INDEX idx_payments_created_at (created_at)
) ENGINE=InnoDB;


-- ============================================================
-- 18. NOTIFICATIONS
-- ============================================================

CREATE TABLE notifications (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,

    user_id BIGINT UNSIGNED NOT NULL,

    type ENUM(
        'SYSTEM',
        'NEW_RELEASE',
        'PLAYLIST',
        'FOLLOW',
        'PAYMENT'
    ) NOT NULL,

    title VARCHAR(255) NOT NULL,

    message TEXT NOT NULL,

    data JSON NULL,

    is_read BOOLEAN NOT NULL DEFAULT FALSE,

    created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_notifications_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,

    INDEX idx_notifications_user
        (user_id, created_at),

    INDEX idx_notifications_unread
        (user_id, is_read)
) ENGINE=InnoDB;


-- ============================================================
-- 19. REPORTS
-- ============================================================

CREATE TABLE reports (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,

    user_id BIGINT UNSIGNED NULL,

    song_id BIGINT UNSIGNED NULL,

    artist_id BIGINT UNSIGNED NULL,

    playlist_id BIGINT UNSIGNED NULL,

    reason VARCHAR(100) NOT NULL,

    description TEXT,

    status ENUM(
        'PENDING',
        'REVIEWING',
        'RESOLVED',
        'REJECTED'
    ) NOT NULL DEFAULT 'PENDING',

    resolved_by BIGINT UNSIGNED NULL,

    resolved_at TIMESTAMP NULL,

    created_at TIMESTAMP NULL DEFAULT NULL,
    updated_at TIMESTAMP NULL DEFAULT NULL,

    CONSTRAINT fk_reports_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE SET NULL
        ON UPDATE CASCADE,

    CONSTRAINT fk_reports_song
        FOREIGN KEY (song_id)
        REFERENCES songs(id)
        ON DELETE SET NULL
        ON UPDATE CASCADE,

    CONSTRAINT fk_reports_artist
        FOREIGN KEY (artist_id)
        REFERENCES artists(id)
        ON DELETE SET NULL
        ON UPDATE CASCADE,

    CONSTRAINT fk_reports_playlist
        FOREIGN KEY (playlist_id)
        REFERENCES playlists(id)
        ON DELETE SET NULL
        ON UPDATE CASCADE,

    CONSTRAINT fk_reports_resolved_by
        FOREIGN KEY (resolved_by)
        REFERENCES users(id)
        ON DELETE SET NULL
        ON UPDATE CASCADE,

    INDEX idx_reports_status (status),
    INDEX idx_reports_created_at (created_at)
) ENGINE=InnoDB;


-- ============================================================
-- 20. RECENTLY_PLAYED
-- ============================================================

CREATE TABLE recently_played (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,

    user_id BIGINT UNSIGNED NOT NULL,

    song_id BIGINT UNSIGNED NOT NULL,

    played_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_recently_played_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,

    CONSTRAINT fk_recently_played_song
        FOREIGN KEY (song_id)
        REFERENCES songs(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,

    INDEX idx_recently_played_user
        (user_id, played_at),

    INDEX idx_recently_played_song
        (song_id)
) ENGINE=InnoDB;


-- ============================================================
-- 21. USER_ROLES
-- ============================================================

CREATE TABLE user_roles (
    user_id BIGINT UNSIGNED NOT NULL,

    role_id BIGINT UNSIGNED NOT NULL,

    created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY (user_id, role_id),

    CONSTRAINT fk_user_roles_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,

    CONSTRAINT fk_user_roles_role
        FOREIGN KEY (role_id)
        REFERENCES roles(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,

    INDEX idx_user_roles_role (role_id)
) ENGINE=InnoDB;


-- ============================================================
-- 22. PASSWORD_RESET_TOKENS
-- ============================================================

CREATE TABLE password_reset_tokens (
    email VARCHAR(255) NOT NULL PRIMARY KEY,

    token VARCHAR(255) NOT NULL,

    created_at TIMESTAMP NULL DEFAULT NULL
) ENGINE=InnoDB;


-- ============================================================
-- 23. SOCIAL_ACCOUNTS
-- ============================================================

CREATE TABLE social_accounts (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,

    user_id BIGINT UNSIGNED NOT NULL,

    provider_name VARCHAR(50) NOT NULL,

    provider_id VARCHAR(191) NOT NULL,

    created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_social_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    
    UNIQUE INDEX idx_social_provider_id (provider_name, provider_id),
    INDEX idx_social_user (user_id)
) ENGINE=InnoDB;


-- ============================================================
-- SEED ROLES
-- ============================================================

INSERT INTO roles (
    name,
    description,
    created_at,
    updated_at
)
VALUES
(
    'ADMIN',
    'System administrator',
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
),
(
    'USER',
    'Normal music streaming user',
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
),
(
    'ARTIST',
    'Music artist',
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
);


-- ============================================================
-- END MELORA DATABASE
-- ============================================================