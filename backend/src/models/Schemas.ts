import mongoose from "mongoose";


const CardDataSchema = new mongoose.Schema(
  {
    title: String,
    beneficiaryState: String,
    schemeShortTitle: String,
    level: String,
    schemeFor: String,
    schemeCategory: [String],
    schemeName: String,
    schemeCloseDate: { type: Date, default: null },
    priority: Number,
    briefDescription: String,
    tags: [String],
  },
  { _id: false }
);

const ContentBlockSchema = new mongoose.Schema(
  {
    type: { type: String }, // "text" | "list" | "table"
    value: String,
    items: [String],
    rows: [[String]],
    links: [
      {
        text: String,
        href: String,
      },
    ],
  },
  { _id: false }
);

const SchemeSchema = new mongoose.Schema(
  {
    url: String,

    slug: { type: String, required: true, unique: true, index: true },

    cardData: CardDataSchema,

    schemeDetails: {
      details: {
        structured: [ContentBlockSchema],
        plainText: String,
      },
      benefits: {
        structured: [ContentBlockSchema],
        plainText: String,
      },
      eligibility: {
        structured: [ContentBlockSchema],
        plainText: String,
      },
      exclusions: {
        structured: [ContentBlockSchema],
        plainText: String,
      },
      documentsRequired: {
        structured: [ContentBlockSchema],
        plainText: String,
      },

      // ✅ FIXED
      applicationProcess: {
        online: {
          structured: [ContentBlockSchema],
          plainText: String,
        },
        offline: {
          structured: [ContentBlockSchema],
          plainText: String,
        },
      },
    },
    // FLAGS
    isScraped: { type: Boolean, default: false, index: true },
    scrapedAt: Date,
  },
  {
    timestamps: true, 
  }
);


export type Scheme = mongoose.InferSchemaType<typeof SchemeSchema>;


export const SchemeModel = mongoose.model("schemes", SchemeSchema);