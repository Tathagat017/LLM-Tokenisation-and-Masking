# Tokenisation Comparison: BPE vs WordPiece vs SentencePiece

**Input Sentence:**
`The cat sat on the mat because it was tired.`

---

## 🔠 BPE (bert-base-cased)

- **Token Count:** 13
- **Tokens:**

  ```
  ['[CLS]', 'The', 'cat', 'sat', 'on', 'the', 'mat', 'because', 'it', 'was', 'tired', '.', '[SEP]']
  ```

- **Token IDs:**

  ```
  [101, 1109, 5855, 2068, 1113, 1103, 22591, 1272, 1122, 1108, 4871, 119, 102]
  ```

---

## 🧩 WordPiece (bert-base-uncased)

- **Token Count:** 13
- **Tokens:**

  ```
  ['[CLS]', 'the', 'cat', 'sat', 'on', 'the', 'mat', 'because', 'it', 'was', 'tired', '.', '[SEP]']
  ```

- **Token IDs:**

  ```
  [101, 1996, 4937, 2938, 2006, 1996, 13523, 2138, 2009, 2001, 5458, 1012, 102]
  ```

---

## 🔤 SentencePiece (xlm-roberta-base)

- **Token Count:** 13
- **Tokens:**

  ```
  ['<s>', 'The', 'cat', 'sat', 'on', 'the', 'mat', 'because', 'it', 'was', 'tired', '.', '</s>']
  ```

- **Token IDs:**

  ```
  [0, 581, 7515, 11736, 98, 70, 2589, 6637, 442, 509, 168661, 5, 2]
  ```

---

## 📚 Why Do Token Splits Differ?

### 1. **BPE (Byte-Pair Encoding)**

- Merges frequently co-occurring characters into subwords.
- Efficient for frequent word patterns.
- Output example is close to full words when they are common.
- Often used in BERT and GPT models.

### 2. **WordPiece**

- Similar to BPE, but uses a greedy search to maximize likelihood.
- Out-of-vocabulary words are broken into known subwords with `##` prefix (not visible here as all words were known).
- Used in BERT models like `bert-base-uncased`.

### 3. **SentencePiece (Unigram Model)**

- Treats tokenisation as a probabilistic problem.
- Learns a vocabulary of subword units without whitespace assumptions.
- Special space character “▁” (not rendered here) helps distinguish word boundaries.
- Common in multilingual models like XLM-RoBERTa.

### Commonalities:

- All models include special tokens:

  - `[CLS]`, `[SEP]` in BERT
  - `<s>`, `</s>` in RoBERTa

- SentencePiece tends to be more flexible with unknown or multilingual input.

---

### ✅ Summary

The same sentence can be tokenised differently depending on the strategy and training data of the tokenizer. While all produce 13 tokens in this case, the internal token IDs and subword breakdowns differ significantly.
