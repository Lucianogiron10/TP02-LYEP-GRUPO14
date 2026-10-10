import mongoose from "mongoose";

const nombreSchema = new mongoose.Schema(
  {
    firstname: { type: String, required: true, trim: true },
    lastname: { type: String, required: true, trim: true },
  },
  { _id: false },
);

const direccionSchema = new mongoose.Schema(
  {
    city: { type: String, required: true, trim: true },
    street: { type: String, trim: true, default: "" },
    number: { type: Number, min: 0 },
    zipcode: { type: String, trim: true, default: "" },
  },
  { _id: false },
);

const clienteSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    },
    username: { type: String, trim: true, default: "" },
    name: { type: nombreSchema, required: true },
    address: { type: direccionSchema, required: true },
    phone: { type: String, required: true, trim: true },
  },
  { timestamps: true, versionKey: false },
);

const Cliente =
  mongoose.models.Cliente || mongoose.model("Cliente", clienteSchema);

export default Cliente;
