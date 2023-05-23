CREATE TABLE company
(
    company_id              BIGSERIAL PRIMARY KEY,
    tax_registration_number INT UNIQUE,
    company_name            VARCHAR(255),
    currency_code           VARCHAR(3)
);

CREATE TABLE fiscal_year
(
    fiscal_year_id BIGSERIAL PRIMARY KEY,
    fiscal_year    INT UNIQUE,
    start_date     DATE,
    end_date       DATE,
    date_created   DATE,
    company_id     BIGSERIAL,
    FOREIGN KEY (company_id) REFERENCES company (company_id)
);

CREATE TABLE customer
(
    customer_id            BIGSERIAL PRIMARY KEY,
    customer_tax_id        INT UNIQUE,
    company_name           VARCHAR(255),
    billing_address_detail VARCHAR(255),
    billing_city           VARCHAR(255),
    billing_postal_code    VARCHAR(20),
    billing_country        VARCHAR(2),
    ship_to_address_detail VARCHAR(255),
    ship_to_city           VARCHAR(255),
    ship_to_postal_code    VARCHAR(20),
    ship_to_country        VARCHAR(2),
    self_billing_indicator INT,
    company_id             BIGSERIAL,
    FOREIGN KEY (company_id) REFERENCES company (company_id)
);

CREATE TABLE product
(
    product_id          BIGSERIAL PRIMARY KEY,
    product_type        VARCHAR(1),
    product_code        VARCHAR(50),
    product_description VARCHAR(255),
    product_number_code VARCHAR(50),
    company_id          BIGSERIAL,
    FOREIGN KEY (company_id) REFERENCES company (company_id)
);

CREATE TABLE tax_entry
(
    tax_id             BIGSERIAL PRIMARY KEY,
    tax_type           VARCHAR(50),
    tax_country_region VARCHAR(5),
    tax_code           VARCHAR(50),
    description        VARCHAR(255),
    tax_percentage     DECIMAL(5, 2),
    company_id         BIGSERIAL,
    FOREIGN KEY (company_id) REFERENCES company (company_id)
);

CREATE TABLE invoice
(
    invoice_id          BIGSERIAL PRIMARY KEY,
    invoice_no          VARCHAR(50),
    atcud               VARCHAR(50),
    invoice_status      VARCHAR(50),
    invoice_status_date TIMESTAMP,
    source_id           INT,
    source_billing      VARCHAR(50),
    hash                VARCHAR(255),
    hash_control        INT,
    period              INT,
    invoice_date        DATE,
    invoice_type        VARCHAR(50),
    system_entry_date   TIMESTAMP,
    customer_id         BIGSERIAL,
    tax_payable         DECIMAL(10, 2),
    net_total           DECIMAL(10, 2),
    gross_total         DECIMAL(10, 2),
    company_id          BIGSERIAL,
    FOREIGN KEY (company_id) REFERENCES company (company_id),
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