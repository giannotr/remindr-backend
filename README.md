# remindr backend

## Mandatory environment secrets / variables

The user must provide a `.env` in the root level of the project setting (or if using Docker, a environment section in the container definition) containing the following keys:

- N8N_BASE_URL
- N8N_API_KEY
- N8N_TABLE_ID
- PIN_CODE
- PORT
- APP_PUBLIC_URL
- APP_DEV_URL

## API / Endpoints

- `GET /api/healthy`
- `POST /api/auth`
- `GET /api/items`
- `POST /api/items`
- `PATHC /api/items/<ID>`
- `DELETE /api/items/<ID>`

## Example

```ts
import { createRemindrApp } from '@remindr/backend'

interface RawDatabaseRow {
	internal_id: string
	label: string
	checked: boolean
}

const app = createRemindrApp<RawDatabaseRow>({
	clientPath: '../client/dist',
	matchKey: 'internal_id',
	mapItemToRow: (item) => ({
		internal_id: item.id,
		label: item.label,
		checked: item.checked,
	}),
})

app.listen(3001)
````
