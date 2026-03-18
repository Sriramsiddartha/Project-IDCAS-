import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell, ScatterChart, Scatter
} from 'recharts';
import './DataVisualization.css';

const API_URL = 'http://127.0.0.1:8000';
const COLORS = ['#0070f3', '#7928ca', '#ff0080', '#00dfd8', '#ff4d4d', '#ffaa00', '#00ff88', '#00b4d8'];

const DataVisualization = ({ sessionId, dataInfo }) => {
  const [stats, setStats] = useState(null);
  const [histograms, setHistograms] = useState(null);
  const [categoricalData, setCategoricalData] = useState(null);
  const [scatterData, setScatterData] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedHistCol, setSelectedHistCol] = useState(null);
  const [selectedCatCol, setSelectedCatCol] = useState(null);
  const [catChartType, setCatChartType] = useState('bar');
  const [scatterX, setScatterX] = useState(null);
  const [scatterY, setScatterY] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [statsRes, histRes, catRes, dataRes] = await Promise.all([
          axios.get(`${API_URL}/stats/${sessionId}`),
          axios.get(`${API_URL}/histogram/${sessionId}`),
          axios.get(`${API_URL}/categorical/${sessionId}`),
          axios.get(`${API_URL}/data/${sessionId}`)
        ]);

        setStats(statsRes.data);
        setHistograms(histRes.data);
        setCategoricalData(catRes.data);
        setScatterData(dataRes.data.data.slice(0, 500));

        if (histRes.data && Object.keys(histRes.data).length > 0) {
          setSelectedHistCol(Object.keys(histRes.data)[0]);
        }
        if (catRes.data && Object.keys(catRes.data).length > 0) {
          setSelectedCatCol(Object.keys(catRes.data)[0]);
        }

        const numCols = Object.keys(statsRes.data);
        if (numCols.length >= 2) {
          setScatterX(numCols[0]);
          setScatterY(numCols[1]);
        }

        setLoading(false);
      } catch (error) {
        console.error('Error fetching visualization data:', error);
        setLoading(false);
      }
    };

    if (sessionId) fetchData();
  }, [sessionId, dataInfo]);

  if (loading) return <div className="no-data-premium">Analyzing dataset insights...</div>;

  const nullData = dataInfo?.null_counts ? Object.entries(dataInfo.null_counts)
    .filter(([_, count]) => count > 0)
    .map(([col, count]) => ({ name: col, value: count }))
    : [];

  const currentHistData = (selectedHistCol && histograms && histograms[selectedHistCol])
    ? histograms[selectedHistCol].bins.map((bin, i) => ({
      bin: parseFloat(bin).toFixed(2),
      count: histograms[selectedHistCol].counts[i]
    }))
    : [];

  const currentCatData = (selectedCatCol && categoricalData && categoricalData[selectedCatCol])
    ? categoricalData[selectedCatCol].labels.map((label, i) => ({
      name: label,
      value: categoricalData[selectedCatCol].counts[i]
    }))
    : [];

  return (
    <div className="data-visualization">
      {/* SUMMARY CARDS */}
      <div className="summary-cards-grid">
        <div className="summary-card-premium">
          <div className="card-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline></svg>
          </div>
          <div className="card-info">
            <span className="card-label">Total Rows</span>
            <span className="card-value">{dataInfo?.shape[0].toLocaleString()}</span>
          </div>
        </div>
        <div className="summary-card-premium">
          <div className="card-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20"><line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line></svg>
          </div>
          <div className="card-info">
            <span className="card-label">Feature Vector</span>
            <span className="card-value">{dataInfo?.shape[1]}</span>
          </div>
        </div>
        <div className="summary-card-premium">
          <div className="card-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>
          </div>
          <div className="card-info">
            <span className="card-label">Missing Units</span>
            <span className="card-value">
              {Object.values(dataInfo?.null_counts || {}).reduce((a, b) => a + b, 0).toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      {/* CHANNELS GRID */}
      <div className="viz-grid">
        {/* NULL OVERVIEW */}
        <div className="chart-container">
          <div className="chart-title">
            Null Variance Overview
          </div>
          {nullData.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={nullData} layout="vertical" margin={{ left: 20, right: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" horizontal={true} vertical={false} />
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" stroke="#64748b" fontSize={11} width={100} />
                <Tooltip cursor={{ fill: 'rgba(239, 68, 68, 0.05)' }} />
                <Bar dataKey="value" fill="url(#colorNulls)" radius={[0, 4, 4, 0]} barSize={20} />
                <defs>
                  <linearGradient id="colorNulls" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#f97316" stopOpacity={0.8} />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="no-data-premium">No Null Values Detected</div>
          )}
        </div>

        {/* DISTRIBUTIONS */}
        <div className="chart-container">
          <div className="chart-header-premium">
            <div className="chart-title">Feature Distribution</div>
            <select
              className="chart-select-premium"
              value={selectedHistCol || ''}
              onChange={(e) => setSelectedHistCol(e.target.value)}
            >
              {Object.keys(histograms || {}).map(col => <option key={col} value={col}>{col}</option>)}
            </select>
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={currentHistData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="bin" stroke="#64748b" fontSize={10} />
              <YAxis stroke="#64748b" fontSize={10} />
              <Tooltip cursor={{ fill: 'rgba(0,112,243,0.05)' }} />
              <Bar dataKey="count" fill="url(#colorAccent)" radius={[4, 4, 0, 0]} />
              <defs>
                <linearGradient id="colorAccent" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0070f3" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#7928ca" stopOpacity={0.8} />
                </linearGradient>
              </defs>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* CORRELATION MAP */}
      <div className="chart-container" style={{ marginTop: '30px' }}>
        <div className="chart-header-premium">
          <div className="chart-title">Correlation Analysis</div>
          <div className="chart-controls-premium">
            <select className="chart-select-premium" value={scatterX} onChange={(e) => setScatterX(e.target.value)}>
              {Object.keys(histograms || {}).map(col => <option key={col} value={col}>{col}</option>)}
            </select>
            <span style={{ color: '#94a3b8', margin: '0 10px' }}>vs</span>
            <select className="chart-select-premium" value={scatterY} onChange={(e) => setScatterY(e.target.value)}>
              {Object.keys(histograms || {}).map(col => <option key={col} value={col}>{col}</option>)}
            </select>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <ScatterChart>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis type="number" dataKey={scatterX} stroke="#64748b" fontSize={10} label={{ value: scatterX, position: 'insideBottom', offset: -5, fontSize: 12, fill: '#64748b' }} />
            <YAxis type="number" dataKey={scatterY} stroke="#64748b" fontSize={10} label={{ value: scatterY, angle: -90, position: 'insideLeft', fontSize: 12, fill: '#64748b' }} />
            <Tooltip cursor={{ strokeDasharray: '3 3' }} />
            <Scatter name="Data points" data={scatterData} fill="#0070f3" />
          </ScatterChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
  ;

export default DataVisualization;
