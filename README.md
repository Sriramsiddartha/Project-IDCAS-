<div align="center">
  <img src="https://img.icons8.com/m_outlined/200/4d4d4d/database-export.png" alt="IDCAS Logo" width="100"/>
  <h1>IDCAS: Intelligent Data Cleaning & Analysis System</h1>
  <p>
    <em>A full-stack, AI-augmented web application designed to bridge the gap between automated data preparation and professional data science workflows.</em>
  </p>
  
  <p>
    <a href="#-key-features">Features</a> •
    <a href="#-system-architecture">Architecture</a> •
    <a href="#-getting-started">Getting Started</a> •
    <a href="#-api-documentation">API</a>
  </p>

  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" />
  <img src="https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white" />
  <img src="https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white" />
  <img src="https://img.shields.io/badge/Llama_3-0466C8?style=for-the-badge&logo=meta&logoColor=white" />
</div>

---

## 🌟 Core Innovation: The Hybrid Approach

Unlike standard "black-box" cleaning tools, IDCAS uses a **Statistical Meta-Profile** approach. The local AI (powered by Llama 3) **never sees your raw sensitive data**. Instead, it receives a compact "fingerprint" of your dataset's health to provide expert-grade guidance and automated configuration. This guarantees data privacy while providing state-of-the-art cleaning recommendations.

## 🚀 Key Features

### 1. 🔍 Comprehensive Profiling
* **Deterministic Quality Scoring**: A 0-100 "health score" derived from null ratios, duplicate patterns, constant columns, and numerical skewness.
* **Dual-Format Ingestion**: Native support for **CSV** and high-fidelity table extraction from **PDF** documents.
* **Exploratory Visualization**: Real-time histograms and categorical bar charts generated instantly upon upload.

### 2. ✨ AI-Driven Configuration
* **AI Auto-Suggest**: One-click configuration. Llama 3 analyzes your data profile and suggests optimal cleaning parameters (e.g., Z-Score vs. IQR thresholds) tailored to your specific dataset.
* **Zero-Noise AI Assistant**: A refined chat interface that provides direct, step-by-step cleaning plans and model recommendations without AI filler.

### 3. 🛠️ Advanced Cleaning Engine
* **Numeric Handling**: Complete strategy selection for nulls (Mean/Median/Zero) and outliers (Remove/Cap/Adjust).
* **Text Standardization**: Automated whitespace trimming, case normalization, and regex-based special character removal.
* **Audit Logic**: Every single change is tracked meticulously in an internal provenance log.

### 4. 📄 Professional Exports & Reproducibility
* **Jupyter Notebook (.ipynb) Export**: Maps your GUI cleaning session to runnable, vectorized Pandas code in a standard notebook format.
* **Markdown Audit Report**: Generates a professional, journal-ready report documenting every transformation and the final data quality state.
* **Cleaned CSV**: Instant download of the processed dataset.

---

## 🏗️ System Architecture

IDCAS follows a modern, decoupled three-layer architecture:

1. **Application Layer**: A highly responsive React.js Dashboard and Agent Chat interface.
2. **API Layer**: FastAPI Python backend orchestrating parallel processing and AI endpoints.
3. **Data & Intelligence Layer**: Pandas/NumPy for rapid data processing, Llama 3 (via Ollama) for local, secure AI inferences.

---

## 💻 Getting Started

### Prerequisites
* **Python 3.8+**
* **Node.js 14+**
* **[Ollama](https://ollama.ai/)** with the `llama3` model pulled locally.
* **Java** (Required for PDF extraction features).

### 1. Backend Setup

Navigate to the `backend` directory and set up your Python environment:

```bash
cd backend
python -m venv venv

# Activate the virtual environment
# Windows:
venv\Scripts\activate 
# Mac/Linux:
source venv/bin/activate

# Install requirements and run server
pip install -r requirements.txt
python main.py
```

### 2. Frontend Setup

In a new terminal, navigate to the `frontend` directory:

```bash
cd frontend
npm install
npm start
```

Alternatively, run the included `start_servers.bat` script on Windows to bootstrap both application layers simultaneously!

---

## 📡 API Endpoints Reference

| Method | Endpoint | Description |
| :---: | :--- | :--- |
| `POST` | `/upload` | Ingests file and computes initial Profile/Quality Score |
| `GET` | `/suggest_config` | AI routine returning optimized JSON cleaning parameters |
| `POST` | `/clean` | Applies vectorized transformations and updates Audit Log |
| `GET` | `/export_notebook` | Maps Audit Log to Pandas code in Notebook format |
| `POST` | `/ask_llm` | Queries refined Llama 3 expert for strategy |
| `GET` | `/report` | Returns Markdown session summary |

---

## 🎓 Academic Research Context
This project was developed as part of academic research titled **"IDCAS: A Web-Based Intelligent Data Cleaning and Analysis System"**. It addresses the "Black Box" cleaning problem by providing 100% code-level transparency through its automated export modules and robust audit logging.

<div align="center">
  <i>Developed to bring transparency and efficiency to the data science pipeline.</i>
</div>
