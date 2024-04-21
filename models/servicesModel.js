const ServicesSchema = new Schema({
    name: { type: String, required: true, unique: true },
    price: { type: Number, required: true },
    category: { type: Schema.Types.ObjectId, ref: 'Category' }
  });
  const Services = mongoose.model('Services', ServicesSchema);