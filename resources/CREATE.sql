CREATE TABLE customer
(
    customer_id            BIGSERIAL PRIMARY KEY,
    customer_tax_id        INT,
    company_name           VARCHAR(255),
    billing_address_detail VARCHAR(255),
    billing_city           VARCHAR(255),
    billing_postal_code    VARCHAR(20),
    billing_country        VARCHAR(2),
    ship_to_address_detail VARCHAR(255),
    ship_to_city           VARCHAR(255),
    ship_to_postal_code    VARCHAR(20),
    ship_to_country        VARCHAR(2),
    self_billing_indicator INT
);

CREATE TABLE product
(
    product_id          BIGSERIAL PRIMARY KEY,
    product_type        VARCHAR(1),
    product_code        VARCHAR(50),
    product_description VARCHAR(255),
    product_number_code VARCHAR(50)
);

CREATE TABLE tax_entry
(
    tax_id             BIGSERIAL PRIMARY KEY,
    tax_type           VARCHAR(50),
    tax_country_region VARCHAR(2),
    tax_code           VARCHAR(50),
    description        VARCHAR(255),
    tax_percentage     DECIMAL(5, 2)
);

CREATE TABLE invoice
(
    invoice_id                      BIGSERIAL PRIMARY KEY,
    invoice_no                      VARCHAR(50),
    atcud                           VARCHAR(50),
    invoice_status                  VARCHAR(50),
    invoice_status_date             TIMESTAMP,
    source_id                       INT,
    source_billing                  VARCHAR(50),
    hash                            VARCHAR(255),
    hash_control                    INT,
    period                          INT,
    invoice_date                    DATE,
    invoice_type                    VARCHAR(50),
    self_billing_indicator          INT,
    cash_vatscheme_indicator        INT,
    third_parties_billing_indicator INT,
    system_entry_date               TIMESTAMP,
    customer_id                     BIGSERIAL,
    tax_payable                     DECIMAL(10, 2),
    net_total                       DECIMAL(10, 2),
    gross_total                     DECIMAL(10, 2),
    FOREIGN KEY (customer_id) REFERENCES customer (customer_id)
);

CREATE TABLE invoice_line
(
    line_id         BIGSERIAL PRIMARY KEY,
    invoice_id      BIGSERIAL,
    product_id      BIGSERIAL,
    line_number     INT,
    quantity        DECIMAL(10, 2),
    unit_of_measure VARCHAR(50),
    unit_price      DECIMAL(18, 5),
    tax_point_date  DATE,
    description     VARCHAR(255),
    credit_amount   DECIMAL(10, 2),
    debit_amount    DECIMAL(10, 2),
    tax_id          BIGSERIAL,
    FOREIGN KEY (invoice_id) REFERENCES invoice (invoice_id),
    FOREIGN KEY (product_id) REFERENCES product (product_id),
    FOREIGN KEY (tax_id) REFERENCES tax_entry (tax_id)
);