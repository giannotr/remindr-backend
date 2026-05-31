import { Router } from 'express'
import { n8nHeaders, n8nRowsUrl } from '../n8n.js'

export function createItemsRouter<T>(
  mapItemToRow: (item: {
    id: string
    label: string
    checked: boolean
  }) => Partial<T>,
	matchKey = 'id'
) {
  const router = Router()

	router.get('/', async (_req, res) => {
		const response = await fetch(n8nRowsUrl, {
			headers: n8nHeaders,
		})

		const data = await response.json()
		res.status(response.status).json(data)
	})

  router.post('/', async (req, res) => {
		const { body } = req

		const response = await fetch(n8nRowsUrl, {
			method: 'POST',
			headers: n8nHeaders,
			body: JSON.stringify({
				data: [
					mapItemToRow({
						id: body.id,
						label: body.label,
						checked: false,
					}),
				],
			}),
		})

		const data = await response.json()
		res.status(response.status).json(data)
	})

	router.patch('/:id', async (req, res) => {
		const { body } = req
		const response = await fetch(`${n8nRowsUrl}/update`, {
			method: 'PATCH',
			headers: n8nHeaders,
			body: JSON.stringify({
				filter: {
					type: 'and',
					filters: [
						{
							columnName: matchKey,
							condition: 'eq',
							value: req.params.id,
						},
					],
				},
				data: {
					checked: body.checked
				},
			}),
		})

		const data = await response.json()
		res.status(response.status).json(data)
	})

	router.delete('/:id', async (req, res) => {
		const filter = {
			type: 'and',
			filters: [
				{
					columnName: matchKey,
					condition: 'eq',
					value: req.params.id,
				},
			],
		}

		const params = new URLSearchParams({
			filter: JSON.stringify(filter),
		})

		const response = await fetch(`${n8nRowsUrl}/delete?${params}`, {
			method: 'DELETE',
			headers: {
				Accept: 'application/json',
				'X-N8N-API-KEY': n8nHeaders['X-N8N-API-KEY'],
			},
		})

		const data = await response.json()
		res.status(response.status).json(data)
	})

  return router
}
