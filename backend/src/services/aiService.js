const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(
  process.env.GEMINI_API_KEY
);

// const OpenAI = require("openai");
// const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

/**
 * ------------------------------------------------------------------
 * 1) PARSE NATURAL LANGUAGE RFP → STRUCTURED JSON
 * ------------------------------------------------------------------
 */
// exports.parseRfpFromNL = async (text) => {
//   const prompt = `
// You are a professional procurement assistant.
// Convert the following natural language RFP description into CLEAN JSON.

// IMPORTANT RULES:
// - Return ONLY JSON. No explanation. No text outside JSON.
// - If value is missing, set it to null.
// - Make sure it is valid JSON.

// JSON FORMAT:
// {
//   "title": string,
//   "items": [
//     { "name": string, "qty": number, "specs": string }
//   ],
//   "budget": { "amount": number, "currency": string },
//   "delivery_days": number,
//   "payment_terms": string,
//   "warranty_months": number,
//   "notes": string
// }

// RFP DESCRIPTION:
// ${text}
//   `;

//   const response = await client.responses.create({
//     model: "gpt-4o-mini",
//     input: prompt,
//   });

//   const raw = response.output_text;

//   try {
//     return JSON.parse(raw);
//   } catch (err) {
//     const match = raw.match(/\{[\s\S]*\}/);
//     if (match) return JSON.parse(match[0]);
//     throw new Error("AI could not generate valid JSON for RFP");
//   }
// };














exports.parseRfpFromNL = async (text) => {
  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
  });

  const prompt = `
Convert this procurement request into JSON.

Return ONLY valid JSON.

Format:
{
  "title": "",
  "items": [
    {
      "name": "",
      "qty": 0,
      "specs": ""
    }
  ],
  "budget": {
    "amount": 0,
    "currency": ""
  },
  "delivery_days": 0,
  "payment_terms": "",
  "warranty_months": 0,
  "notes": ""
}

Request:
${text}
`;

  const result = await model.generateContent(prompt);

  const raw = result.response.text();

  try {
    return JSON.parse(raw);
  } catch (err) {
    const match = raw.match(/\{[\s\S]*\}/);
    if (match) return JSON.parse(match[0]);

    throw new Error("Gemini could not generate valid JSON");
  }
};







/**
 *  PARSE VENDOR EMAIL → STRUCTURED PROPOSAL JSON
 */
// exports.parseProposalFromEmail = async (emailText) => {
//   const prompt = `
// You are an AI that extracts proposal data from vendor emails.
// Convert the vendor email below into CLEAN JSON.

// IMPORTANT RULES:
// - Return ONLY JSON.
// - Avoid text outside JSON.
// - If something is not provided, set it to null.
// - Try to detect all prices, quantities, delivery, warranty, payment terms.

// JSON FORMAT:
// {
//   "line_items": [
//     { "desc": string, "qty": number, "unit_price": number, "total": number }
//   ],
//   "total_price": number,
//   "delivery_days": number,
//   "warranty_months": number,
//   "payment_terms": string,
//   "notes": string
// }

// VENDOR EMAIL:
// ${emailText}
//   `;

//   // const response = await client.responses.create({
//   //   model: "gpt-4o-mini",
//   //   input: prompt,
//   // });
// try {
//   const response = await client.responses.create({
//     model: "gpt-4o-mini",
//     input: prompt,
//   });

//   console.log("OpenAI response received");

//   const raw = response.output_text;

//   try {
//     return JSON.parse(raw);
//   } catch (err) {
//     const match = raw.match(/\{[\s\S]*\}/);
//     if (match) return JSON.parse(match[0]);

//     throw new Error("AI could not generate valid JSON");
//   }
// } catch (err) {
//   console.error("OPENAI ERROR:");
//   console.error(err);
//   throw err;
// }
//   const raw = response.output_text;

//   try {
//     return JSON.parse(raw);
//   } catch (err) {
//     const match = raw.match(/\{[\s\S]*\}/);
//     if (match) return JSON.parse(match[0]);
//     throw new Error("AI could not generate valid JSON for proposal");
//   }
// };



// exports.parseProposalFromEmail = async (emailText) => {
//   const model = genAI.getGenerativeModel({
//     model: "gemini-2.5-flash",
//   });

// const prompt = `
// Convert this procurement request into JSON.

// IMPORTANT RULES:
// - Return ONLY valid JSON.
// - Extract quantities accurately.
// - If request says "60 laptops", qty MUST be 60.
// - If request says "20 chairs", qty MUST be 20.
// - Do not set qty to 0 if a quantity exists in the text.

// Format:
// {
//   "title": "",
//   "items": [
//     {
//       "name": "",
//       "qty": 0,
//       "specs": ""
//     }
//   ],
//   "budget": {
//     "amount": 0,
//     "currency": ""
//   },
//   "delivery_days": 0,
//   "payment_terms": "",
//   "warranty_months": 0,
//   "notes": ""
// }

// Request:
// ${text}
// `;

//   const result = await model.generateContent(prompt);

//   const raw = result.response.text();

//   try {
//     return JSON.parse(raw);
//   } catch (err) {
//     const match = raw.match(/\{[\s\S]*\}/);
//     if (match) return JSON.parse(match[0]);

//     throw new Error("Gemini could not generate valid proposal JSON");
//   }
// };

exports.parseProposalFromEmail = async (emailText) => {
  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
  });

  const prompt = `
Convert this vendor proposal email into JSON.

Return ONLY valid JSON.

Format:
{
  "line_items": [
    {
      "desc": "",
      "qty": 0,
      "unit_price": 0,
      "total": 0
    }
  ],
  "total_price": 0,
  "delivery_days": 0,
  "warranty_months": 0,
  "payment_terms": "",
  "notes": ""
}

Vendor Email:
${emailText}
`;

  const result = await model.generateContent(prompt);

  const raw = result.response.text();

  try {
    return JSON.parse(raw);
  } catch (err) {
    const match = raw.match(/\{[\s\S]*\}/);

    if (match) {
      return JSON.parse(match[0]);
    }

    throw new Error("Gemini could not generate valid proposal JSON");
  }
};