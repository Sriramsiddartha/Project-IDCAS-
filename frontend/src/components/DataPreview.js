import React from 'react';
import './DataPreview.css';

const DataPreview = ({ dataInfo }) => {
  if (!dataInfo || !dataInfo.sample_data) return null;

  const getQualityClass = (score) => {
    if (!score) return 'quality-mid';
    if (score >= 80) return 'quality-high';
    if (score >= 50) return 'quality-mid';
    return 'quality-low';
  };

  return (
    <div className="data-preview-inner">
      <div className="preview-meta">
        <div className="meta-item">
          <span className="meta-label">Total Rows</span>
          <span className="meta-value">{dataInfo.shape[0].toLocaleString()}</span>
        </div>
        <div className="meta-item">
          <span className="meta-label">Total Columns</span>
          <span className="meta-value">{dataInfo.shape[1]}</span>
        </div>
        <div className="meta-item">
          <span className="meta-label">Data Health</span>
          <span className={`meta-value ${getQualityClass(dataInfo.quality_score)}`}>
            {dataInfo.quality_score ? `${dataInfo.quality_score}%` : 'Calculating...'}
          </span>
        </div>
      </div>

      <div className="table-container">
        <table className="custom-table">
          <thead>
            <tr>
              {dataInfo.columns.map((col, idx) => (
                <th key={idx}>{col}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {dataInfo.sample_data.map((row, rowIdx) => (
              <tr key={rowIdx}>
                {dataInfo.columns.map((col, colIdx) => (
                  <td key={colIdx}>
                    {row[col] === null || row[col] === undefined || row[col] === '' ? (
                      <span className="null-cell">null</span>
                    ) : (
                      row[col].toString()
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DataPreview;
