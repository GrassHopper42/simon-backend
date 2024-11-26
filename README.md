# Simon

**S**ales and **I**nventory **M**anagement m**ON**ster

## Description

Simon은 사용자가 판매 및 재고를 관리할 수 있는 서비스입니다.

## Usage

### Project setup

```bash
$ pnpm install
```

### Compile and run the project

```bash
# development
$ pnpm run start

# watch mode
$ pnpm run start:dev

# production mode
$ pnpm run start:prod
```

### Run tests

```bash
# unit tests
$ pnpm run test

# e2e tests
$ pnpm run test:e2e

# test coverage
$ pnpm run test:cov
```

## Architecture

Simon은 다음과 같은 기술을 사용하여 구현되어 있습니다.

- **NestJS**: Node.js 프레임워크로 Simon의 서버를 구현합니다.
- **TypeORM**: TypeScript ORM으로 Simon의 데이터베이스를 구현합니다.
- **PostgreSQL**: Simon의 데이터베이스로 사용합니다.

## Domain

[도메인 위키](https://github.com/GrassHopper42/simon-backend/wiki/Domain)

```mermaid
classDiagram
    %% Core Domains
    class Product {
        +code
        +name
        +price
        +unit
        +status
    }

    class Party {
        +code
        +name
        +type
        +businessNumber
    }

    class Staff {
        +name
        +phone
        +role
    }

    class Sale {
        +products
        +customer
        +seller
        +totalAmount
        +status
    }

    class Inventory {
        +product
        +quantity
        +location
    }

    class Order {
        +products
        +supplier
        +orderDate
        +status
    }

    class AccountBalance {
        +party
        +amount
        +type
        +status
    }

    class Transaction {
        +party
        +amount
        +type
        +date
    }

    %% Documents
    class Estimate {
        +products
        +customer
        +validUntil
    }

    class Receipt {
        +products
        +customer
        +totalAmount
    }

    %% Supporting Domains
    class Recovery {
        +product
        +customer
        +status
    }

    class Delivery {
        +receipt
        +status
        +address
    }

    class Payment {
        +amount
        +method
        +date
    }

    class Notification {
        +content
        +priority
        +receiver
    }

    class Audit {
        +event
        +date
        +user
    }

    %% Relationships
    Product --> Sale : sold through
    Product --> Inventory : stored in
    Product --> Order : ordered via
    Product --> Recovery : can be recovered

    Party --> Sale : buys
    Party --> Order : supplies
    Party --> AccountBalance : has

    Staff --> Sale : handles
    Staff --> Order : manages
    Staff --> Inventory : maintains

    Sale --> Estimate : generates
    Sale --> Receipt : issues
    Sale --> Payment : receives
    Sale --> Delivery : triggers
    Sale --> Transaction : records

    Order --> Inventory : updates
    Order --> Transaction : records

    AccountBalance --> Transaction : tracks
    AccountBalance --> Notification : triggers

    Inventory --> Notification : triggers

    Receipt --> Delivery : includes

    %% All domains can trigger audit
    Sale .. Audit : logs
    Order .. Audit : logs
    Inventory .. Audit : logs
    Payment .. Audit : logs
    Recovery .. Audit : logs
    Transaction .. Audit : logs
```

## ERD

```mermaid
erDiagram
    PRODUCT {
        int id PK
        string code UK
        string name
        int price
        string unit
        string capacity
        string specification
        text description
        boolean is_recoverable
        int optimal_stock
        int safety_stock
        enum status
        timestamp created_at
        timestamp updated_at
    }

    CATEGORY {
        int id PK
        string name
        int parent_id FK
        timestamp created_at
        timestamp updated_at
    }

    PRODUCT_CATEGORY {
        int product_id PK, FK
        int category_id PK, FK
    }

    PARTY {
        int id PK
        string code UK
        string name
        string alias
        string phone
        string address
        string email
        string business_number
        string industry
        enum type
        timestamp created_at
        timestamp updated_at
    }

    PARTY_GROUP {
        int id PK
        string name
        timestamp created_at
        timestamp updated_at
    }

    PARTY_GROUP_MAPPING {
        int party_id PK, FK
        int group_id PK, FK
    }

    STAFF {
        int id PK
        string name
        string phone UK
        enum role
        date birth_date
        string address
        timestamp created_at
        timestamp updated_at
    }

    SALE {
        int id PK
        int customer_id FK
        int seller_id FK
        int total_amount
        enum status
        timestamp created_at
        timestamp updated_at
    }

    SALE_ITEM {
        int id PK
        int sale_id FK
        int product_id FK
        int quantity
        int price
        timestamp created_at
        timestamp updated_at
    }

    ESTIMATE {
        int id PK
        string estimate_number UK
        int customer_id FK
        int seller_id FK
        date estimate_date
        date valid_until
        int total_amount
        text customer_request
        json additional_info
        timestamp created_at
        timestamp updated_at
    }

    ESTIMATE_ITEM {
        int id PK
        int estimate_id FK
        int product_id FK
        int quantity
        int price
        timestamp created_at
        timestamp updated_at
    }

    RECEIPT {
        int id PK
        string receipt_number UK
        int sale_id FK
        int customer_id FK
        int seller_id FK
        date sale_date
        int total_amount
        enum status
        timestamp created_at
        timestamp updated_at
    }

    RECEIPT_ITEM {
        int id PK
        int receipt_id FK
        int product_id FK
        int quantity
        int price
        timestamp created_at
        timestamp updated_at
    }

    INVENTORY {
        int id PK
        int product_id FK
        int quantity
        string location
        date stock_taking_date
        int stock_taker_id FK
        timestamp created_at
        timestamp updated_at
    }

    ORDER {
        int id PK
        int supplier_id FK
        int orderer_id FK
        date order_date
        date expected_date
        int total_amount
        enum status
        timestamp created_at
        timestamp updated_at
    }

    ORDER_ITEM {
        int id PK
        int order_id FK
        int product_id FK
        int order_quantity
        int arrival_quantity
        int price
        timestamp created_at
        timestamp updated_at
    }

    DELIVERY {
        int id PK
        int receipt_id FK
        string address
        enum status
        int delivery_staff_id FK
        timestamp created_at
        timestamp updated_at
    }

    RECOVERY {
        int id PK
        int product_id FK
        int customer_id FK
        enum status
        date recovery_date
        timestamp created_at
        timestamp updated_at
    }

    PAYMENT {
        int id PK
        int receipt_id FK
        int amount
        enum method
        int staff_id FK
        timestamp payment_date
        timestamp created_at
        timestamp updated_at
    }

    ACCOUNT_BALANCE {
        int id PK
        int party_id FK
        int balance
        enum type
        string status
        timestamp last_modified
        timestamp created_at
        timestamp updated_at
    }

    TRANSACTION {
        int id PK
        int party_id FK
        int amount
        enum type
        int staff_id FK
        text note
        timestamp transaction_date
        timestamp created_at
        timestamp updated_at
    }

    NOTIFICATION {
        int id PK
        text content
        enum priority
        int receiver_id FK
        boolean is_confirmed
        timestamp notification_date
        timestamp created_at
        timestamp updated_at
    }

    AUDIT {
        int id PK
        string event
        int user_id FK
        json payload
        timestamp event_date
        timestamp created_at
    }

    PRODUCT ||--o{ PRODUCT_CATEGORY : "belongs to"
    CATEGORY ||--o{ PRODUCT_CATEGORY : "categorizes"
    CATEGORY ||--o{ CATEGORY : "has parent"

    PARTY ||--o{ PARTY_GROUP_MAPPING : "belongs to"
    PARTY_GROUP ||--o{ PARTY_GROUP_MAPPING : "contains"

    SALE ||--o{ SALE_ITEM : "contains"
    SALE ||--|| RECEIPT : "generates"
    SALE }|--|| PARTY : "customer"
    SALE }|--|| STAFF : "seller"

    ESTIMATE ||--o{ ESTIMATE_ITEM : "contains"
    ESTIMATE }|--|| PARTY : "customer"
    ESTIMATE }|--|| STAFF : "seller"

    RECEIPT ||--o{ RECEIPT_ITEM : "contains"
    RECEIPT ||--o{ PAYMENT : "receives"
    RECEIPT ||--|| DELIVERY : "has"

    ORDER ||--o{ ORDER_ITEM : "contains"
    ORDER }|--|| PARTY : "supplier"
    ORDER }|--|| STAFF : "orderer"

    ACCOUNT_BALANCE }|--|| PARTY : "belongs to"
    TRANSACTION }|--|| PARTY : "involves"

    INVENTORY }|--|| PRODUCT : "stocks"
    RECOVERY }|--|| PRODUCT : "recovers"
```
