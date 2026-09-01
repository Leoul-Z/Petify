
CREATE TABLE IF NOT EXISTS users (
  id         UUID                        NOT NULL,
  full_name  VARCHAR(255)                NOT NULL,
  email      VARCHAR(255)                NOT NULL,
  password   VARCHAR(255)                NOT NULL,  -- bcrypt hash
  role       VARCHAR(50)                 NOT NULL CHECK (role IN ('buyer', 'seller')),
  created_at TIMESTAMP                   NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  CONSTRAINT uq_users_email UNIQUE (email)
);



CREATE TABLE IF NOT EXISTS listings (
  id          UUID                              NOT NULL,
  seller_id   UUID                              NOT NULL,
  name        VARCHAR(255)                      NOT NULL,
  species     VARCHAR(100)                      NOT NULL,
  breed       VARCHAR(100)                      NOT NULL,
  age_months  INT                               NOT NULL,
  price_usd   DECIMAL(10,2)                     NOT NULL,
  description TEXT,
  photo_url   TEXT,
  status      VARCHAR(50)                       NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'sold', 'deleted')),
  created_at  TIMESTAMP                         NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at  TIMESTAMP                         NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  CONSTRAINT fk_listings_seller FOREIGN KEY (seller_id) REFERENCES users (id)
    ON UPDATE CASCADE ON DELETE RESTRICT
);


CREATE TABLE IF NOT EXISTS orders (
  id          UUID                              NOT NULL,
  buyer_id    UUID                              NOT NULL,
  seller_id   UUID                              NOT NULL,
  listing_id  UUID                              NOT NULL,
  pet_name    VARCHAR(255)                      NOT NULL,
  price_usd   DECIMAL(10,2)                     NOT NULL,
  status      VARCHAR(50)                       NOT NULL DEFAULT 'confirmed' CHECK (status IN ('confirmed', 'cancelled')),
  created_at  TIMESTAMP                         NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  CONSTRAINT fk_orders_buyer   FOREIGN KEY (buyer_id)   REFERENCES users    (id)
    ON UPDATE CASCADE ON DELETE RESTRICT,
  CONSTRAINT fk_orders_seller  FOREIGN KEY (seller_id)  REFERENCES users    (id)
    ON UPDATE CASCADE ON DELETE RESTRICT,
  CONSTRAINT fk_orders_listing FOREIGN KEY (listing_id) REFERENCES listings (id)
    ON UPDATE CASCADE ON DELETE RESTRICT
);
