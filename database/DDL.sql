-- DATA DEFINITION LANGUAGE
-- Admin
CREATE TABLE ADMIN (
    USERNAME VARCHAR2(255 CHAR),
    PASSWORD VARCHAR2(255 CHAR)
);

--Merchant
CREATE TABLE merchant (
    id       INTEGER GENERATED BY DEFAULT ON NULL AS IDENTITY,
    name     VARCHAR2(255 CHAR),
    email    VARCHAR2(255 CHAR),
    password VARCHAR2(255 CHAR),
    status   NUMBER(1),
    phone    VARCHAR2(20 CHAR),
    website  VARCHAR2(255 CHAR)
);

ALTER TABLE merchant 
    ADD CONSTRAINT merchant_pk PRIMARY KEY ( id )
    ADD CONSTRAINT MERCHANT_NAME UNIQUE(NAME);

--category
CREATE TABLE category (
    id   INTEGER GENERATED BY DEFAULT ON NULL AS IDENTITY,
    name VARCHAR2(255 CHAR)
);
 
ALTER TABLE category 
    ADD CONSTRAINT category_pk PRIMARY KEY ( id )
    ADD CONSTRAINT NAME UNIQUE(NAME);

--products
CREATE TABLE product (
    id          INTEGER GENERATED BY DEFAULT ON NULL AS IDENTITY,
    title       VARCHAR2(255 CHAR) NOT NULL,
    description CLOB,
    image_url   VARCHAR2(255 CHAR),
    price       INTEGER,
    stock       INTEGER,
    merchant_id INTEGER NOT NULL
);

ALTER TABLE product 
    ADD CONSTRAINT product_pk PRIMARY KEY ( id )
    ADD CONSTRAINT product_merchant_fk FOREIGN KEY ( merchant_id )
        REFERENCES merchant ( id ) ON DELETE CASCADE;

CREATE SEQUENCE PRODUCT_SEQ START WITH 1;
        
-- product category m to m relation
CREATE TABLE PRODUCT_CATEGORY (
    PRODUCT_ID INTEGER,
    CATEGORY_ID INTEGER
);

ALTER TABLE PRODUCT_CATEGORY
    ADD CONSTRAINT PRODUCT_ID_FK FOREIGN KEY (PRODUCT_ID)
        REFERENCES PRODUCT (ID) ON DELETE CASCADE
    ADD CONSTRAINT CATEGORY_ID_FK FOREIGN KEY (CATEGORY_ID)
        REFERENCES CATEGORY (ID) ON DELETE CASCADE;

        
--customers
CREATE TABLE customer (
    id       INTEGER GENERATED BY DEFAULT ON NULL AS IDENTITY,
    email    VARCHAR2(255 CHAR),
    password VARCHAR2(255 CHAR),
    full_name VARCHAR2(255 CHAR),
    phone    VARCHAR2(15 CHAR),
    gender VARCHAR2(20 CHAR)
);

ALTER TABLE customer 
    ADD CONSTRAINT customer_pk PRIMARY KEY ( id )
    ADD CONSTRAINT EMAIL UNIQUE(EMAIL)
    ADD CONSTRAINT PHONE UNIQUE(PHONE);


--reviews
CREATE TABLE review (
    id           INTEGER GENERATED BY DEFAULT ON NULL AS IDENTITY,
    rating       INTEGER NOT NULL,
    note         CLOB,
    product_id  INTEGER NOT NULL,
    customer_id INTEGER
);

ALTER TABLE review 
    ADD CONSTRAINT review_pk PRIMARY KEY ( id )
    ADD CONSTRAINT review_customer_fk FOREIGN KEY ( customer_id )
        REFERENCES customer ( id ) ON DELETE SET NULL
    ADD CONSTRAINT review_product_fk FOREIGN KEY ( product_id )
        REFERENCES product ( id ) ON DELETE CASCADE;        

--carts
CREATE TABLE cart (
    id           INTEGER GENERATED BY DEFAULT ON NULL AS IDENTITY,
    total_item  INTEGER,
    total_price INTEGER,
    customer_id INTEGER NOT NULL
);

CREATE UNIQUE INDEX cart__idx ON
    cart (
        customer_id
    ASC );

ALTER TABLE cart 
    ADD CONSTRAINT cart_pk PRIMARY KEY ( id )
    ADD CONSTRAINT cart_customer_fk FOREIGN KEY ( customer_id )
        REFERENCES customer ( id ) ON DELETE CASCADE;
        
--carts-items
CREATE TABLE cart_item (
    cart_id    INTEGER NOT NULL,
    product_id INTEGER NOT NULL,
    quantity    INTEGER,
    note CLOB
);

ALTER TABLE cart_item 
    ADD CONSTRAINT cart_item_pk PRIMARY KEY ( cart_id, product_id )
    ADD CONSTRAINT cart_item_cart_fk FOREIGN KEY ( cart_id )
        REFERENCES cart ( id ) ON DELETE CASCADE
    ADD CONSTRAINT cart_item_product_fk FOREIGN KEY ( product_id )
        REFERENCES product ( id ) ON DELETE CASCADE;
        
-- payment method
CREATE TABLE payment (
    id         INTEGER GENERATED BY DEFAULT ON NULL AS IDENTITY,
    method     VARCHAR2(255 CHAR),
    acc_number VARCHAR2(255 CHAR),
    status INTEGER
);

ALTER TABLE payment 
    ADD CONSTRAINT payment_pk PRIMARY KEY ( id )
    ADD CONSTRAINT PAYMENT_METHOD UNIQUE(METHOD);

-- TABLE INVOICE
CREATE TABLE invoice (
    id          INTEGER NOT NULL,
    status      NUMBER(1),
    bill        INTEGER,
    fee         FLOAT(1),
    customer_id INTEGER,
    payment_id  INTEGER
);

ALTER TABLE invoice 
    ADD CONSTRAINT invoice_pk PRIMARY KEY ( id )
    ADD CONSTRAINT invoice_customer_fk FOREIGN KEY ( customer_id )
        REFERENCES customer ( id ) ON DELETE SET NULL
    ADD CONSTRAINT invoice_payment_fk FOREIGN KEY ( payment_id )
        REFERENCES payment ( id ) ON DELETE SET NULL;

CREATE SEQUENCE INVOICE_SEQ START WITH 1;

--orders
CREATE TABLE orders (
    id          INTEGER NOT NULL,
    status      INTEGER,
    total_item  INTEGER,
    total_price INTEGER,
    customer_id INTEGER,
    merchant_id INTEGER,
    invoice_id  INTEGER
);

ALTER TABLE orders 
    ADD CONSTRAINT orders_pk PRIMARY KEY ( id )
    ADD CONSTRAINT orders_customer_fk FOREIGN KEY ( customer_id )
        REFERENCES customer ( id ) ON DELETE SET NULL
    ADD CONSTRAINT orders_merchant_fk FOREIGN KEY ( merchant_id )
        REFERENCES merchant ( id ) ON DELETE SET NULL
    ADD CONSTRAINT orders_invoice_fk FOREIGN KEY ( invoice_id )
        REFERENCES invoice ( id ) ON DELETE SET NULL;

CREATE SEQUENCE ORDER_SEQ START WITH 1;
        
        
--orders-items
CREATE TABLE orders_item (
    orders_id   INTEGER NOT NULL,
    product_id INTEGER,
    quantity    INTEGER,
    note    CLOB
);

ALTER TABLE orders_item 
    ADD CONSTRAINT orders_item_pk PRIMARY KEY ( product_id, orders_id )
    ADD CONSTRAINT orders_item_orders_fk FOREIGN KEY ( orders_id )
        REFERENCES orders ( id ) ON DELETE CASCADE
    ADD CONSTRAINT orders_item_product_fk FOREIGN KEY ( product_id )
        REFERENCES product ( id ) ON DELETE SET NULL;
        

