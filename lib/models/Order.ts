import mongoose, { Schema, models, model } from 'mongoose'

const OrderItemSchema = new Schema({
  product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
  quantity: { type: Number, required: true }
}, { _id: false })

const OrderSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  products: [OrderItemSchema],
  totalPrice: { type: Number, required: true },
  status: { type: String, enum: ['pending','processing','shipped','delivered'], default: 'pending' }
}, { timestamps: true })

export default (models.Order as mongoose.Model<any>) || model('Order', OrderSchema)
