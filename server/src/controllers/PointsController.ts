import { Response, Request } from 'express'
import knex from '../database/connection'

class PointsController {
  async create(req: Request, res: Response) {
    const {
       name,
       email,
       whatsapp,
       latitude,
       longitude,
       city,
       uf,
       items
    } = req.body
    
    const trx = await knex.transaction()
    
    const point = {
      image: 'https://images.unsplash.com/photo-1529686786214-513a02fe2a64?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=400&q=60',
      name,
      email,
      whatsapp,
      latitude,
      longitude,
      city,
      uf
    }
    const insertedIds = await trx('points').insert(point)

    const point_id = insertedIds[0]

    const pointItems = items.map( (item_id: number) => {
       return {
           item_id,
           point_id
       }
    })

    await trx('point_items').insert(pointItems)

    await trx.commit()

    return res.json({
      id: point_id,
      ...point
    })
  }

  async index(req: Request, res: Response) {
    const { city, uf, items } = req.query

    const arrayItems = String(items).split(',').map(item => Number(item.trim()))

    const points = await knex('points')
      .join('point_items', 'points.id', '=', 'point_items.point_id')
      .whereIn('point_items.item_id', arrayItems)
      .where('city', String(city))
      .where('uf', String(uf))
      .distinct()
      .select('points.*')

    return res.json({ message: 'success', data: points })
  }
  async show(req: Request, res: Response) {
    const { id } = req.params
    console.log(id)
    const point = await knex('points').where('id', id).first()

    if (!point) {
      return res.status(400).json({ message: 'Point not found!'})
    }
    const items = await knex('items')
      .join('point_items', 'items.id', '=', 'point_items.item_id')
      .where('point_items.point_id', id)
      .select('items.title')

    return res.status(200).json({message: 'success', data: { point, items } })
  }
}

export default PointsController;