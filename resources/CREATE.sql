CREATE TABLE company
(
    company_id              BIGSERIAL PRIMARY KEY,
    company_name            VARCHAR(255),
    currency_code           VARCHAR(3)
);

CREATE TABLE fiscal_year
(
    fiscal_year_id    BIGSERIAL PRIMARY KEY,
    fiscal_year       INT UNIQUE,
    start_date        DATE,
    end_date          DATE,
    date_created      DATE,
    company_id        BIGSERIAL,
    number_of_entries INT            NOT NULL DEFAULT 0,
    customers_count   INT            NOT NULL DEFAULT 0,
    net_sales         DECIMAL(10, 2) NOT NULL DEFAULT 0,
    gross_sales       DECIMAL(10, 2) NOT NULL DEFAULT 0,
    aov               DECIMAL(10, 2) NOT NULL DEFAULT 0,
    FOREIGN KEY (company_id) REFERENCES company (company_id)
);

CREATE TABLE customer
(
    customer_tax_id        BIGSERIAL PRIMARY KEY,
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
    saft_customer_id       INT UNIQUE,
    FOREIGN KEY (company_id) REFERENCES company (company_id)
);

CREATE TABLE customer_fiscal_year
(
    customer_fiscal_year_id BIGSERIAL PRIMARY KEY,
    saft_customer_id        BIGSERIAL,
    fiscal_year_id          BIGSERIAL,
    invoices_count          INT NOT NULL DEFAULT 0,
    FOREIGN KEY (saft_customer_id) REFERENCES customer (saft_customer_id),
    FOREIGN KEY (fiscal_year_id) REFERENCES fiscal_year (fiscal_year_id)
);

CREATE TABLE product
(
    product_code        BIGSERIAL PRIMARY KEY,
    product_type        VARCHAR(1),
    product_description VARCHAR(255),
    product_number_code VARCHAR(50),
    company_id          BIGSERIAL,
    FOREIGN KEY (company_id) REFERENCES company (company_id)
);

CREATE TABLE product_fiscal_year
(
    product_code   BIGSERIAL PRIMARY KEY,
    fiscal_year_id BIGSERIAL,
    amount_spent   DECIMAL(10, 2) NOT NULL DEFAULT 0,
    FOREIGN KEY (product_code) REFERENCES product (product_code),
    FOREIGN KEY (fiscal_year_id) REFERENCES fiscal_year (fiscal_year_id)
);

CREATE TABLE invoice
(
    invoice_id          BIGSERIAL PRIMARY KEY,
    invoice_no          VARCHAR(255),
    atcud               VARCHAR(50),
    hash                varchar(255),
    invoice_status      VARCHAR(50),
    invoice_status_date TIMESTAMP,
    invoice_date        DATE,
    invoice_type        VARCHAR(50),
    system_entry_date   TIMESTAMP,
    saft_customer_id    INT,
    tax_payable         DECIMAL(10, 2) NOT NULL DEFAULT 0,
    net_total           DECIMAL(10, 2) NOT NULL DEFAULT 0,
    gross_total         DECIMAL(10, 2) NOT NULL DEFAULT 0,
    fiscal_year         INT,
    company_id          BIGSERIAL,
    FOREIGN KEY (company_id) REFERENCES company (company_id)
);

CREATE TABLE invoice_line
(
    line_id        BIGSERIAL PRIMARY KEY,
    fiscal_year    INT,
    invoice_hash   VARCHAR(255),
    quantity       DECIMAL(10, 2) NOT NULL DEFAULT 0,
    unit_price     DECIMAL(18, 5) NOT NULL DEFAULT 0,
    tax_point_date DATE,
    credit_amount  DECIMAL(10, 2) NOT NULL DEFAULT 0,
    debit_amount   DECIMAL(10, 2) NOT NULL DEFAULT 0,
    product_code   BIGSERIAL,
    FOREIGN KEY (product_code) REFERENCES product (product_code)
);