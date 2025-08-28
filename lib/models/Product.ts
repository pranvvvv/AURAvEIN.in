import mongoose, { Schema, models, model } from 'mongoose'

const ProductSchema = new Schema({
  title: { type: String, required: true },
  description: String,
  price: { type: Number, required: true },
  image: String,
  stock: { type: Number, default: 0 }
}, { timestamps: true })

export default (models.Product as mongoose.Model<any>) || model('Product', ProductSchema)
