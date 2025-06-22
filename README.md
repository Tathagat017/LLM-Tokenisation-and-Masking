# NLP Tokenizer & Mask Prediction CLI

A Node.js CLI application that demonstrates different tokenization strategies and performs masked language model predictions using Transformers.js.

## 🔧 Features

- **Tokenizer Analysis**: Compare three different tokenization strategies:

  - BPE (Byte-Pair Encoding) with `bert-base-cased`
  - WordPiece with `bert-base-uncased`
  - SentencePiece with `xlm-roberta-base`

- **Mask Prediction**: Use BERT-based models to predict masked tokens in sentences with confidence scores and plausibility analysis

- **Interactive CLI**: Easy-to-use command-line interface with menu options

## 📦 Dependencies

This project uses the following packages:

- **@xenova/transformers** (^2.17.2) - JavaScript library for running Transformers models in the browser and Node.js
- **fs** (built-in) - File system operations
- **readline** (built-in) - Interactive command-line interface

## 🚀 Installation

1. **Clone or download the project files**

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Ensure you have Node.js version 14 or higher installed**

## 💻 Usage

### Running the Application

Start the CLI application:

```bash
node tokenise.js
```

### Menu Options

The application provides an interactive menu with three options:

```
🤖 NLP TOKENIZER & MASK PREDICTION CLI
==================================================
1. 🔤 Tokenizer Types Analysis
2. 🎭 Mask & Predict
3. 🚪 Exit
==================================================
```

#### Option 1: Tokenizer Types Analysis

Analyzes the sentence "The cat sat on the mat because it was tired." using three different tokenization strategies:

- Shows token IDs, token count, and actual text tokens for each method
- Demonstrates how different tokenizers split the same text differently
- Results are also documented in `compare.md`

#### Option 2: Mask & Predict

- Takes the sentence and masks two positions: `"The cat [MASK] on the mat because it [MASK] tired."`
- Uses BERT-based fill-mask models to predict the most likely tokens
- Provides top 3 predictions for each mask with:
  - Confidence scores and percentages
  - Plausibility analysis and comments
- Saves detailed results to `prediction.json`

### Example Output Files

- **`prediction.json`**: Contains detailed prediction results with confidence scores and plausibility comments
- **`compare.md`**: Comprehensive comparison of tokenization strategies with examples

## 🔍 How It Works

### Tokenization Analysis

The application loads three different pre-trained tokenizers and processes the same input sentence to demonstrate:

- How BPE, WordPiece, and SentencePiece algorithms differ
- Token ID mappings for each approach
- Special tokens used by different model architectures

### Mask Prediction

Uses Transformers.js to:

1. Load a BERT-based fill-mask pipeline
2. Process masked sentences one mask at a time
3. Generate predictions with confidence scores
4. Provide linguistic plausibility analysis for each prediction

## 🌐 Model Requirements

The application automatically downloads the following models on first run:

- `bert-base-cased` (for BPE tokenization)
- `bert-base-uncased` (for WordPiece tokenization and mask prediction)
- `xlm-roberta-base` (for SentencePiece tokenization)
- `distilbert-base-uncased` (fallback for mask prediction)

**Note**: First run requires internet connection to download models (~100-500MB total).

## 📁 Project Structure

```
q1/
├── tokenise.js          # Main CLI application
├── package.json         # Project dependencies and metadata
├── package-lock.json    # Dependency lock file
├── prediction.json      # Generated prediction results
├── compare.md          # Tokenization comparison documentation
└── README.md           # This file
```

## 🛠️ Troubleshooting

**Model Loading Issues:**

- Ensure stable internet connection for initial model download
- Models are cached locally after first download
- Application will try fallback models if primary ones fail

**Memory Issues:**

- Large language models require significant RAM
- Close other applications if experiencing memory constraints

**Node.js Version:**

- Requires Node.js 14+ for ES modules support
- Update Node.js if encountering module import errors

## 📝 Example Session

```bash
$ node tokenise.js

🤖 NLP TOKENIZER & MASK PREDICTION CLI
==================================================
1. 🔤 Tokenizer Types Analysis
2. 🎭 Mask & Predict
3. 🚪 Exit
==================================================
Enter your choice (1-3): 1

🔤 TOKENIZER ANALYSIS
==================================================
📝 Input sentence: "The cat sat on the mat because it was tired."

🔠 Tokenizer: BPE (bert-base-cased)
----------------------------------------
🔢 Token IDs: [101, 1109, 5855, 2068, 1113, 1103, 22591, 1272, 1122, 1108, 4871, 119, 102]
📏 Token Count: 13
🧩 Tokens: ['[CLS]', 'The', 'cat', 'sat', 'on', 'the', 'mat', 'because', 'it', 'was', 'tired', '.', '[SEP]']
```

## 📄 License

ISC License
