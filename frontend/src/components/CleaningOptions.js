import React, { useState } from 'react';
import './CleaningOptions.css';

const CleaningOptions = ({ sessionId, columns, onClean, loading, setLoading }) => {
  const [options, setOptions] = useState({
    numeric_null_strategy: 'fill_mean',
    text_null_strategy: 'fill_missing',
    outlier_method: 'iqr',
    outlier_threshold: 1.5,
    outlier_strategy: 'remove',
    text_conversion: [],
    remove_duplicates: false,
    columns_to_drop: []
  });

  const [log, setLog] = useState([]);

  const handleSuggest = async () => {
    setLoading(true);
    try {
      const resp = await fetch(`http://localhost:8000/suggest_config/${sessionId}`);
      const data = await resp.json();
      if (data) {
        setOptions(prev => ({ ...prev, ...data }));
        setLog(prev => [{ time: new Date().toLocaleTimeString(), msg: "AI Analysis: Suggested optimal configuration based on dataset profile." }, ...prev]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleClean = async () => {
    setLoading(true);
    try {
      const resp = await fetch(`http://localhost:8000/clean`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...options, session_id: sessionId })
      });
      const data = await resp.json();
      onClean(data);
      setLog(prev => [{ time: new Date().toLocaleTimeString(), msg: `Status: Dataset cleaned successfully.` }, ...prev]);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const toggleColumn = (col) => {
    setOptions(prev => ({
      ...prev,
      columns_to_drop: prev.columns_to_drop.includes(col)
        ? prev.columns_to_drop.filter(c => c !== col)
        : [...prev.columns_to_drop, col]
    }));
  };

  const toggleTextOp = (op) => {
    setOptions(prev => ({
      ...prev,
      text_conversion: prev.text_conversion.includes(op)
        ? prev.text_conversion.filter(o => o !== op)
        : [...prev.text_conversion, op]
    }));
  };

  const handleExportNotebook = async () => {
    window.open(`http://localhost:8000/export_notebook/${sessionId}`, '_blank');
  };

  const handleDownloadReport = async () => {
    window.open(`http://localhost:8000/download_report/${sessionId}`, '_blank');
  };

  const handleDownloadData = () => {
    window.open(`http://localhost:8000/download/${sessionId}`, '_blank');
  };

  return (
    <div className="cleaning-options-card">
      <div className="cleaning-options-grid">
        {/* COLUMN MANAGEMENT */}
        <div className="option-group full-width">
          <div className="option-group-title">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18"><path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
            Column Management
          </div>
          <p className="group-desc">Select columns you wish to exclude from the final dataset.</p>
          <div className="column-selector">
            {columns.map((col, idx) => (
              <div
                key={idx}
                className={`column-chip ${options.columns_to_drop.includes(col) ? 'selected' : ''}`}
                onClick={() => toggleColumn(col)}
              >
                {col}
                {options.columns_to_drop.includes(col) && <span className="remove-icon">×</span>}
              </div>
            ))}
          </div>
        </div>

        {/* NULL HANDLING */}
        <div className="option-group">
          <div className="option-group-title">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18"><path d="M12 2v20M2 12h20"></path></svg>
            Null Handling
          </div>
          <div className="input-field">
            <label>Numerical Imputation</label>
            <select value={options.numeric_null_strategy} onChange={e => setOptions({ ...options, numeric_null_strategy: e.target.value })}>
              <option value="fill_mean">Mean Imputation</option>
              <option value="fill_median">Median Imputation</option>
              <option value="fill_zero">Zero Fill</option>
              <option value="remove">Remove Rows</option>
            </select>
          </div>
          <div className="input-field">
            <label>Text Imputation</label>
            <select value={options.text_null_strategy} onChange={e => setOptions({ ...options, text_null_strategy: e.target.value })}>
              <option value="fill_missing">Missing Label</option>
              <option value="fill_mode">Most Frequent</option>
              <option value="remove">Remove Rows</option>
            </select>
          </div>
        </div>

        {/* OUTLIER DETECTION */}
        <div className="option-group">
          <div className="option-group-title">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
            Outlier Management
          </div>
          <div className="input-field">
            <label>Detection Method</label>
            <select value={options.outlier_method} onChange={e => setOptions({ ...options, outlier_method: e.target.value })}>
              <option value="iqr">Interquartile Range (IQR)</option>
              <option value="zscore">Z-Score</option>
            </select>
          </div>
          <div className="input-field">
            <label>Action Strategy</label>
            <select value={options.outlier_strategy} onChange={e => setOptions({ ...options, outlier_strategy: e.target.value })}>
              <option value="remove">Remove Outliers</option>
              <option value="cap">Cap / Winzorize</option>
              <option value="adjust">Replace with Median</option>
              <option value="none">Disabled</option>
            </select>
          </div>
        </div>

        {/* TEXT STANDARDIZATION */}
        <div className="option-group">
          <div className="option-group-title">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18"><path d="M4 7V4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v3"></path><path d="M9 11v10"></path><path d="M15 11v10"></path><path d="M8 22h8"></path><path d="M10 7H2a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h10"></path></svg>
            Standardization
          </div>
          <div className="checkbox-grid">
            <label className="checkbox-item">
              <input type="checkbox" checked={options.remove_duplicates} onChange={e => setOptions({ ...options, remove_duplicates: e.target.checked })} />
              Deduplicate Rows
            </label>
            <label className="checkbox-item">
              <input type="checkbox" checked={options.text_conversion.includes('trim')} onChange={() => toggleTextOp('trim')} />
              Trim Whitespace
            </label>
            <label className="checkbox-item">
              <input type="checkbox" checked={options.text_conversion.includes('lower')} onChange={() => toggleTextOp('lower')} />
              To Lowercase
            </label>
            <label className="checkbox-item">
              <input type="checkbox" checked={options.text_conversion.includes('remove_special')} onChange={() => toggleTextOp('remove_special')} />
              Clear Special Chars
            </label>
          </div>
        </div>
      </div>

      <div className="action-bar">
        <div className="primary-actions">
          <button className="btn btn-suggest" onClick={handleSuggest} disabled={loading}>
            AI Auto-Suggest
          </button>
          <button className="btn btn-clean" onClick={handleClean} disabled={loading}>
            {loading ? 'Processing...' : 'Clean Data'}
          </button>
          <button className="btn btn-download" onClick={handleDownloadData} style={{ background: '#ecfdf5', color: '#059669', border: '1px solid #10b981' }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" style={{ marginRight: '8px' }}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
            Download Dataset
          </button>
        </div>

        <div className="primary-actions">
          <button className="btn btn-export" onClick={handleExportNotebook}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline></svg>
            Notebook (.ipynb)
          </button>
          <button className="btn btn-report" onClick={handleDownloadReport}>
            Audit Report
          </button>
        </div>
      </div>

      {log.length > 0 && (
        <div className="cleaning-log">
          {log.map((entry, idx) => (
            <div key={idx} className="log-entry">
              <span className="log-time">[{entry.time}]</span>
              <span className="log-msg">{entry.msg}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CleaningOptions;
