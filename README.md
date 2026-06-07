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

- `GET /api/healthy`: Check the status of the API. Returns `{ ok: boolean }`
- `POST /api/auth`: Checks if the pin entered by the user matches the configured. Returns: `{ authCheck: boolean }`
- `GET /api/items`: Fetch all 'remindr' items from the n8n data table.
- `POST /api/items`: Add an item to the n8n data table.
- `PATHC /api/items/<ID>`: Updates the item `<ID>`.
- `DELETE /api/items/<ID>`: Deletes the item `<ID>`.

## Example

```ts
import express from 'express'
import path from 'node:path'
import { createRemindrApi } from '@remindr/backend'

interface RawDatabaseRow {
	internal_id: string
	label: string
	checked: boolean
}

const app = createRemindrApi<RawDatabaseRow>({
	matchKey: 'internal_id',
	mapItemToRow: (item) => ({
		internal_id: item.id,
		label: item.label,
		checked: item.checked,
	}),
})

if (process.env.NODE_ENV === 'production') {
	const frontendDistPath = path.resolve(process.cwd(), '../client/dist')

	app.use(express.static(frontendDistPath))

	app.use((_req, res) => {
		res.sendFile(path.join(frontendDistPath, 'index.html'))
	})
}

app.listen(process.env.PORT ?? 3000)
````
