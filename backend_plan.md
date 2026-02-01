# Backend Implementation Plan - FullMotor

 This plan details the requirements and specifications for migrating the FullMotor application from a file-based system (JSON) to a robust backend architecture.

## 1. Objectives

-   **Data Consistency**: Move from `vehicles.json` to a relational database (PostgreSQL).
-   **Flexibility**: Support dynamic schema changes (new features, specs) using `JSONb`.
-   **Performance**: Efficient filtering and pagination.
-   **AI Readiness**: Prepare for RAG (Retrieval-Augmented Generation) with vector embeddings.
-   **Content Management**: Allow dynamic configuration of the Home Carousel.

## 2. Technology Stack Recommendations

-   **Database**: PostgreSQL (v15+) with `pgvector` extension enabled.
-   **ORM**: Prisma or Drizzle (Type-safe database access).
-   **API Framework**: Next.js App Router (API Routes / Server Actions) strictly typed.

---

## 3. Database Schema

### Enums

```sql
enum FuelType {
  NAFTA
  DIESEL
  HYBRID
  ELECTRIC
  OTHER
}

enum ElectricSubtype {
  BEV   -- Battery Electric Vehicle (100% Eléctrico)
  PHEV  -- Plug-in Hybrid (Híbrido Enchufable)
  MHEV  -- Mild Hybrid (Microhíbrido)
  HEV   -- Hybrid Electric Vehicle (Híbrido Convencional)
  OTHER
}

enum Currency {
  USD
  UYU
}

enum VehicleCondition {
  NEW
  USED
}
```

### Table: `Vehicle`

| Column | Type | Description |
| :--- | :--- | :--- |
| `id` | UUID (PK) | Unique Identifier |
| `slug` | String (Unique) | URL friendly identifier (e.g. `toyota-corolla-2026`) |
| `brand` | String | Indexed for filtering |
| `model` | String | Indexed for filtering |
| `version` | String | Specific version (e.g. "XLi 2.0") |
| `year` | Integer | |
| `price_amount` | Decimal | Numeric value for sorting/filtering |
| `currency` | Currency | Default USD |
| `fuel_type` | FuelType | Indexed |
| `electric_subtype` | ElectricSubtype | Nullable (Only for Hybrid/Electric) |
| `category` | String | e.g. "autos", "suvs", "motos" |
| `specs` | JSONb | Flexible generic specs (engineCc, hp, dimensions, safety...) |
| `images` | String[] | Array of image URLs |
| `description` | Text | Full description text |
| `search_vector` | tsvector | PostgreSQL Full Text Search vector (Auto-generated) |
| `embedding` | vector(1536) | **[AI]** Vector embedding for RAG/Semantic Search |
| `created_at` | DateTime | |
| `updated_at` | DateTime | |

### Table: `CarouselConfig`

Allows dynamic control of what appears in the home carousel.

| Column | Type | Description |
| :--- | :--- | :--- |
| `id` | UUID (PK) | |
| `vehicle_id` | UUID (FK) | Relation to Vehicle |
| `order` | Integer | Display order in the carousel |
| `is_active` | Boolean | Quickly toggle visibility |

---

## 4. API Specification

All responses should be JSON. Errors should return appropriate HTTP Status Codes (400, 404, 500).

### Public Endpoints

#### 1. List Vehicles (Catalog)
**`GET /api/vehicles`**

Retrieves the main list of vehicles with filtering and pagination.

*   **Query Parameters:**
    *   `page` (int, default: 1)
    *   `limit` (int, default: 12)
    *   `brand` (string, optional)
    *   `fuel_type` (string, optional)
    *   `category` (string, optional)
    *   `min_price` (int, optional)
    *   `max_price` (int, optional)
    *   `sort` (enum: `price_asc`, `price_desc`, `newest`)
*   **Response:**
    ```json
    {
      "data": [ { "id": "...", "brand": "...", "price_amount": 32900, "specs": {...} }, ... ],
      "meta": {
        "total": 50,
        "page": 1,
        "last_page": 5
      }
    }
    ```

#### 2. Get Vehicle Detail
**`GET /api/vehicles/:slug`**

*   **Response:** Full vehicle object, including all JSONb specs and rich description.

#### 3. Search (Standard & Semantic)
**`GET /api/search`**

*   **Query Parameters:**
    *   `q` (string): Search term (e.g. "sedan bajo consumo")
    *   `type` (enum, default `text`): `text` (standard) or `semantic` (vector)
*   **Behavior:**
    *   **Text**: Uses PostgreSQL `ilike` or `ts_vector` for keyword matching.
    *   **Semantic**: Converts query to embedding (via OpenAI/Cohere API) and compares with `embedding` column using cosine distance.

#### 4. Carousel Items
**`GET /api/carousel`**

*   **Behavior:** Returns the list of vehicles configured in `CarouselConfig`, ordered by `order`. Allows the frontend to render the Home Carousel dynamically.

---

### Admin / Management Endpoints

#### 5. Manage Carousel
**`PUT /api/carousel`**

Updates the configuration of the carousel. Both selecting which vehicles to show and their order.

*   **Body:**
    ```json
    {
      "items": [
        { "vehicle_id": "uuid-1", "order": 1 },
        { "vehicle_id": "uuid-2", "order": 2 }
      ]
    }
    ```

#### 6. Filters Metadata (Facets)
**`GET /api/filters`**

Returns available values for the frontend sidebar (brands, counts, min/max prices).

*   **Response:**
    ```json
    {
      "brands": [ { "name": "Toyota", "count": 12 }, ... ],
      "categories": [ "autos", "suvs", ... ],
      "price_range": { "min": 9000, "max": 150000 }
    }
    ```

---

## 5. Implementation Strategy (Next Steps)

1.  **Setup Database**: Initialize Postgres project (e.g. Supabase or local Docker).
2.  **Define Schema**: Create migration scripts or Prisma schema matching the structure above.
3.  **Migration Script**: Create a script to read `data/vehicles.json` and insert data into the new SQL tables, properly mapping nested fields to the `specs` JSONb column.
4.  **Backend Implementation**: Implement the GET endpoints first to replace the current local data fetching.
5.  **AI Integration (Phase 2)**: Add a hook on vehicle create/update to generate embeddings for the `embedding` column automatically.
