// tokenise.js - CLI Application
import { AutoTokenizer, pipeline } from "@xenova/transformers";
import fs from "fs";
import readline from "readline";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const sentence = "The cat sat on the mat because it was tired.";

// Function to evaluate plausibility of predictions
function evaluatePlausibility(token, maskPosition, originalSentence) {
  const comments = {
    // First mask position (verb)
    1: {
      sat: "Highly plausible - original word, perfect grammatical fit",
      lay: "Plausible - cats do lay on mats, good alternative",
      slept: "Very plausible - cats often sleep on mats",
      stood: "Less plausible - unusual for cats to stand on mats",
      walked: "Less plausible - doesn't fit the context well",
      jumped: "Moderately plausible - cats can jump on mats",
      rested: "Very plausible - similar meaning to the original context",
    },
    // Second mask position (auxiliary verb/state)
    2: {
      was: "Highly plausible - original word, explains the resting behavior perfectly",
      felt: "Very plausible - similar meaning, fits context perfectly",
      seemed: "Very plausible - explains why cat chose the mat",
      got: 'Moderately plausible - "got tired" is common usage, fits context',
      looked: 'Less plausible - "looked tired" changes meaning, less natural',
      became: 'Plausible - "became tired" fits the causal relationship',
      grew: 'Moderately plausible - "grew tired" is acceptable but less common',
      appeared: 'Moderately plausible - "appeared tired" suggests observation',
    },
  };

  const maskComments = comments[maskPosition] || {};
  return (
    maskComments[token] ||
    `Context-dependent - "${token}" may fit depending on intended meaning`
  );
}

// Function to run tokenizer analysis
async function runTokenizerAnalysis() {
  console.log("\n🔤 TOKENIZER ANALYSIS");
  console.log("=".repeat(50));
  console.log(`📝 Input sentence: "${sentence}"`);
  console.log();

  const models = [
    { name: "BPE (bert-base-cased)", model: "bert-base-cased" },
    { name: "WordPiece (bert-base-uncased)", model: "bert-base-uncased" },
    {
      name: "SentencePiece (xlm-roberta-base)",
      model: "Xenova/xlm-roberta-base",
    },
  ];

  for (const { name, model } of models) {
    console.log(`\n🔠 Tokenizer: ${name}`);
    console.log("-".repeat(40));
    try {
      const tokenizer = await AutoTokenizer.from_pretrained(model);

      // Get encoded tokens
      const encoded = await tokenizer(sentence);

      // Handle different return formats
      let tokenIds;
      if (encoded.input_ids && encoded.input_ids.data) {
        tokenIds = Array.from(encoded.input_ids.data);
      } else if (encoded.input_ids) {
        tokenIds = Array.from(encoded.input_ids);
      } else {
        tokenIds = Array.from(encoded);
      }

      console.log("🔢 Token IDs:", tokenIds);
      console.log("📏 Token Count:", tokenIds.length);

      // Decode each token to show the actual text pieces
      const textTokens = [];
      for (const tokenId of tokenIds) {
        try {
          const decodedToken = tokenizer.decode([tokenId], {
            skip_special_tokens: false,
          });
          textTokens.push(decodedToken);
        } catch (e) {
          textTokens.push(`[${tokenId}]`);
        }
      }
      console.log("🧩 Tokens:", textTokens);
    } catch (error) {
      console.error(`❌ Error with ${name}:`, error.message);
    }
  }
}

// Function to run mask prediction
async function runMaskPrediction() {
  console.log("\n🎭 MASK PREDICTION");
  console.log("=".repeat(50));

  const maskedSentence = "The cat [MASK] on the mat because it [MASK] tired.";
  console.log(`📝 Original: "${sentence}"`);
  console.log(`🎭 Masked: "${maskedSentence}"`);
  console.log();

  try {
    console.log("⏳ Loading fill-mask pipeline...");

    // Try to load the model
    let fillMask;
    try {
      fillMask = await pipeline("fill-mask", "Xenova/bert-base-uncased");
    } catch (error) {
      console.log("Trying alternative model...");
      fillMask = await pipeline("fill-mask", "Xenova/distilbert-base-uncased");
    }

    console.log("🔍 Predicting masked tokens...\n");

    const predictions = {
      masked_input: maskedSentence,
      original_sentence: sentence,
      model_used: "BERT-based fill-mask model",
      predictions: {},
    };

    // Process each mask separately
    for (let i = 0; i < 2; i++) {
      const singleMaskSentence =
        i === 0
          ? "The cat [MASK] on the mat because it was tired."
          : "The cat sat on the mat because it [MASK] tired.";

      console.log(`Processing mask ${i + 1}: ${singleMaskSentence}`);

      const results = await fillMask(singleMaskSentence, { topk: 3 });

      // Handle different result formats
      let resultArray = Array.isArray(results) ? results : [results];

      predictions.predictions[`mask_${i + 1}`] = resultArray.map(
        (result, idx) => ({
          rank: idx + 1,
          token: result.token_str,
          score: Number(result.score.toFixed(4)),
          confidence_percentage: Number((result.score * 100).toFixed(2)),
          plausibility_comment: evaluatePlausibility(
            result.token_str,
            i + 1,
            sentence
          ),
        })
      );
    }

    // Display results
    console.log("\n📊 PREDICTION RESULTS");
    console.log("=".repeat(50));
    Object.entries(predictions.predictions).forEach(([maskKey, preds]) => {
      console.log(`\n🔠 ${maskKey.toUpperCase()}:`);
      preds.forEach((p) => {
        console.log(`  ${p.rank}. "${p.token}" (${p.confidence_percentage}%)`);
        console.log(`     💭 ${p.plausibility_comment}`);
      });
    });

    // Save to JSON file using fs module
    fs.writeFileSync("prediction.json", JSON.stringify(predictions, null, 2));
    console.log("\n💾 Predictions saved to prediction.json");
  } catch (err) {
    console.error("❌ Error loading model or making predictions:", err.message);
    console.log(
      "❌ Cannot proceed without a working model. Please check your internet connection or model availability."
    );
  }
}

// Main CLI function
function showMenu() {
  console.log("\n🤖 NLP TOKENIZER & MASK PREDICTION CLI");
  console.log("=".repeat(50));
  console.log("1. 🔤 Tokenizer Types Analysis");
  console.log("2. 🎭 Mask & Predict");
  console.log("3. 🚪 Exit");
  console.log("=".repeat(50));
}

async function handleChoice(choice) {
  switch (choice) {
    case "1":
      await runTokenizerAnalysis();
      break;
    case "2":
      await runMaskPrediction();
      break;
    case "3":
      console.log("\n👋 Goodbye!");
      rl.close();
      return;
    default:
      console.log("\n❌ Invalid choice. Please select 1, 2, or 3.");
  }

  // Show menu again after operation
  setTimeout(() => {
    showMenu();
    rl.question("\n🔍 Enter your choice (1-3): ", handleChoice);
  }, 1000);
}

// Start the CLI
console.log("🚀 Starting NLP CLI Application...");
showMenu();
rl.question("\n🔍 Enter your choice (1-3): ", handleChoice);
