const Rfp = require("../models/Rfp");
const { parseRfpFromNL } = require("../services/aiService");

// exports.createRfp = async (req, res) => {
//   try {
//     const { text } = req.body;

//     // AI converts natural language to structured RFP JSON
//     const structured = await parseRfpFromNL(text);

//     const newRfp = await Rfp.create({
//       title: structured.title || "Untitled RFP",
//       description: text,
//       structured,
//     });

//     res.json(newRfp);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };/
exports.createRfp = async (req, res) => {
  try {
    console.log("=== CREATE RFP ===");
    console.log("BODY:", req.body);

    const { text } = req.body;

    const structured = await parseRfpFromNL(text);
// const structured = {
//   title: "Test RFP",
//   items: [],
//   budget: {
//     amount: 1000,
//     currency: "USD",
//   },
// };
    console.log("AI RESULT:", structured);

    const newRfp = await Rfp.create({
      title: structured.title || "Untitled RFP",
      description: text,
      structured,
    });

    res.json(newRfp);
  } catch (err) {
    console.error("=== ERROR ===");
    console.error(err);

    res.status(500).json({
      error: err.message,
      stack: err.stack,
    });
  }
};
const Proposal = require("../models/Proposal");

exports.getRfpDetails = async (req, res) => {
  try {
    const rfp = await Rfp.findById(req.params.id);
    const proposals = await Proposal.find({ rfp: req.params.id }).populate(
      "vendor"
    );

    res.json({ rfp, proposals });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch details" });
  }
};

exports.getAllRfps = async (req, res) => {
  const rfps = await Rfp.find().sort({ createdAt: -1 });
  res.json(rfps);
};

exports.getSingleRfp = async (req, res) => {
  const rfp = await Rfp.findById(req.params.id).populate("proposals");
  res.json(rfp);
};
